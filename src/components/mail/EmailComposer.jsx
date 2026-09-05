import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Send, X, Plus, Paperclip, UploadCloud, RefreshCw,
  FileSpreadsheet, FileImage, FileArchive, FileCode, FileText,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExt from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import './EmailComposer.css';

const getFileIcon = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet;
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return FileImage;
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return FileArchive;
  if (['html', 'css', 'js', 'json', 'py', 'sh', 'sql'].includes(ext)) return FileCode;
  return FileText;
};

const getFileStyle = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return 'text-purple-400 bg-purple-500/10 border border-purple-500/20';
  }
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
  }
  if (ext === 'pdf') {
    return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
  }
  if (['doc', 'docx'].includes(ext)) {
    return 'text-blue-400 bg-blue-500/10 border border-blue-500/20';
  }
  return 'text-slate-400 bg-slate-500/10 border border-slate-500/20';
};

const EmailComposer = ({ onClose, onSend, onSaveDraft, mode = 'new', originalEmail = null }) => {
  const { accounts } = useMail();
  
  const [from, setFrom] = useState(accounts[0]?.email || '');
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: true }),
      UnderlineExt,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Escribe tu mensaje aquí...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[180px] px-4 py-3 text-sm text-slate-200 bg-transparent',
      },
    },
  });

  const setEditorContent = (content) => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  };

  React.useEffect(() => {
    if (mode === 'reply' && originalEmail) {
      setTo(originalEmail.from_email);
      setSubject(`Re: ${originalEmail.subject || ''}`);
      setEditorContent(originalEmail.body || '');
    } else if (mode === 'replyAll' && originalEmail) {
      setTo(originalEmail.from_email);
      setCc(originalEmail.cc?.join(', ') || '');
      setSubject(`Re: ${originalEmail.subject || ''}`);
      setEditorContent(originalEmail.body || '');
    } else if (mode === 'forward' && originalEmail) {
      setSubject(`Fwd: ${originalEmail.subject || ''}`);
      setEditorContent(`<br/>------ Mensaje reenviado ------
        <br/><br/>De: ${originalEmail.from_name} &lt;${originalEmail.from_email}&gt;
        <br/>Para: ${originalEmail.to?.join(', ') || ''}
        <br/>Asunto: ${originalEmail.subject}
        <br/>Fecha: ${new Date(originalEmail.date).toLocaleString()}
        <br/><br/>${originalEmail.body || ''}`);
    }
  }, [mode, originalEmail]);

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo "${file.name}" supera el límite de 5MB.`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const uniqueId = Math.random().toString(36).substr(2, 9);
      
      const newAttachmentPlaceholder = {
        id: uniqueId,
        filename: file.name,
        contentType: file.type,
        size: file.size,
        content: null,
        progress: 0,
        status: 'uploading'
      };

      setAttachments(prev => [...prev, newAttachmentPlaceholder]);

      const reader = new FileReader();
      
      let progressInterval;
      reader.onloadstart = () => {
        progressInterval = setInterval(() => {
          setAttachments(prev => prev.map(item => 
            item.id === uniqueId ? { ...item, progress: Math.min(item.progress + 10, 95) } : item
          ));
        }, 100);
      };

      reader.onload = (event) => {
        clearInterval(progressInterval);
        setAttachments(prev => prev.map(item => 
          item.id === uniqueId ? { 
            ...item, 
            progress: 100, 
            status: 'completed',
            content: event.target.result.split(',')[1]
          } : item
        ));
      };

      reader.onerror = () => {
        clearInterval(progressInterval);
        setAttachments(prev => prev.map(item => 
          item.id === uniqueId ? { 
            ...item, 
            status: 'error'
          } : item
        ));
        alert(`Error al cargar el archivo ${file.name}`);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSend = async () => {
    if (!to || !subject) {
      alert('Por favor completa los campos Para y Asunto');
      return;
    }

    const stillUploading = attachments.some(att => att.status === 'uploading');
    if (stillUploading) {
      alert('Espera a que finalice la carga de todos los archivos adjuntos.');
      return;
    }

    const hasErrors = attachments.some(att => att.status === 'error');
    if (hasErrors) {
      alert('Algunos archivos no se cargaron correctamente. Por favor, inténtalo de nuevo.');
      return;
    }

    setLoading(true);
    try {
      const cleanAttachments = attachments.map(att => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
        content: att.content
      }));

      const customSignatureText = localStorage.getItem('email_signature') || '';
      const customSignatureHtml = customSignatureText
        ? `<div style="margin-top: 20px; font-family: Arial, sans-serif; font-size: 13px; color: #475569; border-top: 1px solid #cbd5e1; padding-top: 12px; line-height: 1.6; white-space: pre-wrap;">${customSignatureText}</div>`
        : '';

      const signatureHtml = `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; max-width: 500px; margin-top: 20px;">
          <tr>
            <td style="padding: 15px 0; border-top: 2px solid #1e40af;">
              <img src="cid:signatureImage" alt="ATENTO5" width="180" style="display: block; max-width: 180px; height: auto;" />
            </td>
          </tr>
        </table>
      `;

      const htmlBody = `
        ${editor?.getHTML() || '<p><br></p>'}
        ${customSignatureHtml}
        ${signatureHtml}
      `;

      await onSend({
        from,
        to,
        cc: cc || null,
        bcc: bcc || null,
        subject,
        body: htmlBody,
        attachments: cleanAttachments,
        signature: {
          filename: 'firmad.jpeg',
          path: 'src/assets/firmad.jpeg',
          cid: 'signatureImage'
        }
      });

      setTo('');
      setCc('');
      setBcc('');
      setSubject('');
      setAttachments([]);
      setShowCc(false);
      setShowBcc(false);
      if (editor) editor.commands.clearContent();
      onClose();
    } catch (error) {
      alert('Error al enviar el correo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!to && !subject) {
      alert('Escribe al menos un Asunto o Destinatario para guardar el borrador.');
      return;
    }

    setLoading(true);
    try {
      const customSignatureText = localStorage.getItem('email_signature') || '';
      const signatureHtml = customSignatureText
        ? `<div style="margin-top: 20px; font-family: Arial, sans-serif; font-size: 13px; color: #475569; border-top: 1px solid #cbd5e1; padding-top: 12px; line-height: 1.6; white-space: pre-wrap;">${customSignatureText}</div>`
        : '';

      const htmlBody = `
        ${editor?.getHTML() || '<p><br></p>'}
        ${signatureHtml}
      `;

      await onSaveDraft({
        from,
        to,
        cc: cc || null,
        bcc: bcc || null,
        subject: subject || '(Sin asunto)',
        body: htmlBody,
        attachments: [],
      });

      setTo('');
      setCc('');
      setBcc('');
      setSubject('');
      setAttachments([]);
      setShowCc(false);
      setShowBcc(false);
      if (editor) editor.commands.clearContent();
      onClose();
    } catch (error) {
      alert('Error al guardar el borrador: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-composer">
      <div className="email-composer-header">
        <h3 className="email-composer-title">
          <span className="email-composer-title-dot" />
          Redactar Mensaje
        </h3>
        <button
          onClick={onClose}
          className="email-composer-close"
        >
          <X size={18} />
        </button>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`email-composer-body ${isDragging ? 'email-composer-body-drag' : ''}`}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="email-composer-drag-overlay"
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 10 }}
                transition={{ type: 'spring', damping: 20 }}
                className="email-composer-drag-card"
              >
                <div className="email-composer-drag-icon">
                  <UploadCloud size={32} />
                </div>
                <span className="email-composer-drag-title">¡Suelta tus archivos aquí!</span>
                <p className="email-composer-drag-desc">
                  Soporta múltiples archivos y formatos. Límite de 5MB por archivo.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="email-composer-field">
            <label className="email-composer-label">De:</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="email-composer-select"
            >
              {accounts.map(acc => (
                <option key={acc.email} value={acc.email} style={{ background: '#0A0F1A', color: '#E5E7EB' }}>
                  {acc.email}
                </option>
              ))}
            </select>
          </div>

          <div className="email-composer-field">
            <div className="flex items-center justify-between">
              <label className="email-composer-label">Para:</label>
              <div className="flex items-center gap-2 text-xs">
                {!showCc && (
                  <button onClick={() => setShowCc(true)} className="text-[#3CB4FF] hover:underline cursor-pointer">Cc</button>
                )}
                {!showBcc && (
                  <button onClick={() => setShowBcc(true)} className="text-[#3CB4FF] hover:underline cursor-pointer">Cco</button>
                )}
              </div>
            </div>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="email-composer-input"
              placeholder="correo@atento5.com"
            />
          </div>

          <AnimatePresence>
            {showCc && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="email-composer-field"
              >
                <div className="flex justify-between items-center">
                  <label className="email-composer-label">CC:</label>
                  <button onClick={() => { setShowCc(false); setCc(''); }} className="text-slate-400 hover:text-white transition-colors duration-200">
                    <X size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="email-composer-input"
                  placeholder="copia@ejemplo.com"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showBcc && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="email-composer-field"
              >
                <div className="flex justify-between items-center">
                  <label className="email-composer-label">CCO:</label>
                  <button onClick={() => { setShowBcc(false); setBcc(''); }} className="text-slate-400 hover:text-white transition-colors duration-200">
                    <X size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="email-composer-input"
                  placeholder="copiaoculta@ejemplo.com"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="email-composer-field">
            <label className="email-composer-label">Asunto:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="email-composer-input"
              placeholder="Asunto del mensaje"
              style={{ fontWeight: 600 }}
            />
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <label className="email-composer-label">Mensaje:</label>
          <div className="email-composer-editor-wrapper">
            <div className="email-composer-toolbar">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`email-composer-toolbar-button ${editor?.isActive('bold') ? 'email-composer-toolbar-button-active' : ''}`}
                title="Negrita"
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`email-composer-toolbar-button ${editor?.isActive('italic') ? 'email-composer-toolbar-button-active' : ''}`}
                title="Cursiva"
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`email-composer-toolbar-button ${editor?.isActive('underline') ? 'email-composer-toolbar-button-active' : ''}`}
                title="Subrayado"
              >
                <Underline size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`email-composer-toolbar-button ${editor?.isActive('strike') ? 'email-composer-toolbar-button-active' : ''}`}
                title="Tachado"
              >
                <Strikethrough size={14} />
              </button>

              <span className="email-composer-toolbar-divider" />

              <button
                type="button"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                className={`email-composer-toolbar-button ${editor?.isActive('paragraph') ? 'email-composer-toolbar-button-active' : ''}`}
                title="Párrafo"
              >
                <AlignLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`email-composer-toolbar-button ${editor?.isActive('bulletList') ? 'email-composer-toolbar-button-active' : ''}`}
                title="Lista"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`email-composer-toolbar-button ${editor?.isActive('orderedList') ? 'email-composer-toolbar-button-active' : ''}`}
                title="Lista numerada"
              >
                <ListOrdered size={14} />
              </button>

              <span className="email-composer-toolbar-divider" />

              <button
                type="button"
                onClick={() => {
                  const url = prompt('URL del enlace:');
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
                disabled={!editor?.can().setLink({ href: 'https://' })}
                className="email-composer-toolbar-button disabled:opacity-30 disabled:cursor-not-allowed"
                title="Insertar enlace"
              >
                <LinkIcon size={14} />
              </button>
            </div>

            {editor && (
              <EditorContent
                editor={editor}
                className="max-w-none focus-within:outline-none bg-transparent text-slate-200"
              />
            )}
            {!editor && (
              <div className="px-4 py-3 text-xs text-slate-400 bg-transparent">Cargando editor...</div>
            )}
          </div>
        </div>

        <div className="email-composer-attachments">
          <div className="email-composer-attachments-header">
            <div className="email-composer-attachments-title">
              <Paperclip size={14} />
              Adjuntos ({attachments.length})
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="email-composer-add-files"
            >
              <Plus size={14} />
              <span>Añadir archivos</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {attachments.length > 0 ? (
            <div className="email-composer-attachments-grid">
              {attachments.map((att) => {
                const Icon = getFileIcon(att.filename);
                const isUploading = att.status === 'uploading';

                return (
                  <motion.div
                    key={att.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.01, borderColor: 'rgba(60, 180, 255, 0.2)' }}
                    className="email-composer-attachment"
                  >
                    <div className="email-composer-attachment-info">
                      <div className="email-composer-attachment-icon">
                        <div className={`p-2 rounded-lg ${getFileStyle(att.filename)}`}>
                          <Icon size={16} />
                        </div>
                      </div>
                      <div className="email-composer-attachment-details">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="email-composer-attachment-name" title={att.filename}>
                            {att.filename}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="email-composer-attachment-remove"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <p className="email-composer-attachment-meta">
                          {(att.size / 1024).toFixed(1)} KB • {att.contentType || 'Archivo'}
                        </p>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="email-composer-progress">
                        <motion.div 
                          className="email-composer-progress-bar"
                          initial={{ width: 0 }}
                          animate={{ width: `${att.progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 0.99, borderColor: 'rgba(60, 180, 255, 0.2)', backgroundColor: 'rgba(60, 180, 255, 0.02)' }}
              whileTap={{ scale: 0.985 }}
              className="email-composer-dropzone"
            >
              <UploadCloud size={28} className="email-composer-dropzone-icon" />
              <p className="email-composer-dropzone-text">Arrastra archivos aquí o haz clic para buscarlos</p>
              <p className="email-composer-dropzone-hint">Límite por archivo: 5MB</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="email-composer-footer">
        <div className="flex items-center gap-2">
          {!loading && onSaveDraft && (
            <motion.button
              onClick={handleSaveDraft}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="email-composer-footer-draft"
              title="Guardar borrador"
            >
              <Paperclip size={14} />
              <span>Guardar borrador</span>
            </motion.button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="email-composer-footer-cancel"
          >
            Cancelar
          </button>
          <motion.button
            onClick={handleSend}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            className="email-composer-footer-send"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>{mode === 'new' ? 'Enviando...' : 'Procesando...'}</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>{mode === 'new' ? 'Enviar mensaje' : mode === 'reply' ? 'Responder' : mode === 'replyAll' ? 'Responder a todos' : mode === 'forward' ? 'Reenviar' : 'Enviar mensaje'}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;

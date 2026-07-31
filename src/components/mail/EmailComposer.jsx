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

// Map file types to Lucide Icons
const getFileIcon = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet;
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return FileImage;
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return FileArchive;
  if (['html', 'css', 'js', 'json', 'py', 'sh', 'sql'].includes(ext)) return FileCode;
  return FileText;
};

// Map file types to professional light Tailwind badge styles
const getFileStyle = (filename = '') => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'text-emerald-600 bg-emerald-50 border border-emerald-200';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return 'text-purple-600 bg-purple-50 border border-purple-200';
  }
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return 'text-amber-600 bg-amber-50 border border-amber-200';
  }
  if (ext === 'pdf') {
    return 'text-rose-600 bg-rose-50 border border-rose-200';
  }
  if (['doc', 'docx'].includes(ext)) {
    return 'text-blue-600 bg-blue-50 border border-blue-200';
  }
  return 'text-slate-500 bg-slate-50 border border-slate-200';
};

const EmailComposer = ({ onClose, onSend, onSaveDraft, mode = 'new', originalEmail = null }) => {
  const { accounts } = useMail();
  
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
        class: 'prose max-w-none focus:outline-none min-h-[180px] px-4 py-3 text-sm text-slate-800 bg-white',
      },
    },
  });

  const setEditorContent = (content) => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  };

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
    <div className="flex flex-col h-full overflow-hidden bg-white text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
        <h3 className="text-base font-bold flex items-center gap-2.5 text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
          Redactar Mensaje
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Inputs Form */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex-1 overflow-y-auto p-6 space-y-5 relative transition-all duration-300 bg-white"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #ffffff',
        }}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 10 }}
                transition={{ type: 'spring', damping: 20 }}
                className="p-10 rounded-[2rem] bg-slate-50 border border-slate-200 shadow-xl flex flex-col items-center gap-4 text-center max-w-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-200 text-blue-600 animate-pulse">
                  <UploadCloud size={32} />
                </div>
                <span className="text-base font-bold text-slate-800">¡Suelta tus archivos aquí!</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Soporta múltiples archivos y formatos. Límite de 5MB por archivo.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {/* De / From */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">De:</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full text-sm text-slate-800 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 rounded-xl px-3.5 py-2.5 focus:outline-none transition-all duration-300"
            >
              {accounts.map(acc => (
                <option key={acc.email} value={acc.email} className="bg-white text-slate-850">
                  {acc.email}
                </option>
              ))}
            </select>
          </div>

          {/* Para / To */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Para:</label>
              <div className="flex items-center gap-2 text-xs">
                {!showCc && (
                  <button onClick={() => setShowCc(true)} className="text-blue-600 hover:underline cursor-pointer">Cc</button>
                )}
                {!showBcc && (
                  <button onClick={() => setShowBcc(true)} className="text-blue-600 hover:underline cursor-pointer">Cco</button>
                )}
              </div>
            </div>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full text-sm text-slate-800 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 rounded-xl px-3.5 py-2.5 focus:outline-none transition-all duration-300"
              placeholder="correo@atento5.com"
            />
          </div>

          {/* CC */}
          <AnimatePresence>
            {showCc && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">CC:</label>
                  <button onClick={() => { setShowCc(false); setCc(''); }} className="text-slate-400 hover:text-slate-800 transition-colors duration-200">
                    <X size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="w-full text-sm text-slate-800 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 rounded-xl px-3.5 py-2.5 focus:outline-none transition-all duration-300"
                  placeholder="copia@ejemplo.com"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* BCO / BCC */}
          <AnimatePresence>
            {showBcc && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">CCO:</label>
                  <button onClick={() => { setShowBcc(false); setBcc(''); }} className="text-slate-400 hover:text-slate-800 transition-colors duration-200">
                    <X size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="w-full text-sm text-slate-800 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 rounded-xl px-3.5 py-2.5 focus:outline-none transition-all duration-300"
                  placeholder="copiaoculta@ejemplo.com"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Asunto / Subject */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Asunto:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm font-semibold text-slate-800 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 rounded-xl px-3.5 py-2.5 focus:outline-none transition-all duration-300"
              placeholder="Asunto del mensaje"
            />
          </div>
        </div>

        {/* Mensaje / Body */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Mensaje:</label>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-[0_0_12px_rgba(37,99,235,0.08)]">
            {/* TipTap Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-slate-200 bg-slate-50/50">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-lg text-xs transition-colors ${editor?.isActive('bold') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Negrita"
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-lg text-xs transition-colors ${editor?.isActive('italic') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Cursiva"
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded-lg text-xs transition-colors ${editor?.isActive('underline') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Subrayado"
              >
                <Underline size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded-lg text-xs transition-colors ${editor?.isActive('strike') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Tachado"
              >
                <Strikethrough size={14} />
              </button>

              <span className="w-px h-4 bg-slate-200 mx-1" />

              <button
                type="button"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                className={`p-1.5 rounded-lg text-xs transition-colors ${editor?.isActive('paragraph') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Párrafo"
              >
                <AlignLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-lg text-xs transition-colors ${editor?.isActive('bulletList') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Lista"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-lg text-xs transition-colors ${editor?.isActive('orderedList') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                title="Lista numerada"
              >
                <ListOrdered size={14} />
              </button>

              <span className="w-px h-4 bg-slate-200 mx-1" />

              <button
                type="button"
                onClick={() => {
                  const url = prompt('URL del enlace:');
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
                disabled={!editor?.can().setLink({ href: 'https://' })}
                className={`p-1.5 rounded-lg text-xs transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed`}
                title="Insertar enlace"
              >
                <LinkIcon size={14} />
              </button>
            </div>

            {/* TipTap Editor */}
            {editor && (
              <EditorContent
                editor={editor}
                className="max-w-none focus-within:outline-none bg-white text-slate-800"
              />
            )}
            {!editor && (
              <div className="px-4 py-3 text-xs text-slate-400 bg-white">Cargando editor...</div>
            )}
          </div>
        </div>

        {/* Adjuntos / Attachments area */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Paperclip size={14} className="text-slate-400" />
              Adjuntos ({attachments.length})
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-150 transition-all text-xs rounded-xl flex items-center gap-1.5 cursor-pointer font-bold"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attachments.map((att) => {
                const Icon = getFileIcon(att.filename);
                const isUploading = att.status === 'uploading';

                return (
                  <motion.div
                    key={att.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.01, borderColor: 'rgba(37, 99, 235, 0.2)' }}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2 relative"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${getFileStyle(att.filename)}`}>
                          <Icon size={16} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="text-xs font-semibold text-slate-800 truncate max-w-[130px]" title={att.filename}>
                            {att.filename}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="p-1 hover:bg-slate-200 rounded-full transition-colors duration-200 cursor-pointer"
                          >
                            <X size={12} className="text-slate-400 hover:text-slate-800"/>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {(att.size / 1024).toFixed(1)} KB • {att.contentType || 'Archivo'}
                        </p>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                        <motion.div 
                          className="bg-blue-600 h-full rounded-full"
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
              whileHover={{ scale: 0.99, borderColor: 'rgba(37, 99, 235, 0.3)', backgroundColor: '#F8FAFC' }}
              whileTap={{ scale: 0.985 }}
              className="border border-dashed border-slate-250 rounded-2xl p-7 flex flex-col items-center gap-2.5 cursor-pointer bg-slate-50/50 transition-all duration-300"
            >
              <UploadCloud size={28} className="text-blue-650" />
              <p className="text-xs font-semibold text-slate-655">Arrastra archivos aquí o haz clic para buscarlos</p>
              <p className="text-[10px] text-slate-400">Límite por archivo: 5MB</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-2">
          {!loading && onSaveDraft && (
            <motion.button
              onClick={handleSaveDraft}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all text-xs rounded-xl flex items-center gap-1.5 font-bold cursor-pointer"
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
            className="px-4 py-2.5 text-xs bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <motion.button
            onClick={handleSend}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -0.5 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 text-xs bg-blue-600 hover:bg-blue-750 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
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
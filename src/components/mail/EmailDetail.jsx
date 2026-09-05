import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Trash2, ChevronLeft, Mail, AlertTriangle, Archive, MoreHorizontal, Building2, Reply, ReplyAll, Forward,
  FileSpreadsheet, FileImage, FileArchive, FileCode, FileText, Download, Paperclip
} from 'lucide-react';
import { useMail } from '../../context/MailContext';

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
    return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return 'bg-purple-50 text-purple-600 border border-purple-100';
  }
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return 'bg-amber-50 text-amber-600 border border-amber-100';
  }
  if (ext === 'pdf') {
    return 'bg-rose-50 text-rose-600 border border-rose-100';
  }
  if (['doc', 'docx'].includes(ext)) {
    return 'bg-blue-50 text-blue-600 border border-blue-100';
  }
  return 'bg-slate-50 text-slate-500 border border-slate-100';
};

const EmailHtmlRenderer = ({ html }) => {
  const iframeRef = React.useRef(null);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();

    const isHtml = /<[a-z][\s\S]*>/i.test(html || '');
    const content = isHtml
      ? (html || '')
      : (html || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #334155;
              line-height: 1.8;
              margin: 0;
              padding: 10px 0;
              word-break: break-word;
              white-space: pre-wrap;
              font-size: 19px;
              background-color: transparent;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 16px 0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            a {
              color: #2563eb;
              text-decoration: none;
              font-weight: 600;
            }
            a:hover {
              text-decoration: underline;
            }
            blockquote {
              border-left: 3px solid #3b82f6;
              margin: 16px 0;
              padding-left: 16px;
              color: #64748b;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
    doc.write(styledHtml);
    doc.close();

    const resizeObserver = new ResizeObserver(() => {
      if (iframe.contentWindow && doc.body) {
        iframe.style.height = `${doc.body.scrollHeight + 16}px`;
      }
    });

    if (doc.body) {
      resizeObserver.observe(doc.body);
    }

    return () => resizeObserver.disconnect();
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Cuerpo del Correo"
      className="w-full border-0 bg-transparent transition-all duration-300"
      sandbox="allow-same-origin allow-popups"
    />
  );
};

const EmailDetail = ({ selectedEmail, onClose, attachments, setAttachments, onReply, onReplyAll, onForward }) => {
  const { toggleStar, deleteEmail, downloadAttachment } = useMail();

  const handleStar = () => toggleStar(selectedEmail.id, !selectedEmail.is_starred);
  const handleDelete = () => {
    deleteEmail(selectedEmail.id);
    onClose();
  };

  const formatDateString = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }) + ' ' + date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const getSenderRole = (email) => {
    const fromName = email.from_name || '';
    if (fromName.includes('DIAN')) return 'Entidad Gubernamental • Normativa Tributaria';
    if (fromName.includes('Ministerio')) return 'Entidad Gubernamental • Regulación Laboral';
    if (fromName.includes('Superintendencia')) return 'Entidad Gubernamental • Supervisión Societaria';
    if (fromName.includes('SENA')) return 'Entidad Gubernamental • Capacitación y Aprendizaje';
    if (fromName.includes('Recursos Humanos')) return 'Recursos Humanos';
    if (fromName.includes('Dirección')) return 'Dirección General';
    if (fromName.includes('Tecnología')) return 'Tecnología e Información';
    if (fromName.includes('Bienestar')) return 'Bienestar Corporativo';
    if (fromName.includes('Comercial') || fromName.includes('Ventas')) return 'Área Comercial';
    if (fromName.includes('Seguridad y Salud')) return 'Seguridad y Salud en el Trabajo';
    return 'Contacto Corporativo';
  };

  // Determine tag classes
  const getTagClass = (tag) => {
    if (tag === 'Gobierno' || tag === 'Gobierno Nacional') return 'bg-purple-100 text-purple-700 border border-purple-200';
    if (tag === 'Interno') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (tag === 'Urgente') return 'bg-red-100 text-red-700 border border-red-200';
    if (tag === 'Alta') return 'bg-amber-100 text-amber-700 border border-amber-200';
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  return (
    <div className="flex-1 bg-[#F4F7FC] text-slate-700 overflow-hidden flex flex-col h-full">
      <AnimatePresence mode="wait">
        {selectedEmail ? (
          <motion.div
            key={selectedEmail.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full flex flex-col"
          >
            {/* ── ALERTA DE MENSAJE URGENTE ── */}
            {selectedEmail.prioridad === 'Urgente' && (
              <div className="bg-red-50 border-b border-red-100 px-6 py-3.5 flex items-center gap-2.5 text-xs font-bold text-red-655 shrink-0">
                <AlertTriangle size={15} className="text-red-500 fill-red-100 animate-pulse" />
                <span>Este mensaje requiere atención urgente</span>
              </div>
            )}

            {/* ── CABECERA Y BOTONES DE ACCIÓN ── */}
            <div className="px-6 py-5 bg-white border-b border-slate-200 shrink-0 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
               
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all lg:hidden cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-850 tracking-tight leading-snug">
                      {selectedEmail.subject || '(Sin Asunto)'}
                    </h1>
                  </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Responder Button */}
                  {onReply && (
                    <button
                      onClick={() => onReply(selectedEmail)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-100 active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Reply size={16} className="scale-x-[-1]" />
                      <span>Responder</span>
                    </button>
                  )}
                   
                  {/* Destacar */}
                  <button
                    onClick={handleStar}
                    className={`p-2 rounded-lg transition-all cursor-pointer border ${selectedEmail.is_starred
                      ? 'text-amber-500 bg-amber-50 border-amber-200'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-200'}`}
                    title={selectedEmail.is_starred ? 'Quitar de importantes' : 'Destacar'}
                  >
                    <Star size={15} className={selectedEmail.is_starred ? 'fill-amber-500' : ''} />
                  </button>

                  {/* Archivar */}
                  <button
                    onClick={() => {
                      alert('Mensaje archivado correctamente');
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                    title="Archivar"
                  >
                    <Archive size={15} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-655 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* Más Opciones */}
                  <button
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                    title="Más opciones"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>

              {/* Tags Row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedEmail.tags && selectedEmail.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider ${getTagClass(tag)}`}
                    >
                      {tag === 'Gobierno' ? 'Gobierno Nacional' : tag}
                    </span>
                  ))}
                </div>
            </div>

            {/* ── INFO REMITENTE ── */}
            <div className="px-8 py-5 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0
                  ${selectedEmail.origen === 'Gobierno' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Building2 size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-slate-800">
                    {selectedEmail.from_name || selectedEmail.from_email.split('@')[0]}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {getSenderRole(selectedEmail)}
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400 text-right shrink-0">
                {formatDateString(selectedEmail.date)}
              </div>
            </div>

            {/* ── EMAIL BODY ── */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 bg-[#F4F7FC]"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f4f7fc',
              }}
            >
              <div className="max-w-3xl leading-relaxed text-slate-700 bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
                <EmailHtmlRenderer html={selectedEmail.body || ''} />

                {/* Adjuntos */}
                {attachments && attachments.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Paperclip size={14} />
                      <span>Archivos Adjuntos ({attachments.length})</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attachments.map((att) => {
                        const Icon = getFileIcon(att.filename || att.name);
                        const fileStyle = getFileStyle(att.filename || att.name);

                        return (
                          <div
                            key={att.id}
                            className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group shadow-sm"
                          >
                            <div className={`p-2.5 rounded-lg ${fileStyle} shrink-0`}>
                              <Icon size={16} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-700 truncate" title={att.filename || att.name}>
                                {att.filename || att.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                {att.size ? (typeof att.size === 'number' ? `${(att.size / 1024).toFixed(1)} KB` : att.size) : '0 KB'}
                              </p>
                            </div>

                            <button
                              onClick={() => downloadAttachment(att.id, att.filename || att.name)}
                              className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all shrink-0 cursor-pointer"
                              title="Descargar archivo"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── PIE DE MENSAJE ── */}
            <div className="px-8 py-4 bg-white border-t border-slate-150 shrink-0 flex items-center justify-between gap-4 text-xs font-bold text-slate-400 shadow-inner">
              <span>Recibido el {formatDateString(selectedEmail.date)}</span>
              {onReply && (
                <button 
                  onClick={() => onReply(selectedEmail)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Reply size={14} className="scale-x-[-1]" />
                  <span>Responder a este mensaje</span>
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-xl" />
              <div className="relative w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-lg shadow-blue-50">
                <Mail size={36} className="stroke-[1.5]" />
              </div>
            </div>
            
            <h3 className="font-extrabold text-slate-800 text-lg mb-2">Bandeja de Correo ATENTO5</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
              Selecciona cualquier mensaje de la lista para previsualizar su contenido, gestionar adjuntos y responder a tus colaboradores.
            </p>

            <div className="grid grid-cols-1 gap-2.5 w-full">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl text-left shadow-sm">
                <p className="text-xs font-bold text-slate-800 mb-1">💼 Sistema IMAP/SMTP</p>
                <p className="text-[11px] text-slate-400 font-medium">Conectado a mail.atento5.com de forma segura.</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl text-left shadow-sm">
                <p className="text-xs font-bold text-slate-800 mb-1">📎 Adjuntos PDF & Excel</p>
                <p className="text-[11px] text-slate-400 font-medium">Previsualizador integrado de cotizaciones e informes.</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailDetail;

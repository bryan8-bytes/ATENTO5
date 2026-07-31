import React from 'react';
import {
  Inbox,
  RefreshCw,
  AlertOctagon,
  Star,
  Paperclip,
  Trash2,
  Reply,
  Forward,
  Download,
} from 'lucide-react';

const getAvatarColor = (email = '') => {
  const colors = ['from-indigo-500 to-purple-600','from-blue-500 to-cyan-600','from-emerald-500 to-teal-600','from-violet-500 to-fuchsia-600','from-rose-500 to-pink-600','from-amber-500 to-orange-600','from-sky-500 to-blue-600'];
  let hash = 0; for (let i = 0; i < email.length; i++) { hash = email.charCodeAt(i) + ((hash << 5) - hash); }
  return colors[Math.abs(hash) % colors.length];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  if (diff < 86400000) return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) return date.toLocaleDateString('es-ES', { weekday: 'short' });
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
};

const MailWorkspace = ({
  emails,
  loading,
  error,
  selectedEmail,
  onSelectEmail,
  onRefresh,
  onReply,
  onForward,
  onDelete,
  onToggleStar,
  viewMode,
}) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ── Panel 1: Email List (always visible on desktop, hidden on mobile when viewing detail) ── */}
      <div className={`w-full lg:w-[380px] xl:w-[420px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-full ${viewMode === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Search Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recibidos</h2>
          <button onClick={onRefresh} disabled={loading} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Email items */}
        <div className="flex-1 overflow-y-auto">
          {loading && emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
              <RefreshCw size={28} className="animate-spin text-sky-500" />
              <span className="text-xs font-semibold">Sincronizando...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <AlertOctagon className="mx-auto text-rose-500 mb-2.5" size={28} />
              <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold">{error}</p>
              <button onClick={onRefresh} className="mt-3 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-bold border border-rose-200/50 dark:border-rose-800/30 transition-colors">Reintentar</button>
            </div>
          ) : emails.length === 0 ? (
            <div className="p-6 text-center flex flex-col items-center justify-center h-full text-slate-400">
              <Inbox size={32} className="stroke-[1.5] mb-2.5 text-slate-300 dark:text-slate-700" />
              <p className="font-semibold text-xs text-slate-500">No hay correos en esta carpeta</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {emails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isUnread = !email.is_read;
                const avatarGradient = getAvatarColor(email.from_email);
                const firstLetter = (email.from_name || email.from_email || 'U').charAt(0).toUpperCase();
                return (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => onSelectEmail(email)}
                    className={`px-4 py-3 cursor-pointer transition-colors relative
                      ${isSelected ? 'bg-sky-50 dark:bg-sky-950/20' : isUnread ? 'bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50' : 'bg-slate-50/40 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm`}>
                        {firstLetter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`text-sm truncate ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                            {email.from_name || email.from_email.split('@')[0]}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 shrink-0">{formatDate(email.date)}</span>
                        </div>
                        <p className={`text-sm truncate mb-0.5 ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-normal text-slate-700 dark:text-slate-300'}`}>
                          {email.subject || '(Sin Asunto)'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {email.body ? email.body.replace(/<[^>]*>/g, '').substring(0, 65) : 'Sin contenido'}
                        </p>
                      </div>
                      {isUnread && <div className="w-2 h-2 bg-sky-500 rounded-full shrink-0 mt-2" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Panel 2: Email Detail / Reading Pane ── */}
      <div className={`flex-1 bg-white dark:bg-slate-950 overflow-hidden flex flex-col h-full ${viewMode === 'list' ? 'hidden lg:flex' : 'flex'}`}>
        {selectedEmail ? (
          <motion.div key={selectedEmail.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="h-full flex flex-col">
            
            {/* Email Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 leading-tight">
                    {selectedEmail.subject || '(Sin Asunto)'}
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(selectedEmail.from_email)} flex items-center justify-center font-bold text-sm text-white shrink-0`}>
                      {(selectedEmail.from_name || selectedEmail.from_email).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {selectedEmail.from_name || selectedEmail.from_email.split('@')[0]}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">&lt;{selectedEmail.from_email}&gt;</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Para: <span className="text-slate-700 dark:text-slate-300">{selectedEmail.to_email}</span>
                        {selectedEmail.cc && <span className="ml-1">• CC: <span className="text-slate-500">{selectedEmail.cc}</span></span>}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{formatDate(selectedEmail.date)}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onToggleStar(selectedEmail.id, !selectedEmail.is_starred)} className={`p-2 rounded-full transition-colors ${selectedEmail.is_starred ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Destacar">
                    <Star size={18} className={selectedEmail.is_starred ? 'fill-amber-500' : ''} />
                  </button>
                  <button onClick={() => onDelete(selectedEmail.id)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-600 transition-colors" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button onClick={onReply} className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                  <Reply size={16} /> Responder
                </button>
                <button onClick={onForward} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                  <Forward size={16} /> Reenviar
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedEmail.body}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/30 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
              <Inbox size={24} className="stroke-[1.5]" />
            </div>
            <h3 className="font-semibold text-slate-600 dark:text-slate-400 text-sm">Selecciona un correo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 max-w-64">
              Selecciona un correo de la lista para ver su contenido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailWorkspace;
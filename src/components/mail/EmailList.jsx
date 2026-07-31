import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Star, Paperclip, RefreshCw, AlertOctagon, Inbox,
  Building2, User, Search, MailPlus, Filter
} from 'lucide-react';
import { useMail } from '../../context/MailContext';

const formatEmailDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 86400000 && date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};

const PAGE_SIZE = 50;

const EmailList = ({ selectedEmailId, onSelectEmail, filteredEmails, onCompose, onRefresh, loading }) => {
  const { currentFolder } = useMail();

  const [searchQuery, setSearchQuery] = useState('');
  const [renderedCount, setRenderedCount] = useState(PAGE_SIZE);
  const listRef = useRef(null);
  const sentinelRef = useRef(null);

  const sourceEmails = filteredEmails || [];

  const filtered = sourceEmails.filter(email => {
    const query = searchQuery.toLowerCase();
    const fromName = (email.from_name || '').toLowerCase();
    const fromEmail = (email.from_email || '').toLowerCase();
    const subject = (email.subject || '').toLowerCase();
    return fromName.includes(query) || fromEmail.includes(query) || subject.includes(query);
  });

  const displayEmails = filtered.slice(0, renderedCount);

  const hasMore = renderedCount < filtered.length;

  const resetPage = useCallback(() => {
    setRenderedCount(PAGE_SIZE);
  }, []);

  useEffect(() => {
    resetPage();
  }, [currentFolder, filteredEmails, resetPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          setRenderedCount(prev => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { root: listRef.current, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, filtered.length]);

  const handleEmailClick = (email) => {
    onSelectEmail(email);
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col bg-white">
      <div className="px-5 py-4 flex items-center justify-between shrink-0 bg-white border-b border-slate-100">
        <span className="text-base font-bold text-slate-800 tracking-tight">
          {filtered.length} {filtered.length === 1 ? 'mensaje' : 'mensajes'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onCompose}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-150"
            title="Redactar correo"
          >
            <MailPlus size={16} />
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-150"
            title="Actualizar bandeja"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-150"
            title="Filtrar mensajes"
          >
            <Filter size={14} />
          </button>
        </div>
      </div>

      <div className="px-4 py-3 shrink-0 bg-white border-b border-slate-100">
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar mensajes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white focus:outline-none rounded-xl text-xs text-slate-750 placeholder-slate-400 transition-all font-medium shadow-inner"
          />
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #ffffff' }}>
        {displayEmails.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center h-full text-slate-400">
            <Inbox size={36} className="stroke-[1.5] mb-2 text-slate-300" />
            <p className="font-bold text-xs text-slate-500">No hay mensajes</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Intenta otra búsqueda o filtro.</p>
          </div>
        ) : (
          <div>
            {displayEmails.map((email) => {
              const isSelected = selectedEmailId === email.id;
              const isUnread = !email.is_read;
              const isGov = email.origen === 'Gobierno';
              const avatarBg = isGov
                ? 'bg-purple-50 text-purple-600 border border-purple-100/60'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100/60';
              const AvatarIcon = isGov ? Building2 : User;

              let priorityDotColor = 'bg-slate-300';
              if (email.prioridad === 'Urgente') {
                priorityDotColor = 'bg-red-500 shadow-sm shadow-red-200';
              } else if (email.prioridad === 'Alta') {
                priorityDotColor = 'bg-orange-500 shadow-sm shadow-orange-200';
              } else if (email.prioridad === 'Normal') {
                priorityDotColor = 'bg-blue-500 shadow-sm shadow-blue-200';
              } else if (email.prioridad === 'Informativa') {
                priorityDotColor = 'bg-slate-400 shadow-sm shadow-slate-200';
              }

              const getTagClass = (tag) => {
                if (tag === 'Gobierno') return 'bg-purple-55 text-purple-650 border border-purple-150';
                if (tag === 'Interno') return 'bg-emerald-55 text-emerald-650 border border-emerald-150';
                if (tag === 'Urgente') return 'bg-red-55 text-red-650 border border-red-150';
                if (tag === 'Alta') return 'bg-amber-55 text-amber-650 border border-amber-150';
                return 'bg-slate-50 text-slate-500 border border-slate-200';
              };

              return (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`group relative cursor-pointer transition-all duration-200 px-5 py-4 flex gap-3.5 items-start border-l-4 border-b border-slate-100/80
                    ${isSelected
                      ? 'bg-blue-50/40 border-l-blue-600'
                      : isUnread
                        ? 'bg-slate-50/40 border-l-transparent hover:bg-slate-50/70'
                        : 'bg-white border-l-transparent hover:bg-slate-50/70'
                    }
                  `}
                >
                  <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}>
                    <AvatarIcon size={16} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] truncate uppercase tracking-wider ${isUnread ? 'font-black text-slate-800' : 'font-bold text-slate-500'}`}>
                        {email.from_name || email.from_email?.split('@')[0]}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">
                        {formatEmailDate(email.date)}
                      </span>
                    </div>

                    <h4 className={`text-xs truncate leading-snug ${isUnread ? 'font-extrabold text-slate-800' : 'font-semibold text-slate-655'}`}>
                      {email.subject || '(Sin asunto)'}
                    </h4>

                    <p className="text-[11px] text-slate-400 font-medium truncate leading-normal">
                      {email.body ? email.body.replace(/<[^>]*>/g, '').replace(/\n/g, ' ') : 'Sin contenido adicional'}
                    </p>

                    <div className="flex items-center justify-between pt-1.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {(email.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-wide uppercase ${getTagClass(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {email.has_attachments && (
                          <Paperclip size={12} className="text-slate-400" />
                        )}
                        <span className={`w-2.5 h-2.5 rounded-full ${priorityDotColor}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {hasMore && (
              <div ref={sentinelRef} className="px-5 py-4 text-center text-xs font-semibold text-slate-400">
                Cargando más mensajes...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;

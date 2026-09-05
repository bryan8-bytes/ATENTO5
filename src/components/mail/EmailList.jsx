import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Star, Paperclip, RefreshCw, AlertOctagon, Inbox,
  Building2, User, Search, MailPlus, Filter
} from 'lucide-react';
import { useMail } from '../../context/MailContext';
import './EmailList.css';

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

const getEmailPreview = (body) => {
  if (!body) return 'Sin contenido adicional';
  const div = document.createElement('div');
  div.innerHTML = body;
  return div.textContent || div.innerText || 'Sin contenido adicional';
};

const EmailList = ({ selectedEmailId, onSelectEmail, filteredEmails, onCompose, onRefresh, loading, error, searchQuery }) => {
  const { currentFolder } = useMail();

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [renderedCount, setRenderedCount] = useState(PAGE_SIZE);
  const listRef = useRef(null);
  const sentinelRef = useRef(null);

  const sourceEmails = filteredEmails || [];

  const filtered = sourceEmails.filter(email => {
    const query = localSearchQuery.toLowerCase();
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
    <div className="email-list">
      <div className="email-list-header">
        <span className="email-list-count">
          {filtered.length} {filtered.length === 1 ? 'mensaje' : 'mensajes'}
        </span>
        <div className="email-list-actions">
          <button
            onClick={onCompose}
            className="email-list-action-button"
            title="Redactar correo"
          >
            <MailPlus size={16} />
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="email-list-action-button"
            title="Actualizar bandeja"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            className="email-list-action-button"
            title="Filtrar mensajes"
          >
            <Filter size={14} />
          </button>
        </div>
      </div>

      <div className="email-list-search">
        <div className="relative flex items-center">
          <Search size={15} className="email-list-search-icon" />
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Buscar mensajes..."
            className="email-list-search-input"
          />
        </div>
      </div>

      <div ref={listRef} className="email-list-scroll">
        {loading && displayEmails.length === 0 ? (
          <div className="email-list-empty-state">
            <RefreshCw size={28} className="email-list-empty-spinner" />
            <p className="email-list-empty-title">Sincronizando</p>
            <p className="email-list-empty-hint">Actualizando bandeja...</p>
          </div>
        ) : error ? (
          <div className="email-list-empty-state">
            <AlertOctagon size={28} className="email-list-empty-error" />
            <p className="email-list-empty-title">Error de sincronización</p>
            <p className="email-list-empty-hint">{error}</p>
            <button onClick={onRefresh} className="email-list-retry">
              <RefreshCw size={14} />
              <span>Reintentar</span>
            </button>
          </div>
        ) : displayEmails.length === 0 ? (
          <div className="email-list-empty-state">
            {localSearchQuery ? (
              <Search size={28} className="email-list-empty-icon" />
            ) : (
              <Inbox size={28} className="email-list-empty-icon" />
            )}
            <p className="email-list-empty-title">
              {localSearchQuery ? 'Sin resultados' : 'No hay mensajes'}
            </p>
            <p className="email-list-empty-hint">
              {localSearchQuery
                ? 'Prueba con otros términos de búsqueda'
                : 'Esta carpeta está vacía por ahora'}
            </p>
          </div>
        ) : (
          <div>
            {displayEmails.map((email) => {
              const isSelected = selectedEmailId === email.id;
              const isUnread = !email.is_read;
              const isGov = email.origen === 'Gobierno';
              const avatarBg = isGov
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
              const AvatarIcon = isGov ? Building2 : User;

              let priorityDotColor = 'bg-slate-500';
              if (email.prioridad === 'Urgente') {
                priorityDotColor = 'bg-red-500 shadow-sm shadow-red-500/30';
              } else if (email.prioridad === 'Alta') {
                priorityDotColor = 'bg-orange-500 shadow-sm shadow-orange-500/30';
              } else if (email.prioridad === 'Normal') {
                priorityDotColor = 'bg-blue-500 shadow-sm shadow-blue-500/30';
              } else if (email.prioridad === 'Informativa') {
                priorityDotColor = 'bg-slate-400 shadow-sm shadow-slate-400/30';
              }

              const getTagClass = (tag) => {
                if (tag === 'Gobierno') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
                if (tag === 'Interno') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                if (tag === 'Urgente') return 'bg-red-500/10 text-red-400 border border-red-500/20';
                if (tag === 'Alta') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
              };

              return (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`email-list-item ${isSelected ? 'email-list-item-selected' : ''} ${isUnread ? 'email-list-item-unread' : ''}`}
                >
                  <div className={`email-list-avatar ${avatarBg}`}>
                    <AvatarIcon size={16} />
                  </div>

                  <div className="email-list-content">
                    <div className="email-list-row">
                      <span className={`email-list-sender ${isUnread ? 'email-list-sender-unread' : ''}`}>
                        {email.from_name || email.from_email?.split('@')[0]}
                      </span>
                      <span className="email-list-date">
                        {formatEmailDate(email.date)}
                      </span>
                    </div>

                    <h4 className={`email-list-subject ${isUnread ? 'email-list-subject-unread' : ''}`}>
                      {email.subject || '(Sin asunto)'}
                    </h4>

                    <p className="email-list-preview">
                      {getEmailPreview(email.body)}
                    </p>

                    <div className="email-list-meta">
                      <div className="email-list-tags">
                        {(email.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`email-list-tag ${getTagClass(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="email-list-indicators">
                        {email.has_attachments && (
                          <Paperclip size={12} className="email-list-indicator" />
                        )}
                        <span className={`email-list-priority ${priorityDotColor}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {hasMore && (
              <div ref={sentinelRef} className="email-list-more">
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

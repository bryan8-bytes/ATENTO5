import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MailContext = createContext();

export const useMail = () => {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
};

// Helper to augment emails with Origen and Prioridad properties
const augmentEmail = (email) => {
  if (!email) return email;
  
  // 1. Origen
  let origen = email.origen || 'Interno';
  if (!email.origen) {
    const fromEmail = (email.from_email || '').toLowerCase();
    const fromName = (email.from_name || '').toLowerCase();
    const subject = (email.subject || '').toLowerCase();
    const body = (email.body || '').toLowerCase();
    const govtKeywords = [
      'dian', 'ministerio', 'superintendencia', 'sena', 'gobierno', 'sunat', 'essalud', 'municipalidad',
      'gob.pe', 'gov.co', 'gob', 'sena.edu.co',
      'sunarp', 'lima', 'mesa de partes', 'registro', 'notaria', 'superintendencia', 'osce',
      'pcm', 'presidencia', 'congreso', 'defensoria', 'minjus', 'minem', 'minagri', 'minsa', 'minedu',
      'mtc', 'mimp', 'produce', 'mincetur', 'vivienda', 'trabajo', 'energia', 'mineral', 'petroperu'
    ];
    
    if (
      fromEmail.includes('.gob') || 
      fromEmail.includes('.gov') || 
      fromEmail.includes('.mil') ||
      govtKeywords.some(keyword => 
        fromEmail.includes(keyword) || 
        fromName.includes(keyword) ||
        subject.includes(keyword)
      )
    ) {
      origen = 'Gobierno';
    } else {
      origen = 'Interno';
    }
  }

  // 2. Prioridad
  let prioridad = email.prioridad || 'Normal';
  if (!email.prioridad) {
    const subject = (email.subject || '').toLowerCase();
    const body = (email.body || '').toLowerCase();
    const urgentKeywords = ['urgente', 'obligatoria', 'obligatorio', 'junta', 'inmediato', 'resolución 0042', 'resolución'];
    const highKeywords = ['alta', 'prioridad', 'atención', 'circular', 'reporte financiero', 'evaluación', 'desempeño', 'recordatorio'];
    const infoKeywords = ['bienestar', 'convocatoria', 'anuncio', 'newsletter', 'aprendizaje', 'calendario', 'informativa'];

    if (urgentKeywords.some(keyword => subject.includes(keyword) || body.includes(keyword))) {
      prioridad = 'Urgente';
    } else if (highKeywords.some(keyword => subject.includes(keyword) || body.includes(keyword))) {
      prioridad = 'Alta';
    } else if (infoKeywords.some(keyword => subject.includes(keyword) || body.includes(keyword))) {
      prioridad = 'Informativa';
    } else {
      prioridad = 'Normal';
    }
  }

  // Add tags dynamically if not already defined
  let tags = email.tags || [];
  if (tags.length === 0) {
    if (origen === 'Gobierno') {
      tags.push('Gobierno');
    } else {
      tags.push('Interno');
    }
    
    if (prioridad === 'Urgente') {
      tags.push('Urgente');
    } else if (prioridad === 'Alta') {
      tags.push('Alta');
    }

    if ((email.subject || '').toLowerCase().includes('facturación electrónica') || (email.subject || '').includes('0042')) {
      tags.push('Normativa Tributaria');
    }
  }

  return {
    ...email,
    origen,
    prioridad,
    tags
  };
};

export const MailProvider = ({ children }) => {
  const { user } = useAuth();
  const [emails, setEmails] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('INBOX');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [folders, setFolders] = useState([
    { name: 'INBOX', label: 'Bandeja de entrada', icon: 'Inbox' },
    { name: 'Starred', label: 'Importantes', icon: 'Star' },
    { name: 'Sent', label: 'Elementos enviados', icon: 'Send' },
    { name: 'Drafts', label: 'Borradores', icon: 'FileText' },
    { name: 'Spam', label: 'Correo no deseado', icon: 'AlertOctagon' },
    { name: 'Trash', label: 'Elementos eliminados', icon: 'Trash2' },
    { name: 'Archive', label: 'Archivo', icon: 'Archive' }
  ]);
  const [unreadCount, setUnreadCount] = useState({
    INBOX: 0,
    Starred: 0,
    Sent: 0,
    Drafts: 0,
    Spam: 0,
    Trash: 0,
    Archive: 0,
  });
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrigin, setSelectedOrigin] = useState('all'); // 'all' | 'Interno' | 'Gobierno'
  const [selectedPriority, setSelectedPriority] = useState('all'); // 'all' | 'Urgente' | 'Alta' | 'Normal' | 'Informativa'
  const [unreadInboxEmails, setUnreadInboxEmails] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');

  // Gmail-like categories
  const categories = [
    { id: 'all', label: 'Todos', icon: 'Inbox' },
    { id: 'primary', label: 'Prioritarios', icon: 'Mail' },
    { id: 'important', label: 'Importantes', icon: 'Star' },
    { id: 'announcements', label: 'Anuncios', icon: 'Tag' },
    { id: 'others', label: 'Otros', icon: 'Bell' }
  ];

  // Email categorization logic based on content
  const categorizeEmail = (email) => {
    if (email.is_starred) {
      return 'important';
    }
    const subject = (email.subject || '').toLowerCase();
    const fromEmail = (email.from_email || '').toLowerCase();
    const body = (email.body || '').toLowerCase();

    // 1. Importantes (by urgent or important keywords if not starred)
    const importantKeywords = ['urgente', 'importante', 'prioridad', 'atención', 'critical', 'action required', 'urgent', 'important', 'prioritario'];
    if (importantKeywords.some(keyword => subject.includes(keyword) || body.includes(keyword))) {
      return 'important';
    }

    // 2. Anuncios (Ads, Promotions, Newsletters, Marketing)
    const announcementKeywords = ['oferta', 'descuento', 'promoción', 'venta', 'sale', 'offer', 'deal', 'promo', 'marketing', 'newsletter', 'suscripción', 'boletín', 'anuncio', 'publicidad', 'announcement', 'ads', 'comunicado', 'novedades'];
    if (announcementKeywords.some(keyword => subject.includes(keyword) || fromEmail.includes(keyword) || body.includes(keyword))) {
      return 'announcements';
    }

    // 3. Otros (Notifications, Social, System updates, Receipts)
    const otherKeywords = ['facebook', 'twitter', 'instagram', 'linkedin', 'social', 'invitación', 'evento', 'meetup', 'networking', 'friend', 'amigo', 'notificación', 'alerta', 'confirmación', 'recibo', 'factura', 'actualización', 'security', 'verify', 'confirm', 'receipt', 'invoice', 'alert', 'ticket', 'soporte'];
    if (otherKeywords.some(keyword => subject.includes(keyword) || fromEmail.includes(keyword) || body.includes(keyword))) {
      return 'others';
    }

    // Default to primary
    return 'primary';
  };

  // Fetch unread inbox emails separately for header notifications
  const fetchUnreadInboxEmails = async () => {
    try {
      const token = getToken();
      if (!token || !activeAccount || activeAccount === 'all') return;
      const response = await fetch(`${API_URL}/email/folder/INBOX?limit=50&account=${activeAccount}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const unread = (data.emails || []).filter(email => !email.is_read);
        setUnreadInboxEmails(unread);
      }
    } catch (err) {
      console.error('Error fetching unread inbox emails:', err);
    }
  };

  // Filter emails by origin, priority, category and date
  const getFilteredEmails = () => {
    // Augment emails with origin, priority and tags first
    let augmented = (emails || []).map(augmentEmail);
    let filtered = augmented;

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(email => categorizeEmail(email) === selectedCategory);
    }

    // Filter by Origin
    if (selectedOrigin && selectedOrigin !== 'all') {
      filtered = filtered.filter(email => email.origen === selectedOrigin);
    }

    // Filter by Priority
    if (selectedPriority && selectedPriority !== 'all') {
      filtered = filtered.filter(email => email.prioridad === selectedPriority);
    }

    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(email => {
        if (!email.date) return true;
        const emailDate = new Date(email.date);
        if (isNaN(emailDate.getTime())) return true;

        switch (dateFilter) {
          case 'today':
            return emailDate.toDateString() === now.toDateString();
          case 'yesterday': {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return emailDate.toDateString() === yesterday.toDateString();
          }
          case 'week': {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return emailDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return emailDate >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const getToken = () => localStorage.getItem('token');

  const fetchAccounts = async () => {
    const corporateList = [
      { email: 'Juan.ampuero@atento5.com', isPrimary: true, name: 'Juan Ampuero', role: 'Gerente General' },
      { email: 'Corina.anorga@atento5.com', isPrimary: false, name: 'Corina Anorga', role: 'Finanzas' },
      { email: 'Proyectos@atento5.com', isPrimary: false, name: 'Proyectos Atento5', role: 'Área de Proyectos' },
      { email: 'Ventas@atento5.com', isPrimary: false, name: 'Ventas Atento5', role: 'Comercial' },
      { email: 'Operaciones@atento5.com', isPrimary: false, name: 'Operaciones Atento5', role: 'Operaciones' }
    ];

    try {
      const token = getToken();
      if (!token || window.isBackendOffline) throw new Error('Token no disponible o servidor caído');
      const response = await fetch(`${API_URL}/imap/accounts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      
      const userEmail = user?.email?.toLowerCase();
      let fetched = data.accounts || [];
      if (fetched.length === 0) {
        fetched = corporateList;
      }
      setAccounts(fetched);
      return fetched;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('network') || err.message.includes('refused') || err.message.includes('VERIFY') || err.name === 'TypeError') {
        window.isBackendOffline = true;
      }
      setAccounts(corporateList);
      return corporateList;
    }
  };

  // Helper local database store - NO usar datos simulados como respaldo
  const getLocalEmailsStore = () => {
    return [];
  };

  // Fetch emails with seamless API + corporate offline fallback
  const fetchAllEmailsPaginated = async (folder) => {
    const token = getToken();
    if (!token || window.isBackendOffline) return [];

    const allEmails = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`${API_URL}/email/folder/${folder}?limit=${limit}&offset=${offset}&account=${activeAccount}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const batch = data.emails || [];
      allEmails.push(...batch);

      hasMore = batch.length === limit;
      offset += batch.length;

      if (batch.length === 0 || !hasMore) {
        hasMore = false;
      }
    }

    return allEmails;
  };

  const fetchEmails = async (folder = currentFolder) => {
    setLoading(true);
    setError(null);
    setCurrentFolder(folder);

    try {
      const emails = await fetchAllEmailsPaginated(folder);
      if (emails.length > 0) {
        setEmails(emails);
        const unread = emails.filter(e => !e.is_read).length;
        setUnreadCount(prev => ({ ...prev, [folder]: unread }));
        if (folder === 'INBOX') {
          setUnreadInboxEmails(emails.filter(e => !e.is_read));
        }
      }
      setLoading(false);
      return;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('network') || err.message.includes('refused') || err.name === 'TypeError') {
        window.isBackendOffline = true;
      }
      console.warn('fetchEmails error:', err);
    }

    // Corporate local storage fallback
    const allStore = getLocalEmailsStore();
    let folderEmails = allStore;

    // Filter by folder
    if (folder === 'Starred') {
      folderEmails = allStore.filter(e => e.is_starred);
    } else {
      folderEmails = allStore.filter(e => e.folder.toLowerCase() === folder.toLowerCase());
    }

    // Filter by account if activeAccount is specified
    if (activeAccount && activeAccount !== 'all') {
      const activeLower = activeAccount.toLowerCase();
      const filteredByAccount = folderEmails.filter(e => 
        (e.to_email || '').toLowerCase() === activeLower || 
        (e.from_email || '').toLowerCase() === activeLower
      );
      if (filteredByAccount.length > 0) {
        folderEmails = filteredByAccount;
      }
    }

    // Fallback if folderEmails is somehow empty
    if (folderEmails.length === 0 && folder === 'INBOX') {
      folderEmails = allStore;
    }

    setEmails(folderEmails);

    // Calculate unread counts dynamically
    const counts = {
      INBOX: allStore.filter(e => e.folder === 'INBOX' && !e.is_read).length,
      Starred: allStore.filter(e => e.is_starred).length,
      Sent: allStore.filter(e => e.folder === 'Sent').length,
      Drafts: allStore.filter(e => e.folder === 'Drafts').length,
      Spam: allStore.filter(e => e.folder === 'Spam').length,
      Trash: allStore.filter(e => e.folder === 'Trash').length,
      Archive: allStore.filter(e => e.folder === 'Archive').length,
    };
    setUnreadCount(counts);

    const unreadInbox = allStore.filter(e => e.folder === 'INBOX' && !e.is_read);
    setUnreadInboxEmails(unreadInbox);

    setLoading(false);
  };

  // Fetch single email
  const fetchEmail = async (emailId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (token && !window.isBackendOffline) {
        const response = await fetch(`${API_URL}/email/${emailId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSelectedEmail(augmentEmail(data.email));
          setLoading(false);
          return augmentEmail(data.email);
        }
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('network') || err.message.includes('refused') || err.name === 'TypeError') {
        window.isBackendOffline = true;
      }
    }

    // Local fallback
    const store = getLocalEmailsStore();
    const found = store.find(e => e.id === emailId);
    if (found) {
      setSelectedEmail(augmentEmail(found));
      setLoading(false);
      return augmentEmail(found);
    }

    setError('Email no encontrado');
    setLoading(false);
  };

  // Helper to persist changes to local store
  const saveLocalStore = (newStore) => {
    try {
      localStorage.setItem('a5_corporate_emails_v5', JSON.stringify(newStore));
    } catch (e) {}
  };

  // Mark email as read/unread
  const markAsRead = async (emailId, isRead = true) => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_URL}/email/${emailId}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isRead })
        }).catch(() => {});
      }
    } catch (err) {}

    // Update local state and local store
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, is_read: isRead } : email
    ));

    const store = getLocalEmailsStore();
    const updatedStore = store.map(e => e.id === emailId ? { ...e, is_read: isRead } : e);
    saveLocalStore(updatedStore);

    setUnreadInboxEmails(prev => {
      if (isRead) {
        return prev.filter(email => email.id !== emailId);
      } else {
        const found = emails.find(e => e.id === emailId);
        if (found && !prev.some(e => e.id === emailId)) {
          return [{ ...found, is_read: false }, ...prev];
        }
        return prev;
      }
    });

    if (selectedEmail?.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, is_read: isRead } : null);
    }
  };

  // Star/unstar email
  const toggleStar = async (emailId, isStarred) => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_URL}/email/${emailId}/star`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isStarred })
        }).catch(() => {});
      }
    } catch (err) {}

    // Update local state and store
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, is_starred: isStarred } : email
    ));

    const store = getLocalEmailsStore();
    const updatedStore = store.map(e => e.id === emailId ? { ...e, is_starred: isStarred } : e);
    saveLocalStore(updatedStore);

    if (selectedEmail?.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, is_starred: isStarred } : null);
    }
  };

  // Delete email
  const deleteEmail = async (emailId) => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_URL}/email/${emailId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      }
    } catch (err) {}

    // Move to Trash or remove
    setEmails(prev => prev.filter(email => email.id !== emailId));
    setUnreadInboxEmails(prev => prev.filter(email => email.id !== emailId));
    
    const store = getLocalEmailsStore();
    const updatedStore = store.map(e => e.id === emailId ? { ...e, folder: 'Trash' } : e);
    saveLocalStore(updatedStore);

    setSelectedEmail(null);
  };

  // Search emails
  const searchEmails = async (query) => {
    setLoading(true);
    setError(null);
    const q = (query || '').toLowerCase();

    try {
      const token = getToken();
      if (token) {
        const response = await fetch(`${API_URL}/email/search/${encodeURIComponent(query)}?account=${activeAccount}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.emails && data.emails.length > 0) {
            setEmails(data.emails);
            setLoading(false);
            return;
          }
        }
      }
    } catch (err) {}

    // Fallback local search
    const store = getLocalEmailsStore();
    const matches = store.filter(e => 
      (e.subject || '').toLowerCase().includes(q) ||
      (e.body || '').toLowerCase().includes(q) ||
      (e.from_name || '').toLowerCase().includes(q) ||
      (e.from_email || '').toLowerCase().includes(q)
    );
    setEmails(matches);
    setLoading(false);
  };

  // Sync folder with IMAP
  const syncFolder = async (folder) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (token) {
        const response = await fetch(`${API_URL}/imap/sync/${folder}?account=${activeAccount}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          await fetchEmails(folder);
          setLoading(false);
          return;
        }
      }
    } catch (err) {}

    // Reload local emails
    await fetchEmails(folder);
    setLoading(false);
  };

  // Send email
  const sendEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (token) {
        const response = await fetch(`${API_URL}/smtp/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        });
        if (response.ok) {
          const data = await response.json();
          setLoading(false);
          return data;
        }
      }
    } catch (err) {}

    // Offline / Local Send simulation
    const newMail = {
      id: `mail-sent-${Date.now()}`,
      from_name: user?.name || activeAccount.split('@')[0],
      from_email: activeAccount !== 'all' ? activeAccount : (user?.email || 'Juan.ampuero@atento5.com'),
      to_name: emailData.to,
      to_email: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      date: new Date().toISOString(),
      is_read: true,
      is_starred: false,
      folder: 'Sent',
      has_attachments: (emailData.attachments || []).length > 0,
      attachments: emailData.attachments || []
    };

    const store = getLocalEmailsStore();
    store.unshift(newMail);
    saveLocalStore(store);

    if (currentFolder === 'Sent') {
      setEmails(prev => [newMail, ...prev]);
    }
    setLoading(false);
    return { success: true, email: newMail };
  };

  // Save draft
  const saveDraft = async (draftData) => {
    setLoading(true);
    setError(null);

    const draftMail = {
      id: `draft-${Date.now()}`,
      from_name: user?.name || activeAccount.split('@')[0],
      from_email: activeAccount !== 'all' ? activeAccount : (user?.email || 'Juan.ampuero@atento5.com'),
      to_name: draftData.to || '',
      to_email: draftData.to || '',
      subject: draftData.subject || '(Sin Asunto)',
      body: draftData.body || '',
      date: new Date().toISOString(),
      is_read: true,
      is_starred: false,
      folder: 'Drafts',
      has_attachments: false,
      attachments: []
    };

    const store = getLocalEmailsStore();
    store.unshift(draftMail);
    saveLocalStore(store);

    if (currentFolder === 'Drafts') {
      setEmails(prev => [draftMail, ...prev]);
    }
    setLoading(false);
    return { success: true, draft: draftMail };
  };

  // Fetch folders sync status
  const fetchFolders = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/imap/folders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }

      const data = await response.json();
      return data.folders;
    } catch (err) {
      console.error('Error fetching folders:', err);
      return folders;
    }
  };

  // Get email attachments
  const getAttachments = async (emailId) => {
    try {
      const token = getToken();
      if (token && !window.isBackendOffline) {
        const response = await fetch(`${API_URL}/email/${emailId}/attachments`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          return data.attachments;
        }
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('network') || err.message.includes('refused') || err.name === 'TypeError') {
        window.isBackendOffline = true;
      }
    }

    // Local fallback
    const store = getLocalEmailsStore();
    const found = store.find(e => e.id === emailId);
    return found ? found.attachments || [] : [];
  };

  // Download attachment
  const downloadAttachment = async (attachmentId, filename) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/email/attachment/${attachmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download attachment');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading attachment:', err);
      throw err;
    }
  };

  // Load accounts and initial emails
  useEffect(() => {
    const token = getToken();
    if (token && user) {
      fetchAccounts();
      if (user.email) {
        setActiveAccount(user.email);
      }
    }
  }, [user]);

  // Reload emails when folder or active account changes
  useEffect(() => {
    fetchEmails(currentFolder);
    if (currentFolder !== 'INBOX') {
      fetchUnreadInboxEmails();
    }
  }, [currentFolder, activeAccount]);

  const value = {
    unreadInboxEmails,
    fetchUnreadInboxEmails,
    emails,
    currentFolder,
    selectedEmail,
    loading,
    error,
    folders,
    unreadCount,
    accounts,
    activeAccount,
    setActiveAccount,
    selectedCategory,
    setSelectedCategory,
    selectedOrigin,
    setSelectedOrigin,
    selectedPriority,
    setSelectedPriority,
    categories,
    categorizeEmail,
    getFilteredEmails,
    dateFilter,
    setDateFilter,
    fetchAccounts,
    setCurrentFolder,
    setSelectedEmail,
    fetchEmails,
    fetchEmail,
    markAsRead,
    toggleStar,
    deleteEmail,
    searchEmails,
    syncFolder,
    sendEmail,
    saveDraft,
    fetchFolders,
    getAttachments,
    downloadAttachment,
    augmentEmail
  };

  return (
    <MailContext.Provider value={value}>
      {children}
    </MailContext.Provider>
  );
};

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Inbox, Star, FileText,
  Trash2, Wifi, Shield, Search, Paperclip,
  X, Reply, ArrowRight, Check,
  Download, File, CornerUpRight, RefreshCw,
  AlertOctagon, Archive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Logo Atento5.png';
import MailChrome from '../components/mail/MailChrome';
import MailWorkspace from '../components/mail/MailWorkspace';

const PAGE_SIZE = 50;

const EmailLauncher = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [emails, setEmails] = useState([]);
  const [activeFolder, setActiveFolder] = useState(() => sessionStorage.getItem('a5_active_folder') || 'inbox');
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState(user?.email || 'all');

  const [renderedCount, setRenderedCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAttachments, setComposeAttachments] = useState([]);
  const [composeFiles, setComposeFiles] = useState([]);
  const [showContactsDropdown, setShowContactsDropdown] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [sendingStatus, setSendingStatus] = useState('idle');
  const listRef = useRef(null);
  const sentinelRef = useRef(null);
  const emailIdsRef = useRef(new Set());

  const accounts = useMemo(() => {
    if (user?.email) {
      return [{ email: user.email, isPrimary: true }];
    }
    return [];
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) setActiveAccount(user.email);
  }, [user?.email]);

  useEffect(() => {
    sessionStorage.setItem('a5_active_folder', activeFolder);
  }, [activeFolder]);

  const fetchAllEmailsPaginated = useCallback(async (folderKey, signal) => {
    const emailPassword = sessionStorage.getItem('a5_email_password');
    const userEmail = user?.email?.toLowerCase();
    if (!emailPassword || !userEmail) return [];

    const allEmails = [];
    const limit = 100;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      if (signal?.aborted) throw new Error('Aborted');

      const response = await fetch(`/mail_api.php?action=get_emails&folder=${encodeURIComponent(folderKey)}&limit=${limit}&offset=${offset}`, {
        headers: {
          'X-Email': user.email,
          'X-Password': emailPassword
        },
        signal
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Error del servidor');

      const batch = data.emails || [];
      allEmails.push(...batch);
      hasMore = batch.length === limit;
      offset += batch.length;
      if (batch.length === 0 || !hasMore) hasMore = false;
    }

    return allEmails;
  }, [user?.email]);

  const loadEmails = useCallback(async (folderKey = activeFolder, silent = false) => {
    const emailPassword = sessionStorage.getItem('a5_email_password');
    const userEmail = user?.email?.toLowerCase();

    if (!emailPassword || !userEmail) {
      setEmails([]);
      return;
    }

    if (!silent) setIsLoading(true);
    else setIsSyncing(true);
    setApiError(null);

    try {
      const controller = new AbortController();
      const emails = await fetchAllEmailsPaginated(folderKey, controller.signal);
      setEmails(emails);
      localStorage.setItem(`a5_emails_${userEmail}_${folderKey}`, JSON.stringify(emails));
    } catch (err) {
      console.warn('API Error, falling back to local cache:', err.message);
      setApiError(err.message);
      const cached = localStorage.getItem(`a5_emails_${userEmail}_${folderKey}`);
      if (cached) setEmails(JSON.parse(cached));
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [activeFolder, fetchAllEmailsPaginated]);

  useEffect(() => {
    setEmails([]);
    setRenderedCount(PAGE_SIZE);
    loadEmails(activeFolder, false);
  }, [activeFolder]);

  useEffect(() => {
    const userEmail = user?.email?.toLowerCase();
    if (!userEmail) return;
    const saved = localStorage.getItem(`a5_emails_${userEmail}_${activeFolder}`);
    if (saved) {
      try {
        setEmails(JSON.parse(saved));
      } catch {}
    }
  }, [user, activeFolder]);

  useEffect(() => {
    const emailPassword = sessionStorage.getItem('a5_email_password');
    const userEmail = user?.email?.toLowerCase();
    if (!emailPassword || !userEmail) return;

    let mounted = true;
    let interval;

    const sync = async () => {
      try {
        const controller = new AbortController();
        const fresh = await fetchAllEmailsPaginated(activeFolder, controller.signal);
        if (!mounted) return;
        if (fresh.length > 0) {
          setEmails(fresh);
          localStorage.setItem(`a5_emails_${userEmail}_${activeFolder}`, JSON.stringify(fresh));
        }
      } catch (err) {
        console.warn('Polling error:', err);
      }
    };

    sync();
    interval = setInterval(sync, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeFolder, user, fetchAllEmailsPaginated]);

  const contacts = useMemo(() => {
    const unique = [];
    const seen = new Set();
    for (const email of emails) {
      const from = email.fromEmail || email.toEmail;
      if (!from || seen.has(from)) continue;
      seen.add(from);
      unique.push({
        name: email.fromName || from,
        email: from,
        subject: email.subject || ''
      });
    }
    return unique;
  }, [emails]);

  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) return emails;
    const q = searchQuery.toLowerCase();
    return emails.filter(email => {
      const fromName = (email.fromName || '').toLowerCase();
      const fromEmail = (email.fromEmail || '').toLowerCase();
      const subject = (email.subject || '').toLowerCase();
      const body = (email.body || '').toLowerCase();
      return fromName.includes(q) || fromEmail.includes(q) || subject.includes(q) || body.includes(q);
    });
  }, [emails, searchQuery]);

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else navigate('/home');
  };

  return (
    <MailChrome
      emails={emails}
      filteredEmails={filteredEmails}
      activeFolder={activeFolder}
      setActiveFolder={setActiveFolder}
      selectedEmailId={selectedEmailId}
      setSelectedEmailId={setSelectedEmailId}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onRefresh={() => loadEmails(activeFolder, false)}
      loading={isLoading}
      syncing={isSyncing}
      onOpenCompose={() => {
        setIsComposeOpen(true);
      }}
      onBack={handleBack}
      accounts={accounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount}
      contacts={contacts}
    >
      <MailWorkspace
        emails={emails}
        filteredEmails={filteredEmails}
        selectedEmailId={selectedEmailId}
        selectedEmail={selectedEmail}
        onSelectEmail={setSelectedEmailId}
        onRefresh={() => loadEmails(activeFolder, false)}
        loading={isLoading}
        onOpenCompose={() => {
          setIsComposeOpen(true);
        }}
        contacts={contacts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </MailChrome>
  );
};

export default EmailLauncher;

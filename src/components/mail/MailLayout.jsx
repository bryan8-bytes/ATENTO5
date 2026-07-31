import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox, Send, FileText, AlertOctagon, Trash2,
  Menu, LogOut, Star, Mail
} from "lucide-react";
import { useMail } from "../../context/MailContext";
import { useAuth } from "../../context/AuthContext";
import GradientText from "../../components/ui/GradientText";
import EmailComposer from "./EmailComposer";

const MailLayout = ({ children, onOpenCompose, onBack }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    currentFolder,
    setCurrentFolder,
    activeAccount,
    setActiveAccount,
    unreadCount = {},
    accounts = [],
  } = useMail();

  const handleFolderChange = useCallback(
    (folder) => {
      setCurrentFolder(folder);
      setMobileMenuOpen(false);
    },
    [setCurrentFolder]
  );

  const folders = [
    { key: "inbox", label: "Recibidos", icon: Inbox },
    { key: "starred", label: "Destacados", icon: Star },
    { key: "sent", label: "Enviados", icon: Send },
    { key: "drafts", label: "Borradores", icon: FileText },
    { key: "spam", label: "Spam", icon: AlertOctagon },
    { key: "trash", label: "Papelera", icon: Trash2 },
  ];

  return (
    <div className="h-screen w-full flex text-slate-200 overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: mobileMenuOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", damping: 26, stiffness: 210 }}
        className="fixed lg:relative z-50 h-full flex flex-col"
        style={{
          background: '#050B14',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          width: '48px',
          padding: '18px 6px',
        }}
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          {folders.map(({ key, label, icon: Icon }, index) => {
            const isActive = currentFolder === key;
            const color = index % 2 === 0 ? '#3CB4FF' : '#D21414';
            
            return (
              <div
                key={key}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <motion.button
                  onClick={() => handleFolderChange(key)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isActive ? 30 : 16,
                    height: isActive ? 30 : 16,
                    borderRadius: '50%',
                    background: isActive ? `linear-gradient(135deg, ${color}, ${index % 2 === 0 ? '#D21414' : '#3CB4FF'})` : 'rgba(255, 255, 255, 0.92)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 0 22px ${color}, 0 0 40px ${color}45` : '0 0 6px rgba(255, 255, 255, 0.18)',
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <Icon
                    size={isActive ? 18 : 14}
                    style={{
                      color: isActive ? '#fff' : 'rgba(148, 163, 184, 0.85)',
                      filter: isActive ? 'drop-shadow(0 0 4px currentColor)' : 'none',
                    }}
                  />
                </motion.button>
                <div
                  style={{
                    position: 'absolute',
                    right: '42px',
                    background: '#050B14',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    border: `1px solid ${color}`,
                    boxShadow: `0 0 12px ${color}45`,
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.18s ease',
                    textTransform: 'uppercase',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={logout}
            className="p-2 rounded-full text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 h-full bg-black/20">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      <AnimatePresence>
        <EmailComposer onClose={() => {}} />
      </AnimatePresence>
    </div>
  );
};

export default MailLayout;

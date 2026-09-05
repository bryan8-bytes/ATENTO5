import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { useMail } from "../../context/MailContext";
import { useAuth } from "../../context/AuthContext";
import EmailComposer from "./EmailComposer";
import "./MailLayout.css";

const MailLayout = ({ children, onOpenCompose, onBack }) => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { currentFolder, setCurrentFolder } = useMail();

  const handleFolderChange = useCallback(
    (folder) => {
      setCurrentFolder(folder);
      setMobileMenuOpen(false);
    },
    [setCurrentFolder]
  );

  const folders = [
    { key: "inbox", label: "Recibidos", icon: () => null },
    { key: "starred", label: "Destacados", icon: () => null },
    { key: "sent", label: "Enviados", icon: () => null },
    { key: "drafts", label: "Borradores", icon: () => null },
    { key: "spam", label: "Spam", icon: () => null },
    { key: "trash", label: "Papelera", icon: () => null },
  ];

  return (
    <div className="mail-layout">
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
        className="mail-sidebar"
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          {folders.map(({ key, label }, index) => {
            const isActive = currentFolder === key;
            const color = index % 2 === 0 ? '#3CB4FF' : '#D21414';
            
            return (
              <div key={key} className="mail-sidebar-folder">
                <motion.button
                  onClick={() => handleFolderChange(key)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className={`mail-sidebar-button ${isActive ? 'mail-sidebar-button-active' : 'mail-sidebar-button-inactive'}`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${color}, ${index % 2 === 0 ? '#D21414' : '#3CB4FF'})`,
                          boxShadow: `0 0 22px ${color}, 0 0 40px ${color}45`,
                        }
                      : {}
                  }
                >
                  <span
                    style={{
                      color: isActive ? '#fff' : 'rgba(148, 163, 184, 0.85)',
                      filter: isActive ? 'drop-shadow(0 0 4px currentColor)' : 'none',
                      fontSize: isActive ? 18 : 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isActive ? '●' : '○'}
                  </span>
                </motion.button>
                <div
                  className="mail-sidebar-tooltip"
                  style={
                    isActive
                      ? {
                          borderColor: color,
                          boxShadow: `0 0 12px ${color}45`,
                        }
                      : {}
                  }
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mail-sidebar-logout">
          <button
            onClick={logout}
            className="mail-sidebar-logout-button"
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </motion.aside>

      <div className="mail-main">
        <main className="mail-content">{children}</main>
      </div>

      <AnimatePresence>
        <EmailComposer onClose={() => {}} />
      </AnimatePresence>
    </div>
  );
};

export default MailLayout;

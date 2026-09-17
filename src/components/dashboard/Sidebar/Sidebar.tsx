import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  Layers,
  Languages,
  BookMarked,
  PenLine,
  BookmarkCheck,
  Users,
  MessageSquare,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import type { UserProfile } from '../../../types/home';
import styles from './Sidebar.module.css';

interface SidebarProps {
  user: UserProfile;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavSection {
  group: string;
  items: {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
    href: string;
  }[];
}

const navSections: NavSection[] = [
  {
    group: 'INÍCIO',
    items: [
      { label: 'Início', icon: Compass, href: '/home' },
    ],
  },
  {
    group: 'ESCRITURAS',
    items: [
      { label: 'Bíblia', icon: BookOpen, href: '/bible' },
      { label: 'Temas', icon: Layers, href: '/themes' },
      { label: 'Palavras', icon: Languages, href: '/words' },
    ],
  },
  {
    group: 'ESTUDO',
    items: [
      { label: 'Meus estudos', icon: BookMarked, href: '/studies' },
      { label: 'Anotações', icon: PenLine, href: '/notes' },
      { label: 'Favoritos', icon: BookmarkCheck, href: '/favorites' },
    ],
  },
  {
    group: 'COMUNIDADE',
    items: [
      { label: 'Explorar', icon: Users, href: '/explore' },
      { label: 'Discussões', icon: MessageSquare, href: '/discussions' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('[Miqra Logout] Erro ao encerrar sessão:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      {/* Backdrop mobile */}
      {isOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.openMobile : ''}`}>
        {/* Cabeçalho da Sidebar / Marca */}
        <div className={styles.brandContainer}>
          <Link to="/home" className={styles.brandLink}>
            <div className={styles.logoMarkWrapper}>
              <img
                src="/assets/logo-icon-exact.png"
                alt="Símbolo Miqra"
                className={styles.brandLogoIcon}
              />
            </div>
            <div className={styles.brandTextGroup}>
              <span className={styles.brandName}>MIQRA</span>
              <span className={styles.brandSubtitle}>ESTUDO BÍBLICO</span>
            </div>
          </Link>

          {/* Botão de fechar visível apenas em mobile */}
          <button
            type="button"
            className={styles.closeMobileBtn}
            onClick={onClose}
            aria-label="Fechar menu de navegação"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Navegação */}
        <nav className={styles.navContainer} aria-label="Navegação principal">
          {navSections.map((section) => (
            <div key={section.group} className={styles.navGroup}>
              <span className={styles.groupHeading}>{section.group}</span>
              <ul className={styles.itemsList}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.href ||
                    (item.href === '/home' && location.pathname === '/') ||
                    (item.href === '/studies' &&
                      (location.pathname === '/studies' ||
                        location.pathname.startsWith('/studies/')));

                  return (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                        onClick={onClose}
                      >
                        <span className={styles.navIcon} aria-hidden="true">
                          <Icon size={17} strokeWidth={1.8} />
                        </span>
                        <span className={styles.navLabel}>{item.label}</span>
                        {isActive && <div className={styles.activeIndicator} aria-hidden="true" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Rodapé / Perfil do Usuário */}
        <div className={styles.userProfileFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <span>{user.name.charAt(0)}</span>
              <div className={styles.onlineBadge} />
            </div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userHandle}>@{user.username}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Encerrar sessão"
            aria-label="Sair"
          >
            <LogOut size={16} strokeWidth={1.7} />
          </button>
        </div>
      </aside>
    </>
  );
};

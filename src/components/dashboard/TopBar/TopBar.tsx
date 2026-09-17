import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import type { UserProfile } from '../../../types/home';
import styles from './TopBar.module.css';

interface TopBarProps {
  user: UserProfile;
  onOpenMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onOpenMobileMenu }) => {
  // Saudação dinâmica conforme a hora do dia
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const firstName = user.name.split(' ')[0];

  return (
    <header className={styles.topBar}>
      <div className={styles.greetingSection}>
        {/* Botão de abrir menu mobile */}
        <button
          type="button"
          className={styles.mobileMenuTrigger}
          onClick={onOpenMobileMenu}
          aria-label="Abrir menu de navegação"
        >
          <Menu size={22} />
        </button>

        <div className={styles.greetingText}>
          <h1 className={styles.greetingTitle}>
            {getGreeting()}, <span className={styles.highlightName}>{firstName}</span>
          </h1>
          <p className={styles.greetingSubtitle}>
            Continue sua jornada pelas Escrituras.
          </p>
        </div>
      </div>

      <div className={styles.actionsSection}>
        {/* Barra de Busca rápida */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">
            <Search size={15} strokeWidth={1.8} />
          </span>
          <input
            type="search"
            placeholder="Buscar passagens, temas, termos..."
            className={styles.searchInput}
            aria-label="Buscar passagens, temas ou termos no Miqra"
          />
          <kbd className={styles.searchShortcut}>⌘K</kbd>
        </div>

        {/* Notificações */}
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Visualizar notificações de estudo"
        >
          <Bell size={18} strokeWidth={1.7} />
          <span className={styles.notificationDot} aria-hidden="true" />
        </button>

        {/* Avatar rápido */}
        <div className={styles.avatarPill}>
          <div className={styles.userAvatar}>
            <span>{firstName.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

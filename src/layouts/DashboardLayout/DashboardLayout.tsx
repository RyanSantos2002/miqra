import React, { useState } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar/Sidebar';
import { TopBar } from '../../components/dashboard/TopBar/TopBar';
import { useAuth } from '../../hooks/useAuth';
import { mockCurrentUser } from '../../mocks/homeData';
import type { UserProfile } from '../../types/home';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const currentUser: UserProfile = user
    ? {
        name:
          user.user_metadata?.display_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Estudioso',
        username:
          user.user_metadata?.user_name ||
          user.email?.split('@')[0] ||
          'usuario',
        readingStreakDays: mockCurrentUser.readingStreakDays,
      }
    : mockCurrentUser;

  return (
    <div className={styles.dashboardContainer}>
      {/* Barra lateral fixa */}
      <Sidebar
        user={currentUser}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Área de conteúdo principal rolável */}
      <div className={styles.mainScrollArea}>
        <div className={styles.contentWrapper}>
          <TopBar
            user={currentUser}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className={styles.pageMain}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

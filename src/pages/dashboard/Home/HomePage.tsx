import React from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import { ContinueStudyCard } from '../../../components/dashboard/ContinueStudyCard/ContinueStudyCard';
import { QuickAccess } from '../../../components/dashboard/QuickAccess/QuickAccess';
import { RecentStudies } from '../../../components/dashboard/RecentStudies/RecentStudies';
import { StudyJourney } from '../../../components/dashboard/StudyJourney/StudyJourney';
import { FeaturedDiscussions } from '../../../components/dashboard/FeaturedDiscussions/FeaturedDiscussions';
import { VerseHighlight } from '../../../components/dashboard/VerseHighlight/VerseHighlight';
import {
  mockContinueStudy,
  mockQuickAccess,
  mockRecentStudies,
  mockJourneyStats,
  mockDiscussions,
  mockVerseHighlight,
} from '../../../mocks/homeData';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const handleContinueStudy = () => {
    // Ação visual placeholder preparada para integração
    window.location.href = '#continue-study';
  };

  return (
    <DashboardLayout>
      <div className={styles.homeContainer}>
        {/* Bloco 1: Card Principal de Continuar Estudo */}
        <section className={styles.heroSection}>
          <ContinueStudyCard
            data={mockContinueStudy}
            onContinue={handleContinueStudy}
          />
        </section>

        {/* Bloco 2: Acesso Rápido às Escrituras */}
        <section className={styles.quickAccessSection}>
          <QuickAccess items={mockQuickAccess} />
        </section>

        {/* Bloco 3: Grid Principal de Conteúdo (Estudos Recentes + Jornada + Discussões + Versículo) */}
        <div className={styles.mainContentGrid}>
          {/* Coluna Primária (Esquerda): Estudos e Versículo em Destaque */}
          <div className={styles.primaryColumn}>
            <RecentStudies studies={mockRecentStudies} />
            <VerseHighlight data={mockVerseHighlight} />
          </div>

          {/* Coluna Secundária (Direita): Minha Jornada e Discussões Teológicas */}
          <aside className={styles.secondaryColumn}>
            <StudyJourney stats={mockJourneyStats} />
            <FeaturedDiscussions discussions={mockDiscussions} />
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;

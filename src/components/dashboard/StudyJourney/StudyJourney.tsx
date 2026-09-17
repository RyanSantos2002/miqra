import React from 'react';
import { BookOpen, BookMarked, PenLine, GitFork } from 'lucide-react';
import type { JourneyStats } from '../../../types/home';
import styles from './StudyJourney.module.css';

interface StudyJourneyProps {
  stats: JourneyStats;
}

export const StudyJourney: React.FC<StudyJourneyProps> = ({ stats }) => {
  const metrics = [
    {
      id: 'chapters',
      value: stats.chaptersRead,
      label: 'Capítulos explorados',
      icon: BookOpen,
    },
    {
      id: 'studies',
      value: stats.studiesCreated,
      label: 'Estudos formulados',
      icon: BookMarked,
    },
    {
      id: 'notes',
      value: stats.notesCount,
      label: 'Anotações registradas',
      icon: PenLine,
    },
    {
      id: 'refs',
      value: stats.crossReferencesCount,
      label: 'Referências conectadas',
      icon: GitFork,
    },
  ];

  return (
    <section className={styles.sectionContainer} aria-label="Progresso da minha jornada de estudo">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Minha Jornada</h2>
        <span className={styles.sectionCaption}>Seu progresso pessoal nas Escrituras</span>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.id} className={styles.metricCard}>
              <div className={styles.iconContainer}>
                <Icon size={16} strokeWidth={1.8} />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

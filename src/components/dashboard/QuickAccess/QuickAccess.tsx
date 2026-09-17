import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Languages, Landmark, ArrowUpRight } from 'lucide-react';
import type { QuickAccessItem } from '../../../types/home';
import styles from './QuickAccess.module.css';

interface QuickAccessProps {
  items: QuickAccessItem[];
}

const iconMap = {
  BookOpen,
  Layers,
  Languages,
  Landmark,
};

export const QuickAccess: React.FC<QuickAccessProps> = ({ items }) => {
  return (
    <section className={styles.sectionContainer} aria-label="Acesso rápido às Escrituras">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Explorar as Escrituras</h2>
        <span className={styles.sectionSubtitle}>Ferramentas fundamentais de estudo textual</span>
      </div>

      <div className={styles.gridContainer}>
        {items.map((item) => {
          const Icon = iconMap[item.iconName] || BookOpen;

          return (
            <Link key={item.id} to={item.href} className={styles.blockCard}>
              <div className={styles.iconWrapper}>
                <Icon size={20} strokeWidth={1.7} />
              </div>

              <div className={styles.blockInfo}>
                <div className={styles.titleRow}>
                  <h3 className={styles.blockTitle}>{item.title}</h3>
                  <ArrowUpRight size={14} className={styles.externalArrow} aria-hidden="true" />
                </div>
                <p className={styles.blockSubtitle}>{item.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

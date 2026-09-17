import React from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, User, GitFork, ArrowUpRight } from 'lucide-react';
import type { RecentStudyItem } from '../../../types/home';
import styles from './RecentStudies.module.css';

interface RecentStudiesProps {
  studies: RecentStudyItem[];
}

export const RecentStudies: React.FC<RecentStudiesProps> = ({ studies }) => {
  return (
    <section className={styles.sectionContainer} aria-label="Estudos bíblicos recentes">
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.sectionTitle}>Estudos Recentes</h2>
          <span className={styles.sectionBadge}>COMUNIDADE ACADÊMICA</span>
        </div>
        <Link to="/explore" className={styles.viewAllLink}>
          Ver todos os estudos →
        </Link>
      </div>

      <div className={styles.studiesList}>
        {studies.map((study) => (
          <article key={study.id} className={styles.studyCard}>
            <div className={styles.studyMain}>
              <div className={styles.metaTop}>
                <span className={styles.referenceTag}>
                  <BookMarked size={12} />
                  <span>{study.biblicalReference}</span>
                </span>
                <span className={styles.timeAgo}>{study.timeAgo}</span>
              </div>

              <h3 className={styles.studyTitle}>
                <Link to={`/study/${study.id}`} className={styles.studyTitleLink}>
                  {study.title}
                </Link>
              </h3>

              <p className={styles.studyExcerpt}>{study.excerpt}</p>
            </div>

            <div className={styles.studyFooter}>
              <div className={styles.authorMeta}>
                <div className={styles.authorAvatar}>
                  <User size={12} />
                </div>
                <span className={styles.authorName}>{study.author}</span>
              </div>

              <div className={styles.referencesCount} title="Referências cruzadas analisadas">
                <GitFork size={13} />
                <span>{study.crossReferencesCount} refs</span>
              </div>

              <Link
                to={`/study/${study.id}`}
                className={styles.readMoreBtn}
                aria-label={`Ler estudo completo sobre ${study.title}`}
              >
                <span>Ler estudo</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

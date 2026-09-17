import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, BookOpen, ChevronRight } from 'lucide-react';
import type { DiscussionItem } from '../../../types/home';
import styles from './FeaturedDiscussions.module.css';

interface FeaturedDiscussionsProps {
  discussions: DiscussionItem[];
}

export const FeaturedDiscussions: React.FC<FeaturedDiscussionsProps> = ({ discussions }) => {
  return (
    <section className={styles.sectionContainer} aria-label="Discussões em destaque na comunidade">
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.sectionTitle}>Discussões em Destaque</h2>
          <span className={styles.badgeText}>EXEGESE & TEOLOGIA</span>
        </div>
        <Link to="/discussions" className={styles.viewAllLink}>
          Ver todas →
        </Link>
      </div>

      <div className={styles.discussionsList}>
        {discussions.map((item) => (
          <article key={item.id} className={styles.discussionCard}>
            <div className={styles.discussionHeader}>
              <span className={styles.referenceBadge}>
                <BookOpen size={11} />
                <span>{item.reference}</span>
              </span>
              <div className={styles.activityMeta}>
                <Clock size={11} />
                <span>{item.lastActivity}</span>
              </div>
            </div>

            <h3 className={styles.discussionTitle}>
              <Link to={`/discussions/${item.id}`} className={styles.titleLink}>
                {item.title}
              </Link>
            </h3>

            <div className={styles.discussionFooter}>
              <div className={styles.repliesInfo}>
                <MessageSquare size={13} />
                <span>{item.repliesCount} contribuições</span>
              </div>

              <Link
                to={`/discussions/${item.id}`}
                className={styles.participateLink}
                aria-label={`Participar da discussão: ${item.title}`}
              >
                <span>Participar</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

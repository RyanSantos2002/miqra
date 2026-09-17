import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookMarked,
  Plus,
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import {
  getMyStudies,
  createStudy,
  updateStudy,
  deleteStudy,
} from '../../../services/studies';
import type { Study } from '../../../types/studies';
import styles from './StudiesListPage.module.css';

const formatRelativeTime = (dateStr: string): string => {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Atualizado agora há pouco';
    if (diffMinutes < 60) return `Atualizado há ${diffMinutes} min`;
    if (diffHours < 24) return `Atualizado há ${diffHours}h`;
    if (diffDays === 1) return 'Atualizado ontem';
    if (diffDays < 30) return `Atualizado há ${diffDays} dias`;
    return `Atualizado em ${new Date(dateStr).toLocaleDateString('pt-BR')}`;
  } catch {
    return 'Atualizado recentemente';
  }
};

export const StudiesListPage: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal de Confirmação de Exclusão
  const [deletingStudy, setDeletingStudy] = useState<Study | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchStudies = () => {
    setIsLoading(true);
    setErrorMessage(null);

    getMyStudies()
      .then((items) => {
        setStudies(items);
      })
      .catch((err) => {
        console.error('[Miqra Studies] Erro ao carregar estudos:', err);
        setErrorMessage('Não foi possível carregar seus estudos no momento.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;

    getMyStudies()
      .then((items) => {
        if (!isMounted) return;
        setStudies(items);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[Miqra Studies] Erro ao carregar estudos:', err);
        setErrorMessage('Não foi possível carregar seus estudos no momento.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingStudy(null);
    setFormTitle('');
    setFormDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (study: Study, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingStudy(study);
    setFormTitle(study.title);
    setFormDescription(study.description);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (study: Study, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDeletingStudy(study);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Por favor, informe um título para o estudo.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingStudy) {
        // Atualizar
        const updated = await updateStudy(editingStudy.id, {
          title: formTitle,
          description: formDescription,
        });
        setStudies((prev) =>
          prev.map((s) => (s.id === editingStudy.id ? { ...s, ...updated } : s))
        );
      } else {
        // Criar
        const created = await createStudy({
          title: formTitle,
          description: formDescription,
        });
        setStudies((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error('[Miqra Studies] Erro ao salvar estudo:', err);
      setFormError(
        err instanceof Error ? err.message : 'Falha ao salvar o estudo no Supabase.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudy) return;

    setIsDeleting(true);
    try {
      await deleteStudy(deletingStudy.id);
      setStudies((prev) => prev.filter((s) => s.id !== deletingStudy.id));
      setDeletingStudy(null);
    } catch (err: unknown) {
      console.error('[Miqra Studies] Erro ao excluir estudo:', err);
      alert(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir o estudo. Tente novamente.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtragem de estudos pela busca
  const filteredStudies = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return studies;
    return studies.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
  }, [studies, searchQuery]);

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Cabeçalho da Página */}
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              <BookMarked className={styles.titleIcon} size={32} />
              Meus estudos
            </h1>
            <p className={styles.subtitle}>
              Organize aquilo que você está aprendendo nas Escrituras.
            </p>
          </div>
          <button
            type="button"
            className={styles.newStudyBtn}
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <span>Novo estudo</span>
          </button>
        </header>

        {/* Barra de Pesquisa */}
        {studies.length > 0 && (
          <section className={styles.searchSection} aria-label="Busca de estudos">
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar nos meus estudos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar nos meus estudos"
              />
            </div>
          </section>
        )}

        {/* Estado de Carregamento */}
        {isLoading && (
          <div className={styles.centerStatus} role="status">
            <RefreshCw className={styles.spinner} size={32} />
            <p>Carregando sua biblioteca de estudos...</p>
          </div>
        )}

        {/* Estado de Erro */}
        {!isLoading && errorMessage && (
          <div className={styles.centerStatus} role="alert">
            <AlertCircle size={32} color="#f87171" />
            <p>{errorMessage}</p>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={fetchStudies}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado Vazio (Sem estudos cadastrados) */}
        {!isLoading && !errorMessage && studies.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <BookOpen size={36} />
            </div>
            <h2 className={styles.emptyTitle}>Seu primeiro estudo começa aqui.</h2>
            <p className={styles.emptySubtitle}>
              Crie um espaço para organizar suas descobertas nas Escrituras,
              reunindo versículos, notas e reflexões.
            </p>
            <button
              type="button"
              className={styles.newStudyBtn}
              onClick={openCreateModal}
            >
              <Plus size={18} />
              <span>Criar meu primeiro estudo</span>
            </button>
          </div>
        )}

        {/* Busca sem resultados */}
        {!isLoading &&
          !errorMessage &&
          studies.length > 0 &&
          filteredStudies.length === 0 && (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Nenhum estudo encontrado</h3>
              <p className={styles.emptySubtitle}>
                Não encontramos nenhum estudo correspondente ao termo "{searchQuery}".
              </p>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setSearchQuery('')}
              >
                Limpar busca
              </button>
            </div>
          )}

        {/* Grid de Cards de Estudos */}
        {!isLoading && !errorMessage && filteredStudies.length > 0 && (
          <div className={styles.studiesGrid}>
            {filteredStudies.map((study) => (
              <article key={study.id} className={styles.studyCard}>
                <div>
                  <div className={styles.cardTop}>
                    <h2 className={styles.cardTitle}>{study.title}</h2>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={(e) => openEditModal(study, e)}
                        title="Editar estudo"
                        aria-label={`Editar ${study.title}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        onClick={(e) => openDeleteModal(study, e)}
                        title="Excluir estudo"
                        aria-label={`Excluir ${study.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className={styles.cardDescription}>
                    {study.description || 'Nenhuma descrição adicionada.'}
                  </p>
                </div>

                <div>
                  <div className={styles.cardMeta}>
                    <span className={styles.refBadge}>
                      <BookOpen size={14} />
                      {study.versesCount === 1
                        ? '1 referência'
                        : `${study.versesCount} referências`}
                    </span>
                    <span className={styles.updatedTime}>
                      <Clock size={13} />
                      {formatRelativeTime(study.updatedAt)}
                    </span>
                  </div>

                  <Link to={`/studies/${study.id}`} className={styles.openLink}>
                    <span>Abrir estudo</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição de Estudo */}
      {isModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !isSubmitting && setIsModalOpen(false)}
          aria-hidden="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={editingStudy ? 'Editar estudo' : 'Novo estudo'}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingStudy ? 'Editar estudo' : 'Novo estudo'}
              </h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className={styles.modalForm}>
              {formError && (
                <div role="alert" style={{ color: '#f87171', fontSize: '0.88rem' }}>
                  {formError}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="study-title" className={styles.formLabel}>
                  Título *
                </label>
                <input
                  id="study-title"
                  type="text"
                  className={styles.formInput}
                  placeholder="Ex: A criação em Gênesis"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="study-desc" className={styles.formLabel}>
                  Descrição
                </label>
                <textarea
                  id="study-desc"
                  className={styles.formTextarea}
                  placeholder="Ex: Estudo sobre a criação, seus elementos e significado."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Salvando...'
                    : editingStudy
                    ? 'Salvar alterações'
                    : 'Criar estudo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deletingStudy && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !isDeleting && setDeletingStudy(null)}
          aria-hidden="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Confirmar exclusão de estudo"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Excluir estudo</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDeletingStudy(null)}
                disabled={isDeleting}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalForm}>
              <p className={styles.deleteWarningText}>
                Tem certeza que deseja excluir o estudo{' '}
                <strong style={{ color: '#f5f3ef' }}>"{deletingStudy.title}"</strong>?
              </p>
              <p className={styles.deleteWarningText} style={{ color: '#9a9891', fontSize: '0.88rem' }}>
                Isso removerá permanentemente o estudo e suas associações de
                versículos. Seus dados bíblicos, favoritos e anotações pessoais
                permanecerão intactos.
              </p>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setDeletingStudy(null)}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.submitBtnDanger}
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Excluindo...' : 'Sim, excluir estudo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

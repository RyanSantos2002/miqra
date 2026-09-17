import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  PenTool,
  Clock,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import {
  getStudyById,
  updateStudy,
  deleteStudy,
  removeVerseFromStudy,
} from '../../../services/studies';
import type { Study, StudyVerse } from '../../../types/studies';
import styles from './StudyDetailPage.module.css';

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

type StudyTab = 'verses' | 'notes' | 'ideas' | 'topics' | 'questions' | 'conclusions';

export const StudyDetailPage: React.FC = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const [study, setStudy] = useState<Study | null>(null);
  const [verses, setVerses] = useState<StudyVerse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<StudyTab>('verses');

  // Anotações do Estudo
  const [studyNotes, setStudyNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [notesSaveStatus, setNotesSaveStatus] = useState<string | null>(null);

  // Modal de Edição do Estudo
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Modal de Exclusão do Estudo
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeletingStudy, setIsDeletingStudy] = useState<boolean>(false);

  // Modal de Remoção de Versículo
  const [verseToRemove, setVerseToRemove] = useState<StudyVerse | null>(null);
  const [isRemovingVerse, setIsRemovingVerse] = useState<boolean>(false);

  const loadData = () => {
    if (!studyId) return;

    setIsLoading(true);
    setErrorMessage(null);

    getStudyById(studyId)
      .then((res) => {
        if (!res) {
          setErrorMessage('Estudo não encontrado ou você não possui permissão para acessá-lo.');
          return;
        }
        setStudy(res.study);
        setVerses(res.verses);
        setStudyNotes(res.study.notes || '');
      })
      .catch((err) => {
        console.error('[Miqra StudyDetail] Erro ao carregar estudo:', err);
        setErrorMessage('Falha ao carregar as informações do estudo.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!studyId) return;
    let isMounted = true;

    getStudyById(studyId)
      .then((res) => {
        if (!isMounted) return;
        if (!res) {
          setErrorMessage('Estudo não encontrado ou você não possui permissão para acessá-lo.');
          setIsLoading(false);
          return;
        }
        setStudy(res.study);
        setVerses(res.verses);
        setStudyNotes(res.study.notes || '');
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[Miqra StudyDetail] Erro ao carregar estudo:', err);
        setErrorMessage('Falha ao carregar as informações do estudo.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [studyId]);

  const handleSaveNotes = async () => {
    if (!study) return;

    setIsSavingNotes(true);
    setNotesSaveStatus(null);

    try {
      const updated = await updateStudy(study.id, { notes: studyNotes });
      setStudy((prev) => (prev ? { ...prev, ...updated } : prev));
      setNotesSaveStatus('Anotações salvas com sucesso!');
      setTimeout(() => setNotesSaveStatus(null), 3000);
    } catch (err: unknown) {
      console.error('[Miqra StudyDetail] Erro ao salvar notas:', err);
      alert(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar as anotações do estudo.'
      );
    } finally {
      setIsSavingNotes(false);
    }
  };

  const openEditModal = () => {
    if (!study) return;
    setEditTitle(study.title);
    setEditDescription(study.description);
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveStudyInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!study) return;

    if (!editTitle.trim()) {
      setEditError('O título do estudo não pode ficar vazio.');
      return;
    }

    setIsSubmittingEdit(true);
    setEditError(null);

    try {
      const updated = await updateStudy(study.id, {
        title: editTitle,
        description: editDescription,
      });
      setStudy((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      console.error('[Miqra StudyDetail] Erro ao editar estudo:', err);
      setEditError(
        err instanceof Error ? err.message : 'Falha ao salvar as alterações do estudo.'
      );
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleConfirmDeleteStudy = async () => {
    if (!study) return;

    setIsDeletingStudy(true);
    try {
      await deleteStudy(study.id);
      navigate('/studies', { replace: true });
    } catch (err: unknown) {
      console.error('[Miqra StudyDetail] Erro ao excluir estudo:', err);
      alert(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir o estudo. Tente novamente.'
      );
      setIsDeletingStudy(false);
    }
  };

  const handleConfirmRemoveVerse = async () => {
    if (!verseToRemove || !study) return;

    setIsRemovingVerse(true);
    try {
      await removeVerseFromStudy(verseToRemove.id);
      setVerses((prev) => prev.filter((v) => v.id !== verseToRemove.id));
      setStudy((prev) =>
        prev
          ? {
              ...prev,
              versesCount: Math.max(0, prev.versesCount - 1),
              updatedAt: new Date().toISOString(),
            }
          : prev
      );
      setVerseToRemove(null);
    } catch (err: unknown) {
      console.error('[Miqra StudyDetail] Erro ao remover versículo do estudo:', err);
      alert(
        err instanceof Error
          ? err.message
          : 'Não foi possível remover o versículo do estudo.'
      );
    } finally {
      setIsRemovingVerse(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Navegação de Retorno */}
        <nav className={styles.topNav} aria-label="Navegação secundária">
          <Link to="/studies" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Voltar para Meus estudos</span>
          </Link>
        </nav>

        {/* Estado de Carregamento */}
        {isLoading && (
          <div className={styles.centerStatus} role="status">
            <RefreshCw className={styles.spinner} size={32} />
            <p>Carregando estudo bíblico...</p>
          </div>
        )}

        {/* Estado de Erro */}
        {!isLoading && (errorMessage || !study) && (
          <div className={styles.centerStatus} role="alert">
            <AlertCircle size={36} color="#f87171" />
            <h2>Estudo não encontrado</h2>
            <p>{errorMessage || 'O estudo solicitado não existe ou foi removido.'}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link to="/studies" className={styles.btnExploreBible}>
                Ver Meus Estudos
              </Link>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={loadData}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Principal do Estudo */}
        {!isLoading && study && (
          <>
            {/* Cabeçalho do Estudo */}
            <header className={styles.studyHeader}>
              <div className={styles.headerTop}>
                <div className={styles.titleArea}>
                  <h1 className={styles.studyTitle}>{study.title}</h1>
                  {study.description ? (
                    <p className={styles.studyDescription}>{study.description}</p>
                  ) : (
                    <p className={styles.studyDescription} style={{ fontStyle: 'italic', opacity: 0.6 }}>
                      Nenhuma descrição adicionada para este estudo.
                    </p>
                  )}
                </div>

                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.btnAction}
                    onClick={openEditModal}
                    title="Editar título e descrição do estudo"
                  >
                    <Edit2 size={15} />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.btnAction} ${styles.btnActionDanger}`}
                    onClick={() => setIsDeleteModalOpen(true)}
                    title="Excluir estudo"
                  >
                    <Trash2 size={15} />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>

              <div className={styles.headerMeta}>
                <span className={`${styles.metaItem} ${styles.metaItemGold}`}>
                  <BookOpen size={15} />
                  <span>
                    {verses.length === 1
                      ? '1 referência bíblica'
                      : `${verses.length} referências bíblicas`}
                  </span>
                </span>
                <span className={styles.metaItem}>
                  <Clock size={14} />
                  <span>{formatRelativeTime(study.updatedAt)}</span>
                </span>
              </div>
            </header>

            {/* Barra de Abas / Categorias de Estudo */}
            <nav className={styles.tabsBar} aria-label="Seções do estudo">
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'verses' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('verses')}
              >
                <BookOpen size={16} />
                <span>REFERÊNCIAS BÍBLICAS</span>
                <span className={styles.tabBadge}>{verses.length}</span>
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <PenTool size={16} />
                <span>ANOTAÇÕES DO ESTUDO</span>
                {studyNotes.trim() && <span className={styles.tabBadge}>●</span>}
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${styles.tabBtnDisabled}`}
                title="Em breve: organize ideias e insights"
                disabled
              >
                <Sparkles size={15} />
                <span>IDEIAS</span>
                <span className={styles.tabFutureBadge}>Em breve</span>
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${styles.tabBtnDisabled}`}
                title="Em breve: separe por tópicos temáticos"
                disabled
              >
                <span>TÓPICOS</span>
                <span className={styles.tabFutureBadge}>Em breve</span>
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${styles.tabBtnDisabled}`}
                title="Em breve: anote perguntas para aprofundamento"
                disabled
              >
                <HelpCircle size={15} />
                <span>PERGUNTAS</span>
                <span className={styles.tabFutureBadge}>Em breve</span>
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${styles.tabBtnDisabled}`}
                title="Em breve: sintetize conclusões finais"
                disabled
              >
                <span>CONCLUSÕES</span>
                <span className={styles.tabFutureBadge}>Em breve</span>
              </button>
            </nav>

            {/* ABA: Referências Bíblicas */}
            {activeTab === 'verses' && (
              <section className={styles.sectionContainer} aria-label="Referências Bíblicas">
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <BookOpen size={20} color="#d4a85c" />
                    <span>Passagens e Versículos Adicionados</span>
                  </h2>
                </div>

                {verses.length === 0 ? (
                  <div className={styles.emptyVersesState}>
                    <div className={styles.emptyVersesIcon}>
                      <BookOpen size={28} />
                    </div>
                    <h3 className={styles.emptyVersesTitle}>
                      Nenhuma referência bíblica adicionada ainda
                    </h3>
                    <p className={styles.emptyVersesSubtitle}>
                      Ao ler qualquer capítulo na Bíblia, clique sobre um versículo e escolha{' '}
                      <strong>"📚 Adicionar ao estudo"</strong> para vinculá-lo a este estudo.
                    </p>
                    <Link to="/bible" className={styles.btnExploreBible}>
                      <BookOpen size={16} />
                      <span>Ir para a Bíblia</span>
                    </Link>
                  </div>
                ) : (
                  <div className={styles.versesList}>
                    {verses.map((item) => (
                      <article key={item.id} className={styles.verseCard}>
                        <div className={styles.verseCardHeader}>
                          <span className={styles.verseReference}>
                            {item.bookName.toUpperCase()} {item.chapter}:{item.verse}
                          </span>
                          <span className={styles.versionBadge}>{item.version}</span>
                        </div>

                        <p className={styles.verseText}>
                          {item.verseText
                            ? `“${item.verseText}”`
                            : '(Carregando texto bíblico do Supabase...)'}
                        </p>

                        <div className={styles.verseCardActions}>
                          <Link
                            to={`/bible/${item.book}/${item.chapter}#v${item.verse}`}
                            className={styles.btnOpenInBible}
                            title="Abrir no leitor da Bíblia"
                          >
                            <ExternalLink size={14} />
                            <span>Abrir na Bíblia</span>
                          </Link>

                          <button
                            type="button"
                            className={styles.btnRemoveVerse}
                            onClick={() => setVerseToRemove(item)}
                            title="Remover referência deste estudo"
                          >
                            <Trash2 size={13} />
                            <span>Remover</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ABA: Anotações do Estudo */}
            {activeTab === 'notes' && (
              <section className={styles.notesSection} aria-label="Anotações do Estudo">
                <div className={styles.notesCard}>
                  <div className={styles.notesCardHeader}>
                    <h2 className={styles.notesCardTitle}>
                      <PenTool size={18} color="#d4a85c" />
                      <span>Observações e Reflexões do Estudo</span>
                    </h2>
                    {notesSaveStatus && (
                      <span className={styles.notesStatusSuccess} role="status">
                        <Check size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {notesSaveStatus}
                      </span>
                    )}
                  </div>

                  <textarea
                    className={styles.notesTextarea}
                    placeholder="Escreva aqui suas observações, temas centrais, reflexões e conexões que você fez durante este estudo..."
                    value={studyNotes}
                    onChange={(e) => setStudyNotes(e.target.value)}
                    aria-label="Anotações do estudo"
                  />

                  <div className={styles.notesCardFooter}>
                    <span className={styles.notesStatus}>
                      {studyNotes.trim()
                        ? `${studyNotes.trim().length} caracteres`
                        : 'Nenhuma anotação registrada ainda.'}
                    </span>

                    <button
                      type="button"
                      className={styles.btnSaveNotes}
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                    >
                      <Save size={16} />
                      <span>{isSavingNotes ? 'Salvando...' : 'Salvar anotações'}</span>
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Modal: Editar Informações do Estudo */}
      {isEditModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !isSubmittingEdit && setIsEditModalOpen(false)}
          aria-hidden="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Editar estudo"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar estudo</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmittingEdit}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStudyInfo} className={styles.modalBody}>
              {editError && (
                <div role="alert" style={{ color: '#f87171', fontSize: '0.88rem' }}>
                  {editError}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="edit-title" className={styles.formLabel}>
                  Título *
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className={styles.formInput}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="edit-desc" className={styles.formLabel}>
                  Descrição
                </label>
                <textarea
                  id="edit-desc"
                  className={styles.formTextarea}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmittingEdit}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmittingEdit}
                >
                  {isSubmittingEdit ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Exclusão do Estudo */}
      {isDeleteModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !isDeletingStudy && setIsDeleteModalOpen(false)}
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
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingStudy}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: '#f5f3ef', margin: 0, lineHeight: 1.55 }}>
                Tem certeza que deseja excluir o estudo{' '}
                <strong>"{study?.title}"</strong>?
              </p>
              <p style={{ color: '#9a9891', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
                Esta ação removerá este estudo e a lista de referências vinculadas a
                ele. Nenhum texto bíblico, anotação pessoal ou favorito será
                afetado.
              </p>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeletingStudy}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.submitBtnDanger}
                  onClick={handleConfirmDeleteStudy}
                  disabled={isDeletingStudy}
                >
                  {isDeletingStudy ? 'Excluindo...' : 'Sim, excluir estudo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Versículo do Estudo */}
      {verseToRemove && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !isRemovingVerse && setVerseToRemove(null)}
          aria-hidden="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Confirmar remoção de versículo"
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Remover versículo do estudo</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setVerseToRemove(null)}
                disabled={isRemovingVerse}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: '#f5f3ef', margin: 0, lineHeight: 1.55 }}>
                Deseja remover a referência{' '}
                <strong>
                  {verseToRemove.bookName} {verseToRemove.chapter}:{verseToRemove.verse}
                </strong>{' '}
                deste estudo?
              </p>
              <p style={{ color: '#9a9891', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
                Isso removerá apenas a associação com este estudo. O versículo
                continua na Bíblia e quaisquer anotações pessoais ou favoritos
                serão mantidos.
              </p>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setVerseToRemove(null)}
                  disabled={isRemovingVerse}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.submitBtnDanger}
                  onClick={handleConfirmRemoveVerse}
                  disabled={isRemovingVerse}
                >
                  {isRemovingVerse ? 'Removendo...' : 'Remover do estudo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

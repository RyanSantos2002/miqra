import React, { useState, useEffect } from 'react';
import {
  X,
  PenTool,
  Bookmark,
  GitFork,
  Languages,
  MessageSquare,
  Check,
  Trash2,
  Edit3,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { getNoteForVerse, saveNote, deleteNote } from '../../../services/notes';
import type { Note } from '../../../types/notes';
import styles from './VerseExplorerDrawer.module.css';

interface VerseExplorerDrawerProps {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verseNumber: number;
  verseText: string;
  isOpen: boolean;
  onClose: () => void;
  onNoteChange?: (verseNumber: number, note: Note | null) => void;
}

type ExplorerTab = 'note' | 'favorite' | 'references' | 'words' | 'discussions';

export const VerseExplorerDrawer: React.FC<VerseExplorerDrawerProps> = ({
  bookSlug,
  bookName,
  chapter,
  verseNumber,
  verseText,
  isOpen,
  onClose,
  onNoteChange,
}) => {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('note');
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Carregar anotação existente ao abrir ou alternar versículo
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    getNoteForVerse(bookSlug, chapter, verseNumber)
      .then((existingNote) => {
        if (!isMounted) return;
        setNote(existingNote);
        setContent(existingNote?.content || '');
        setIsEditing(!existingNote);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[Miqra] Erro ao carregar nota do versículo:', err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookSlug, chapter, verseNumber]);

  // Fechar com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('Digite algum pensamento ou reflexão para salvar.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const saved = await saveNote(bookSlug, chapter, verseNumber, content, note?.id);
      setNote(saved);
      setIsEditing(false);
      setSuccessMessage('Anotação salva com sucesso!');
      if (onNoteChange) {
        onNoteChange(verseNumber, saved);
      }
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      console.error('[Miqra] Erro ao salvar nota:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Falha ao salvar sua anotação no Supabase.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!note) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await deleteNote(note.id);
      setNote(null);
      setContent('');
      setIsEditing(true);
      setIsConfirmingDelete(false);
      setSuccessMessage('Anotação excluída.');
      if (onNoteChange) {
        onNoteChange(verseNumber, null);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error('[Miqra] Erro ao excluir nota:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao excluir anotação.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {/* Painel Drawer Lateral */}
      <aside
        className={styles.drawer}
        role="dialog"
        aria-label={`Explorando ${bookName} ${chapter}:${verseNumber}`}
      >
        {/* Cabeçalho */}
        <header className={styles.drawerHeader}>
          <div className={styles.headerMeta}>
            <span className={styles.headerLabel}>Explorar Versículo</span>
            <h2 className={styles.headerReference}>
              {bookName} {chapter}:{verseNumber}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar painel de exploração"
          >
            <X size={18} />
          </button>
        </header>

        {/* Corpo do Drawer */}
        <div className={styles.drawerBody}>
          {/* Card com o Versículo Bíblico */}
          <div className={styles.verseCard}>
            <div className={styles.verseCardHeader}>
              <span className={styles.verseBadge}>
                Versículo {verseNumber}
              </span>
              <span className={styles.versionTag}>NVI</span>
            </div>
            <p className={styles.verseTextContent}>
              “{verseText}”
            </p>
          </div>

          {/* Abas de Navegação das Ações */}
          <nav className={styles.tabsNav} aria-label="Ações de estudo do versículo">
            <button
              type="button"
              className={`${styles.tabItem} ${activeTab === 'note' ? styles.tabItemActive : ''}`}
              onClick={() => setActiveTab('note')}
            >
              <PenTool size={14} />
              <span>Minha Anotação</span>
            </button>

            <button
              type="button"
              className={`${styles.tabItem} ${activeTab === 'favorite' ? styles.tabItemActive : ''}`}
              onClick={() => setActiveTab('favorite')}
            >
              <Bookmark size={14} />
              <span>Favoritar</span>
            </button>

            <button
              type="button"
              className={`${styles.tabItem} ${activeTab === 'references' ? styles.tabItemActive : ''}`}
              onClick={() => setActiveTab('references')}
            >
              <GitFork size={14} />
              <span>Referências</span>
            </button>

            <button
              type="button"
              className={`${styles.tabItem} ${activeTab === 'words' ? styles.tabItemActive : ''}`}
              onClick={() => setActiveTab('words')}
            >
              <Languages size={14} />
              <span>Palavras</span>
            </button>

            <button
              type="button"
              className={`${styles.tabItem} ${activeTab === 'discussions' ? styles.tabItemActive : ''}`}
              onClick={() => setActiveTab('discussions')}
            >
              <MessageSquare size={14} />
              <span>Discussões</span>
            </button>
          </nav>

          {/* Feedback de Sucesso */}
          {successMessage && (
            <div className={styles.successBanner} role="status">
              <Check size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Feedback de Erro */}
          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Aba Ativa: Minha Anotação */}
          {activeTab === 'note' && (
            <section className={styles.noteSection} aria-label="Anotação pessoal">
              <div className={styles.sectionTitleRow}>
                <h3 className={styles.sectionTitle}>
                  <PenTool size={16} color="#d4a85c" />
                  <span>Sua Reflexão Pessoal</span>
                </h3>
              </div>

              {isLoading ? (
                <p style={{ color: '#8c8372', fontSize: '13px' }}>Carregando anotações...</p>
              ) : note && !isEditing ? (
                /* Exibição da Nota Salva */
                <div className={styles.savedNoteCard}>
                  <p className={styles.savedNoteContent}>{note.content}</p>

                  <div className={styles.savedNoteFooter}>
                    <span className={styles.noteTimestamp}>
                      <Clock size={12} />
                      <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                    </span>

                    <div className={styles.savedNoteActions}>
                      <button
                        type="button"
                        className={styles.btnEdit}
                        onClick={() => setIsEditing(true)}
                        aria-label="Editar anotação"
                      >
                        <Edit3 size={13} />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        className={styles.btnDelete}
                        onClick={() => setIsConfirmingDelete(true)}
                        aria-label="Excluir anotação"
                      >
                        <Trash2 size={13} />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>

                  {/* Confirmação de Exclusão */}
                  {isConfirmingDelete && (
                    <div className={styles.deleteConfirmBox}>
                      <p className={styles.deleteConfirmText}>
                        Deseja realmente excluir esta anotação permanentemente?
                      </p>
                      <div className={styles.deleteConfirmActions}>
                        <button
                          type="button"
                          className={styles.btnCancelDelete}
                          onClick={() => setIsConfirmingDelete(false)}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className={styles.btnConfirmDelete}
                          onClick={handleDeleteNote}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Excluindo...' : 'Sim, excluir'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Formulário para Escrever / Editar Anotação */
                <form onSubmit={handleSaveNote} className={styles.textareaWrapper}>
                  <p className={styles.sectionPrompt}>
                    O que esse versículo significa para você? Registre suas revelações, conexões e insights.
                  </p>

                  <textarea
                    className={styles.noteTextarea}
                    placeholder="Escreva aqui sua reflexão sobre esta passagem das Escrituras..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    autoFocus
                  />

                  <div className={styles.editorActionsRow}>
                    {note && (
                      <button
                        type="button"
                        className={styles.btnCancel}
                        onClick={() => {
                          setContent(note.content);
                          setIsEditing(false);
                          setErrorMessage(null);
                        }}
                      >
                        Cancelar
                      </button>
                    )}

                    <button
                      type="submit"
                      className={styles.btnSave}
                      disabled={isSaving || !content.trim()}
                    >
                      {isSaving ? (
                        <>
                          <span className={styles.spinner} aria-hidden="true" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Check size={15} />
                          <span>Salvar anotação</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {/* Abas Futuras Preparadas (Sem dados fictícios) */}
          {activeTab === 'favorite' && (
            <div className={styles.placeholderCard}>
              <Bookmark size={28} className={styles.placeholderIcon} />
              <h4 className={styles.placeholderTitle}>Versículos Favoritos</h4>
              <p className={styles.placeholderText}>
                Em breve você poderá salvar este versículo na sua coleção de passagens favoritas e organizá-lo por temas e momentos de reflexão.
              </p>
            </div>
          )}

          {activeTab === 'references' && (
            <div className={styles.placeholderCard}>
              <GitFork size={28} className={styles.placeholderIcon} />
              <h4 className={styles.placeholderTitle}>Referências Cruzadas</h4>
              <p className={styles.placeholderText}>
                Esta área está sendo preparada para exibir conexões entre o Antigo e o Novo Testamento que dialogam diretamente com este versículo.
              </p>
            </div>
          )}

          {activeTab === 'words' && (
            <div className={styles.placeholderCard}>
              <Languages size={28} className={styles.placeholderIcon} />
              <h4 className={styles.placeholderTitle}>Palavras Originais</h4>
              <p className={styles.placeholderText}>
                Em breve será possível analisar cada termo deste versículo no texto original (hebraico, aramaico ou grego), suas raízes e significados contextuais.
              </p>
            </div>
          )}

          {activeTab === 'discussions' && (
            <div className={styles.placeholderCard}>
              <MessageSquare size={28} className={styles.placeholderIcon} />
              <h4 className={styles.placeholderTitle}>Discussões e Diálogos</h4>
              <p className={styles.placeholderText}>
                Espaço em construção para troca de entendimentos e conversas com outros estudiosos da Bíblia da comunidade Miqra.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

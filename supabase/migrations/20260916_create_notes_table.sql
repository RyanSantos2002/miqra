-- ==============================================================================
-- MIQRA: TABELA DE ANOTAÇÕES PESSOAIS (NOTES)
-- ==============================================================================
-- Execute este script no SQL Editor do seu painel Supabase
-- (https://supabase.com/dashboard/project/_/sql)
--
-- Características:
-- 1. Vinculada diretamente ao Supabase Auth (auth.uid())
-- 2. Cada usuário possui no máximo uma anotação por versículo (unique constraint)
-- 3. Row Level Security (RLS) habilitado com isolamento total entre usuários
-- ==============================================================================

-- 1. Criação da Tabela
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  book text not null,
  chapter integer not null,
  verse integer not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint notes_user_verse_unique unique (user_id, book, chapter, verse)
);

-- 2. Habilitação de Row Level Security (RLS)
alter table public.notes enable row level security;

-- 3. Políticas de Segurança (RLS)

-- SELECT: Usuários só podem ler suas próprias notas
create policy "Users can view their own notes"
  on public.notes
  for select
  using (auth.uid() = user_id);

-- INSERT: Usuários só podem inserir notas vinculadas ao seu próprio uid
create policy "Users can insert their own notes"
  on public.notes
  for insert
  with check (auth.uid() = user_id);

-- UPDATE: Usuários só podem atualizar suas próprias notas
create policy "Users can update their own notes"
  on public.notes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: Usuários só podem excluir suas próprias notas
create policy "Users can delete their own notes"
  on public.notes
  for delete
  using (auth.uid() = user_id);

-- 4. Índices para performance de consulta
create index if not exists idx_notes_user_book_chapter
  on public.notes (user_id, book, chapter);

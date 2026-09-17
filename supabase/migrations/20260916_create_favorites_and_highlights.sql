-- ==============================================================================
-- MIQRA: FAVORITOS E MARCAÇÕES DE VERSÍCULOS (FAVORITES & HIGHLIGHTS)
-- ==============================================================================
-- Execute este script no SQL Editor do Supabase
-- (https://supabase.com/dashboard/project/_/sql)
--
-- Características:
-- 1. Vinculadas diretamente ao Supabase Auth (auth.uid())
-- 2. Restrição única por (user_id, book, chapter, verse)
-- 3. Row Level Security (RLS) habilitado com isolamento total por usuário
-- ==============================================================================

-- 1. TABELA DE FAVORITOS
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  book text not null,
  chapter integer not null,
  verse integer not null,
  verse_text text,
  created_at timestamptz default now() not null,
  constraint favorites_user_verse_unique unique (user_id, book, chapter, verse)
);

-- RLS para favorites
alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites
  for delete
  using (auth.uid() = user_id);

create index if not exists idx_favorites_user_book_chapter
  on public.favorites (user_id, book, chapter);


-- 2. TABELA DE MARCAÇÕES / DESTAQUES (VERSE HIGHLIGHTS)
create table if not exists public.verse_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  book text not null,
  chapter integer not null,
  verse integer not null,
  color text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint highlights_user_verse_unique unique (user_id, book, chapter, verse)
);

-- RLS para verse_highlights
alter table public.verse_highlights enable row level security;

create policy "Users can view their own highlights"
  on public.verse_highlights
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own highlights"
  on public.verse_highlights
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own highlights"
  on public.verse_highlights
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own highlights"
  on public.verse_highlights
  for delete
  using (auth.uid() = user_id);

create index if not exists idx_highlights_user_book_chapter
  on public.verse_highlights (user_id, book, chapter);

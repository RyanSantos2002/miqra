-- ==============================================================================
-- MIQRA: TABELAS DE ESTUDOS BÍBLICOS (MEUS ESTUDOS)
-- ==============================================================================
-- Execute este script no SQL Editor do seu painel Supabase
-- (https://supabase.com/dashboard/project/_/sql)
--
-- Estruturas:
-- 1. `studies`: Guarda os estudos bíblicos do usuário, título, descrição e anotações
-- 2. `study_verses`: Guarda as referências bíblicas (livro, capítulo, versículo)
--    vinculadas a cada estudo. O texto bíblico NÃO é duplicado, mantendo a integridade.
--
-- Segurança:
-- - Row Level Security (RLS) habilitado em ambas as tabelas
-- - Isolamento completo por `auth.uid()`
-- - Inserções e leituras de referências validadas contra o proprietário do estudo
-- ==============================================================================

-- 1. TABELA DE ESTUDOS
create table if not exists public.studies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  title text not null,
  description text default '',
  notes text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Habilitar RLS em studies
alter table public.studies enable row level security;

-- Políticas de RLS para studies
drop policy if exists "Users can view their own studies" on public.studies;
create policy "Users can view their own studies"
  on public.studies
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own studies" on public.studies;
create policy "Users can insert their own studies"
  on public.studies
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own studies" on public.studies;
create policy "Users can update their own studies"
  on public.studies
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own studies" on public.studies;
create policy "Users can delete their own studies"
  on public.studies
  for delete
  using (auth.uid() = user_id);

-- Índices de performance para studies
create index if not exists idx_studies_user_id on public.studies (user_id);
create index if not exists idx_studies_updated_at on public.studies (updated_at desc);

-- 2. TABELA DE VERSÍCULOS DO ESTUDO (REFERÊNCIAS BÍBLICAS)
create table if not exists public.study_verses (
  id uuid primary key default gen_random_uuid(),
  study_id uuid references public.studies(id) on delete cascade not null,
  book text not null,
  chapter integer not null,
  verse integer not null,
  created_at timestamptz default now() not null,
  constraint study_verses_unique unique (study_id, book, chapter, verse)
);

-- Habilitar RLS em study_verses
alter table public.study_verses enable row level security;

-- Políticas de RLS para study_verses (baseadas no proprietário do estudo pai)
drop policy if exists "Users can view verses from their own studies" on public.study_verses;
create policy "Users can view verses from their own studies"
  on public.study_verses
  for select
  using (
    exists (
      select 1 from public.studies s
      where s.id = study_verses.study_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert verses into their own studies" on public.study_verses;
create policy "Users can insert verses into their own studies"
  on public.study_verses
  for insert
  with check (
    exists (
      select 1 from public.studies s
      where s.id = study_verses.study_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update verses in their own studies" on public.study_verses;
create policy "Users can update verses in their own studies"
  on public.study_verses
  for update
  using (
    exists (
      select 1 from public.studies s
      where s.id = study_verses.study_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studies s
      where s.id = study_verses.study_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete verses from their own studies" on public.study_verses;
create policy "Users can delete verses from their own studies"
  on public.study_verses
  for delete
  using (
    exists (
      select 1 from public.studies s
      where s.id = study_verses.study_id and s.user_id = auth.uid()
    )
  );

-- Índices de performance para study_verses
create index if not exists idx_study_verses_study_id on public.study_verses (study_id);
create index if not exists idx_study_verses_ref on public.study_verses (book, chapter, verse);

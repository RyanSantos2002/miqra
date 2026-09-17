# Miqra - Plataforma de Estudo Bíblico Colaborativo

> **"Leia. Explore. Compreenda."**

O Miqra é uma plataforma moderna de estudo bíblico projetada com foco em experiência visual cinematográfica, estética clássica de manuscritos antigos e ferramentas avançadas de leitura, análise e anotações bíblicas.

---

## 🏛️ Funcionalidades

- **Autenticação Segura com Supabase Auth:** Login, cadastro, logout, recuperação de senha e persistência de sessão.
- **Leitor Bíblico Integrado:** Conectado à base de dados com 1.189 capítulos e versículos estruturados da Bíblia.
- **Navegação Intuitiva:** Índice bíblico com filtros por testamento, livros e capítulos.
- **Design System Temático:** Interface sóbria e imersiva inspirada em bibliotecas antigas, pergaminhos e tons de ouro envelhecido.

---

## 🛠️ Tecnologias

- **React 19** com **TypeScript**
- **Vite**
- **Supabase** (Auth & Database)
- **Lucide React** (Ícones)
- **CSS Modules**

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/RyanSantos2002/miqra.git
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

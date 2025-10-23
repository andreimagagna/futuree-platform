# Deploy na Vercel (Vite + React)

Este projeto é um SPA (client-side routing). Para funcionar em qualquer rota no deploy, incluímos `vercel.json` com um rewrite para `index.html`.

## Requisitos de Ambiente (Vercel)
Crie as variáveis no projeto da Vercel (Project Settings → Environment Variables):

- `VITE_SUPABASE_URL` → URL do seu projeto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` → Chave pública (anon) do Supabase

Configure-as nos três ambientes se for usar todos:
- Development
- Preview (para PRs e branches)
- Production (para a branch `prod` ou `main`, conforme sua configuração)

## Build & Output
- Build Command: `npm run build`
- Install Command: `npm install` (ou use PNPM/Bun se preferir, mas o padrão funciona)
- Output Directory: `dist`

## Passo a Passo
1. Faça login em https://vercel.com sem conflito de contas.
2. Import Project → selecione o repositório (origin ou platform).
3. Framework: Vite (auto-detecta)
4. Configure as Environment Variables acima.
5. Avance e `Deploy`.

## Branches Sugeridas
- `dev` → deploy com ambiente Development/Preview
- `prod` → deploy com ambiente Production

Na Vercel, defina as regras:
- Production Branch: `prod` (ou `main` se preferir)
- Preview Deployments: habilitados para outras branches (ex.: `dev`, feature branches)

## Dicas
- Se rotas do React retornarem 404 no deploy, verifique se o `vercel.json` está incluído.
- Para alternar contas/credenciais do GitHub, use `git config --global credential.helper manager` e `credential.useHttpPath true` e certifique de entrar na conta correta.

---
Gerado automaticamente para facilitar seu deploy.

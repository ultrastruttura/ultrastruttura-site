# UltraStruttura - Sito Web Artista

Sito Next.js statico (deploy su GitHub Pages) con contenuti gestibili via Decap CMS.

## Stack

- Next.js 15 (App Router)
- TypeScript
- CSS Modules
- Decap CMS (`/admin`)

## Dove si modificano i contenuti

Tutti i contenuti principali sono in `data/site-content.json`:

- titolo e dati brand/artista
- SEO title e description
- lista opere (ordine, titolo, anno, medium, dimensioni, disponibilita, immagine)

Le immagini opere vanno in `public/artworks`.

## Setup locale

1. Installa dipendenze:

```bash
npm ci
```

2. Avvia il sito:

```bash
npm run dev
```

3. Apri:

- Sito: `http://localhost:3000`
- CMS: `http://localhost:3000/admin`

## Configurazione Decap CMS (GitHub Pages)

Il CMS e gia integrato in:

- `public/admin/index.html`
- `public/admin/config.yml`

Prima di usarlo in produzione, aggiorna `public/admin/config.yml`:

- `backend.repo`: `OWNER/REPO` reale GitHub
- `backend.branch`: branch di deploy (qui `master`)

### Nota importante su autenticazione

Con deploy su GitHub Pages, il backend `github` di Decap richiede un provider OAuth (un piccolo servizio auth esterno) per il login e il commit dal browser.

In pratica:

1. crei una GitHub OAuth App
2. configuri un OAuth provider per Decap
3. colleghi `config.yml` al provider (`base_url` e `auth_endpoint`, se necessario)

Senza questo passaggio, `/admin` si apre ma non potra autenticarsi per salvare su GitHub.

Guida pronta per questo progetto: `DECAP_OAUTH_SETUP.md`.

## Deploy

Deploy automatico con GitHub Actions in `.github/workflows/deploy.yml`.

Secrets usati:

- `NEXT_PUBLIC_FORMSPREE_ID`
- `GOOGLE_SEARCH_CONSOLE_VERIFICATION`
- `UMAMI_WEBSITE_ID` (Website ID da Umami Cloud o self-hosted)
- `UMAMI_SCRIPT_URL` (opzionale; default `https://cloud.umami.is/script.js`)

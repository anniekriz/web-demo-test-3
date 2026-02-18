# Neo World Weby Template (Next.js + Payload)

Production-oriented editable website template with strict in-place editing controls.

## Tech stack
- Next.js 15 App Router + TypeScript
- Payload CMS (same app)
- PostgreSQL (Docker Compose)
- CSS Modules + global CSS (no inline styles)

## Setup
1. Start PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure env:
   ```bash
   cp .env.example .env
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Seed starter content/users:
   ```bash
   npm run seed
   ```

## Login flows
- `/admin`: simple client-facing login page for owner/admin. After login, edit controls appear on site preview.
- `/cms`: Payload admin UI (admin role only).

## Routing
- `/` renders Payload page with slug `home`.
- `/home` permanently redirects to `/`.
- `/{slug}` renders other Payload page slugs automatically (e.g. `/contact`).

## Seed output
Default seed credentials (change immediately in non-local environments):
- Admin: `admin@example.com` / `ChangeMe123!`
- Owner: `owner@example.com` / `ChangeMe123!`

Use env vars to override:
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
- `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD`

## Notes
- Single source of truth for Postgres is root `docker-compose.yml`.
- Image previews in edit mode are local object URLs until Save uploads to `/api/media`.
- Save remains in edit mode and refreshes the `original` snapshot.

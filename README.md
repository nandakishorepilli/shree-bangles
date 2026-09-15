# Shree Bangles — Handmade Indian Bangle Boutique

A private online storefront and admin dashboard for a handmade Indian bangle
business, built with Next.js (App Router), TypeScript, Prisma, and SQLite.

For a full architectural overview, database schema, current status, and
what's left to build, see **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** —
that file is the source of truth for anyone (human or AI agent) continuing
this project.

## Prerequisites

- Node.js 18.18 or newer
- npm

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# then edit .env — at minimum set SESSION_SECRET to a long random string:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Create the database and apply the schema
npm run db:push

# 4. Seed an admin account and placeholder products
npm run db:seed

# 5. Run the dev server
npm run dev
```

The storefront runs at `http://localhost:3000`.
The admin dashboard is at `http://localhost:3000/admin` (there is
intentionally no link to it in the public navigation) — sign in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

## Railway deployment with SQLite

Mount a Railway Volume at `/app/data` and set the Railway `DATABASE_URL`
variable to `file:/app/data/shree-bangles.db`, plus `UPLOADS_DIR` to
`/app/data/uploads`. Product images are stored in that persistent directory
and served through stable `/api/uploads/:filename` URLs. This value stays
environment-specific: local development continues to use the `DATABASE_URL`
in `.env`; production deliberately refuses to use the app filesystem for
uploads.

For a new, empty volume, run `npm run db:push` and then `npm run db:seed` once
as deliberate initialization steps. The normal build and application start do
not seed or overwrite the database.

## Useful scripts

| Command             | What it does                                      |
|----------------------|----------------------------------------------------|
| `npm run dev`        | Start the dev server                               |
| `npm run build`      | Production build                                   |
| `npm run start`      | Run the production build                           |
| `npm run db:push`    | Sync `prisma/schema.prisma` to the SQLite database  |
| `npm run db:seed`    | Seed admin user and placeholder products            |
| `npm run db:studio`  | Open Prisma Studio to browse/edit data visually     |

## Verifying it works

1. Visit `/` — you should see the homepage with placeholder products pulled
   from the seeded database (not hardcoded).
2. Set `NEXT_PUBLIC_SHREE_BANGLES_WHATSAPP_NUMBER` in `.env` to the business
   number in international format, then restart the app.
3. Visit `/admin/login`, sign in, and go to **Products → Add Product**. A
   product needs no category or publishing status and appears in `/shop`
   immediately after saving.
4. Open a product, select any variant and quantity, then use **Order on
   WhatsApp**. Payment and confirmation happen manually in WhatsApp; there is
   no website payment gateway.

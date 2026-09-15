# PROJECT_CONTEXT.md

This file is the single source of truth for anyone — human or AI coding
agent — continuing this project. Read this before making changes.

**Customer-facing brand:** Shree Bangles. The repository/package name remains
`bangle-boutique` for technical continuity only.

---

## 1. What this project is

A private online boutique for a **handmade Indian bangle business**, plus a
private admin dashboard so the business owner can manage the product
catalogue without touching code. Customer-facing brand direction: feminine,
elegant, premium, Indian/traditional, handmade, modern, Instagram-friendly.
Palette: blush/rose pink, cream/off-white, subtle gold accents.

Two custom interaction patterns replace generic ecommerce UI, per the
project brief:
- **Add to Cart** → a circular, bangle-inspired button (two overlapping
  bangle rings that spin briefly, then show a "clasped" checkmark) instead
  of a generic cart button. See `src/components/cart/BangleAddToCartButton.tsx`.
- **Cart icon** → an illustrated Indian fabric/jewellery pouch (not a
  shopping trolley), with a small bangle-charm detail, that wiggles on add.
  See `src/components/cart/FabricBagIcon.tsx`.

This was built from scratch — there was no pre-existing codebase for this
project when work began.

---

## 2. Current technology stack

- **Framework**: Next.js 14, App Router, TypeScript, React 18
- **Styling**: Tailwind CSS (custom `blush` / `cream` / `gold` palette in `tailwind.config.ts`)
- **Database**: SQLite via Prisma ORM (`prisma/schema.prisma`) — chosen for
  zero-setup local development. Swapping to Postgres/MySQL later only
  requires changing the `datasource` provider + `DATABASE_URL`; the schema
  itself uses no SQLite-only features.
- **Auth**: custom, lightweight — bcrypt-hashed password + HMAC-signed
  httpOnly session cookie (`src/lib/session.ts`). No third-party auth
  library. Deliberately simple because there is exactly one admin account
  type and no customer accounts (yet).
- **Validation**: Zod (`src/lib/validations.ts`)
- **Image storage**: local disk, `public/uploads/`, served statically by
  Next.js. `src/app/api/upload/route.ts` handles multipart upload.

---

## 3. Project architecture

Layering, top to bottom:

```
Pages/Components (src/app, src/components)
        ↓ calls
API Routes (src/app/api/**/route.ts)   [admin-only routes guarded by requireAdmin()]
        ↓ calls
Service Layer (src/services/*.ts)      [all business logic + Prisma queries live here]
        ↓ calls
Prisma Client (src/lib/prisma.ts)
        ↓
SQLite database (prisma/dev.db)
```

**Rule for future changes**: API routes and Server Components should never
call `prisma.*` directly — always go through `src/services/*`. This keeps
rules like "customers only ever see PUBLISHED products" enforced in exactly
one place (`productService.getProducts` / `getProductBySlug`).

---

## 4. Folder structure

```
prisma/
  schema.prisma         Database schema (see section 5)
  seed.ts                Seeds an admin user, categories, placeholder products

src/
  app/
    layout.tsx            Root layout (fonts, CartProvider, Header/Footer)
    page.tsx               Homepage (Hero, New Arrivals, Best Sellers, etc.)
    globals.css
    shop/
      page.tsx              Shop listing, filterable by ?category=&filter=&search=
      [category]/page.tsx    Dedicated category/collection page
    product/[slug]/page.tsx  Product detail page (public, PUBLISHED only)
    cart/page.tsx            Cart page (reads CartContext / localStorage)
    checkout/page.tsx        Checkout form → POSTs to /api/orders
    about/page.tsx
    contact/page.tsx         UI only — not yet wired to a backend (see section 9)
    admin/
      login/page.tsx         Public login form (OUTSIDE the auth-guarded route group)
      (dashboard)/            Route group — layout.tsx here checks the session
        layout.tsx             and redirects to /admin/login if not authenticated
        page.tsx                Admin dashboard home (stats)
        products/page.tsx       Product table (all statuses, inline stock edit, delete)
        products/new/page.tsx
        products/[id]/edit/page.tsx
        categories/page.tsx
        orders/page.tsx
    api/
      products/route.ts        GET (public, filtered), POST (admin, create)
      products/[id]/route.ts   GET/PATCH/DELETE (all admin-only)
      categories/route.ts      GET (public), POST (admin)
      admin/login/route.ts     Sets session cookie
      admin/logout/route.ts    Clears session cookie
      orders/route.ts          GET (admin), POST (public, checkout)
      upload/route.ts          POST (admin), saves to public/uploads

  components/
    layout/            Header (nav + fabric bag icon), Footer
    home/              Hero, ProductSection, HandmadeSection, CustomizedBangles, InstagramGallery
    product/           ProductCard, ProductGrid, ProductDetailActions (variant picker)
    cart/              BangleAddToCartButton, FabricBagIcon
    ui/                MandalaDivider (shared decorative motif)
    admin/             AdminSidebar, ProductForm, ProductsTable, CategoryManager

  services/            productService.ts, categoryService.ts, orderService.ts, authService.ts
  lib/                 prisma.ts, session.ts, apiAuth.ts, validations.ts, utils.ts
  context/             CartContext.tsx (client-side cart, persisted to localStorage)
  types/               index.ts — shared TypeScript types (ProductWithRelations, ProductInput, CartLine)

public/
  placeholders/        Placeholder SVG art (bangles, hero, Instagram tiles) — replace with real photos
  uploads/              Destination for admin-uploaded product images (gitignored except .gitkeep)
```

---

## 5. Database schema

See `prisma/schema.prisma` for the authoritative definitions. Summary:

- **Admin** — id, email, passwordHash, name. One or more admin accounts can exist.
- **Category** — id, name, slug, description. Products belong to one category.
- **Product** — name, slug, description, price, salePrice (nullable), stock,
  status (`DRAFT` | `PUBLISHED` | `HIDDEN`), isFeatured, isNewArrival,
  isBestseller, categoryId. Has many `ProductImage` and `ProductVariant`.
- **ProductImage** — url, altText, position (for ordering in the gallery).
- **ProductVariant** — optional color/size combination with its own stock.
  If a product has zero variants, `Product.stock` is the sellable quantity.
  If it has variants, each variant's own `stock` is used instead.
- **Order** / **OrderItem** — customer shipping details + a snapshot of each
  purchased line (name/price at time of purchase, so later edits or
  deletions of a product don't corrupt historical orders).

Only `status = PUBLISHED` products are ever returned by public-facing
service functions (`getProducts`, `getProductBySlug`). Draft and Hidden
products are visible only through the admin-facing functions
(`getAllProductsForAdmin`, `getProductById`).

---

## 6. Authentication approach

- Admin credentials live in the `Admin` table (`passwordHash` via bcryptjs).
- `POST /api/admin/login` verifies credentials (`authService.verifyAdminCredentials`)
  and, on success, sets an `admin_session` httpOnly cookie containing an
  HMAC-signed payload (`src/lib/session.ts`), valid for 8 hours.
- `src/lib/apiAuth.ts` (`requireAdmin`) is called at the top of every
  admin-only API route handler.
- `src/app/admin/(dashboard)/layout.tsx` performs the equivalent check for
  admin **pages** (Server Component, reads the cookie via `next/headers`,
  redirects to `/admin/login` if invalid/missing).
- `/admin/login` deliberately lives **outside** the `(dashboard)` route
  group so it isn't itself protected by that layout (avoids a redirect
  loop).
- There is no "Admin" link anywhere in the public navigation
  (`src/components/layout/Header.tsx`), per the brief — reach it by typing
  `/admin` directly.

---

## 7. Admin functionality (implemented)

- Add / Edit / Delete product (`ProductForm.tsx`, used by both the "new"
  and "edit" pages)
- Upload product images (`/api/upload`, local disk storage)
- Change price / sale price / stock (via the same form; stock also has a
  quick inline editor directly in the products table)
- Manage categories (create; list)
- Publish / Draft / Hidden status per product
- Featured / New Arrival / Bestseller flags per product
- View orders, with line-item detail and totals

Product fields implemented match the brief: name, description, price, sale
price, category, images, colors/sizes (via `ProductVariant`), stock,
status, featured, new arrival, bestseller.

---

## 8. Product system — how "no code changes needed" actually works

1. Admin fills out the product form at `/admin/products/new` and sets
   Status = Published.
2. The form POSTs to `POST /api/products`, which calls
   `productService.createProduct()`, writing a new row (plus related
   images/variants) to the database.
3. Every customer-facing page (`/`, `/shop`, `/shop/[category]`,
   `/product/[slug]`, and the `/api/products` GET endpoint used for search)
   queries the database live via `productService.getProducts` /
   `getProductBySlug` — there is no hardcoded product list anywhere in the
   frontend.
4. Because these are Next.js Server Components, the new product appears on
   next page load/navigation with zero frontend code changes.

This flow has been seeded and is structurally complete, but see section 11
for what has **not** been runtime-verified yet (no `npm install` was
possible in the environment this was built in — see below).

---

## 9. API / service structure

See section 3 for the layering rule. Quick reference of endpoints:

| Method | Path                     | Auth   | Purpose                              |
|--------|--------------------------|--------|---------------------------------------|
| GET    | /api/products            | Public | List published products, filterable   |
| POST   | /api/products            | Admin  | Create product                        |
| GET    | /api/products/:id        | Admin  | Fetch one product (any status)        |
| PATCH  | /api/products/:id        | Admin  | Full update, or `{ stock }` quick-edit|
| DELETE | /api/products/:id        | Admin  | Delete product                        |
| GET    | /api/categories          | Public | List categories                       |
| POST   | /api/categories          | Admin  | Create category                       |
| POST   | /api/admin/login         | Public | Verify credentials, set session cookie|
| POST   | /api/admin/logout        | Admin  | Clear session cookie                  |
| GET    | /api/orders              | Admin  | List orders                           |
| POST   | /api/orders              | Public | Place an order (checkout)             |
| POST   | /api/upload              | Admin  | Upload a product image                |

---

## 10. How to run the project

See `README.md` for full step-by-step setup. Short version:

```bash
npm install
cp .env.example .env   # then set SESSION_SECRET
npm run db:push
npm run db:seed
npm run dev
```

### Environment variables (`.env`)

| Variable         | Purpose                                                   |
|-------------------|------------------------------------------------------------|
| `DATABASE_URL`    | Prisma/SQLite connection string, default `file:./dev.db`   |
| `SESSION_SECRET`  | HMAC signing key for admin session cookies — must be set   |
| `ADMIN_EMAIL`     | Used only by `prisma/seed.ts` to create the first admin     |
| `ADMIN_PASSWORD`  | Used only by `prisma/seed.ts` to create the first admin     |

---

## 11. Current implementation status

**Verified September 14, 2026:**
- Fixed Prisma P1012 for SQLite. Prisma schema enums are unsupported by the
  SQLite connector, so `Product.status` and `Order.status` now persist as
  String columns with the same defaults. `src/lib/status.ts` provides the
  typed values for all product and order statuses.
- `npx.cmd prisma generate`, `npx.cmd tsc --noEmit`, Prisma Client connection,
  homepage, and product API have been verified successfully. The project was
  available on port 3001 because port 3000 was already occupied externally.
- `prisma/dev.db` was empty before `prisma db push`; schema initialization did
  not reset or delete any database content.
- `npm.cmd run db:seed` is currently blocked before application code runs by
  a Windows Node/tsx `uv_os_get_passwd` ENOMEM error. The empty database is
  therefore intentionally unseeded until that environment issue is resolved.

**Implemented and structurally complete:**
- Full database schema and service layer
- All public pages: Home, Shop (with filters), Category, Product Detail, Cart, Checkout, About, Contact
- Admin dashboard: login, product CRUD with image upload and variants, category management, order viewing, inline stock editing
- Custom bangle Add-to-Cart button and fabric-bag cart icon with animations
- Session-based admin auth guarding both pages and API routes
- Seed data covering the exact example from the brief (Pink Pearl Bangles, ₹499, Traditional, stock 10, Published)

**NOT yet done / explicitly out of scope so far:**
- Payment gateway integration — checkout currently creates a `PENDING`
  order with no payment step. This is called out in the checkout page UI.
- The Contact page form does not submit anywhere yet (see the `NOTE` comment
  in `src/app/contact/page.tsx`) — needs a `/api/contact` route (email or
  DB storage) as a follow-up.
- Real product photography — all imagery in `public/placeholders/` is
  generated placeholder SVG art, described in-file (e.g. "Hero Photo
  Placeholder"). Replace by uploading real images through the admin
  dashboard (for products) or swapping the files directly (for
  Hero/About/Instagram sections).
- Multiple admin accounts / roles — currently a single flat `Admin` table
  with no role distinction (not required by the brief, but worth noting).
- Category edit/delete UI (create + list only; deleting is possible via
  `categoryService.deleteCategory` but has no admin UI button yet).
- Order status updates from the admin UI (orders can be viewed but not
  transitioned between PENDING/CONFIRMED/SHIPPED/etc. from the dashboard yet).

## 12. Known issues / important caveat for whoever continues this

**This project was built in a sandboxed environment with no internet
access**, so `npm install` could not be run, and the app could not actually
be booted (`npm run dev`) or built (`npm run build`) to verify it compiles
end-to-end. The code was written carefully and follows correct Next.js 14 /
Prisma / TypeScript patterns throughout, but **the very first thing to do
when picking this project up is**:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

...and then fix whatever surfaces (likely candidates: minor TypeScript
type mismatches, a missed import, or a Next.js App Router config detail —
nothing architectural). Please update this section once verified, and
remove this caveat.

---

## 13. Important design decisions (why things are built this way)

- **SQLite over Postgres for now**: zero external setup, and the schema is
  portable — swap the Prisma `datasource` block when ready for production.
- **Custom auth instead of NextAuth**: only one account type, one login
  flow. A signed cookie is easier for another agent to trace end-to-end in
  two small files (`lib/session.ts`, `lib/apiAuth.ts`) than configuring a
  full auth library. If customer accounts are added later, reconsider
  NextAuth or a similar library at that point.
- **Wholesale replace of images/variants on product update**: `updateProduct`
  deletes and recreates a product's images/variants rather than diffing
  them, because the admin form always submits the full current state. This
  keeps the update logic simple; if partial updates become necessary later,
  this would need to change to a diff-based approach.
- **Route group for admin auth (`(dashboard)`)**: keeps `/admin/login`
  outside the authenticated layout without needing pathname-sniffing logic
  inside a single shared layout.
- **Cart in localStorage, not the database**: there are no customer
  accounts, so there's nothing to persist server-side. If accounts are
  added later, consider migrating cart state to the database, keyed by
  user.
- **Order line items snapshot product name/price**: so that later edits or
  deletion of a product never corrupt historical order records.

---

## 14. How to add/change features (quick recipes)

**Add a new product field** (e.g. "material"):
1. Add the column to `Product` in `prisma/schema.prisma`, run `npm run db:push`.
2. Add it to `ProductInput` in `src/types/index.ts`.
3. Add it to `productInputSchema` in `src/lib/validations.ts`.
4. Add the form field in `src/components/admin/ProductForm.tsx`.
5. Include it in the `data` object in `createProduct`/`updateProduct`
   (`src/services/productService.ts`).
6. Display it wherever relevant (`ProductCard.tsx`, product detail page).

**Add a new public page**: create a folder under `src/app/`, fetch data via
the existing service layer (or add a new service function) — never query
Prisma directly from the page.

**Add a new admin-only API action**: add a route under `src/app/api/`,
call `requireAdmin(request)` first, then delegate to a service function.

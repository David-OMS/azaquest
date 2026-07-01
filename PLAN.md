# AZAQUEST — Product & Technical Plan

> Living document for the AZAQUEST storefront side project.  
> Last updated: July 2026

---

## Overview

AZAQUEST is a Lagos-based thrift fashion brand (@azaquest / @azaquest_premium on Instagram). They sell shirts, jackets, hoodies, quarter zips, long sleeves, jeans, rings, and more via weekly drops that sell out quickly. Orders are handled through Instagram DMs and WhatsApp — not through a checkout flow (v1).

This project is a **live inventory catalog** so customers (and the admin) always know what is available vs. sold — without scrolling through outdated IG captions.

### Core jobs

| Job | Who | Outcome |
|-----|-----|---------|
| Browse what exists | Customer | No more scrolling sold IG posts |
| Mark items sold fast | Admin | Site updates in seconds |
| Checkout elsewhere | Customer | WhatsApp / IG DM (v1) |

This is **not** a full ecommerce platform yet. It is a **catalog + availability engine** with optional cart/favourites as a wishlist to message about.

---

## Locked decisions

| Decision | Choice |
|----------|--------|
| **Stack** | Next.js 15 (App Router) + Supabase + Cloudflare R2 |
| **Hero layout** | Split editorial — video left (~40%), punchline + CTA right (~60%) |
| **Hero punchline** | `FIND IT BEFORE IT'S GONE.` — glitch animation, **no subline** |
| **CTA** | "Begin quest" → `/shop` |
| **Sold UX** | Hidden from main shop; separate `/sold` archive page |
| **Checkout (v1)** | WhatsApp / IG links only — no online payment |
| **Image storage** | Cloudflare R2 (not Supabase Storage) |
| **Theme** | Black & white, minimal, premium (Nike-adjacent) |
| **Logo (v1)** | Combined lockup image (icon + wordmark) — dark mode first |

---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│  Vercel (hosting)                                       │
│  Next.js 15 — storefront + admin + API routes           │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│  Supabase            │   │  Cloudflare R2               │
│  • Postgres DB       │   │  • Product images (WebP)       │
│  • Auth (admin only) │   │  • Hero video                  │
│  • Realtime (opt.)   │   │  • 10 GB free, zero egress     │
└──────────────────────┘   └──────────────────────────────┘
```

### Why this split

- **Supabase** handles structured data: products, categories, filters, sold state, admin auth. The 500 MB database free tier is more than enough — product rows are tiny.
- **Cloudflare R2** handles binary assets. 10 GB free storage, zero egress fees. Supabase free tier (1 GB storage, 10 GB bandwidth) is too tight for lots of product images at scale.
- **Sharp** (in Next.js API routes) resizes and converts uploads to WebP before storing in R2.

### Cost expectations

| Resource | Free tier | AZAQUEST usage |
|----------|-----------|----------------|
| Supabase DB | 500 MB | Negligible (text + URLs) |
| Supabase Storage | 1 GB | **Not used** for product images |
| Supabase bandwidth | 10 GB/mo | Minimal (API JSON only) |
| R2 storage | 10 GB | ~12,000+ optimized images |
| R2 egress | Free | Unlimited |
| Vercel | Free hobby | Fine for side project |

**Paid tier triggers (unlikely early on):**
- Supabase project pauses after 1 week inactivity → weekly cron ping, or Pro ($25/mo)
- R2 beyond 10 GB → ~$0.015/GB/month (~$0.75 for 50 GB)

---

## Data model

### Product status lifecycle

```text
┌─────────────┐     publish      ┌─────────────┐
│   draft     │ ───────────────► │  available  │
└─────────────┘                  └──────┬──────┘
                                        │ mark sold
                                        ▼
                                 ┌─────────────┐
                                 │    sold     │  → visible on /sold
                                 └──────┬──────┘
                                        │ archive (after 30 days)
                                        ▼
                                 ┌─────────────┐
                                 │  archived   │  → text-only, images deleted
                                 └─────────────┘
```

### Tables

#### `products`

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | Primary key |
| `slug` | text | URL: `/shop/aesthetic-collar-longsleeve-xl` |
| `name` | text | Match IG caption: "Aesthetic collar longsleeve" |
| `description` | text | Optional extra detail |
| `category_id` | fk | shirts, quarter-zips, pants, rings, etc. |
| `size` | text | XL, M, "One size", or null for rings |
| `price` | integer | Naira, single value |
| `price_max` | integer | Nullable — for "6,000–20,000" ring sets |
| `status` | enum | `draft` \| `available` \| `sold` \| `archived` |
| `is_new_drop` | boolean | Powers homepage slider + `/new-drops` |
| `drop_id` | fk nullable | Groups weekly drop |
| `sku` | text | Auto-generated: `AZQ-0247` |
| `ig_post_url` | text | Link back to original post |
| `ig_caption_snippet` | text | For admin search matching |
| `search_tokens` | text | Normalized lowercase for search |
| `sold_at` | timestamp | When marked sold |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### `product_images`

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | Primary key |
| `product_id` | fk | |
| `url` | text | R2 CDN URL |
| `sort_order` | integer | First image = card thumbnail |
| `alt` | text | Accessibility |

#### `categories`

Pre-seeded: Shirts, Tees, Long Sleeves, Quarter Zips, Hoodies, Jackets, Vests, Pants, Jeans, Shorts, Rings, Accessories, Socks, etc.

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | |
| `name` | text | Display name |
| `slug` | text | URL filter key |
| `sort_order` | integer | Sidebar order |

#### `drops`

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | |
| `name` | text | "Week 12 Drop — Mar 28" |
| `released_at` | timestamp | |
| `is_active` | boolean | Current drop flag |

#### `site_settings` (singleton)

| Field | Notes |
|-------|-------|
| `hero_video_url` | R2 URL |
| `hero_punchline` | Default: "FIND IT BEFORE IT'S GONE." |
| `whatsapp_number` | For order deep links |
| `ig_handle` | @azaquest |
| `empty_drop_message` | "No active quests right now." |

No `orders` table in v1 — cart is client-side + "Send to WhatsApp" prefilled message.

---

## Sold item workflows

### Primary: Admin search + mark sold

1. Admin searches by name, size, price, SKU, or IG caption snippet
2. One tap: **Mark sold**
3. Product: `status = sold`, `sold_at = now()`, `is_new_drop = false`
4. Customer site: removed from shop grid, appears on `/sold`

Search reliability:
- `search_tokens` field — normalized: `"aesthetic collar longsleeve xl 8500"`
- Postgres `ILIKE` or full-text search
- Results show thumbnail + size + price to avoid marking wrong item
- Bulk mark sold: checkbox select → "Mark N as sold"

### SKU short codes

Auto-generate `AZQ-0247` on product creation. Shown on product card and admin list for fast lookup when seller says "sold the black quarter zip XL."

### Customer-facing sold behavior

| Surface | Behavior |
|---------|----------|
| `/shop` | Only `status = available` |
| `/new-drops` | `available` AND `is_new_drop = true` |
| `/sold` | `status = sold`, sorted by `sold_at` desc |
| Direct link to sold product | Soft page: "This quest has been claimed" + similar available items |

Sold items are **not** shown in the main shop grid.

### Sold item lifecycle (storage cleanup)

| Stage | Customer site | Storage |
|-------|---------------|---------|
| **Available** | Full gallery in shop + new drops | All images in R2 |
| **Just sold** | Moves to `/sold`, "Claimed" badge | Keep all images 14–30 days |
| **Archived** | Text-only row or tiny thumb on `/sold` | Delete full-size images from R2 |
| **Monthly export** | N/A | `archive/YYYY-MM.json` in Git (metadata only) |

- **Do not** store images in Git — JSON metadata exports only
- **Do not** delete sold rows from Postgres immediately — rows are cheap, delete the image files
- Nightly job or manual "Clean archive" button strips images from items sold 30+ days ago

---

## API design

### Public

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Filtered product list (`category`, `size`, `minPrice`, `maxPrice`, `sort`, `status=available`) |
| GET | `/api/products/new-drops` | Available + `is_new_drop` |
| GET | `/api/products/[slug]` | Single product detail |
| GET | `/api/categories` | Category list |
| GET | `/api/site-settings` | Hero video, punchline, contact links |

### Admin (session required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/products` | Create product |
| PATCH | `/api/admin/products/[id]` | Update (including `{ status: "sold" }`) |
| POST | `/api/admin/products/bulk-sold` | Bulk mark sold |
| POST | `/api/admin/uploads` | Image upload → Sharp → R2 |
| PATCH | `/api/admin/drops/[id]/clear` | End drop, unset `is_new_drop` on all |
| DELETE | `/api/admin/products/[id]/images/[imageId]` | Remove image from R2 + DB |

Optional: Supabase realtime subscription on `products` so shop updates live when admin marks sold.

---

## Page map

```text
/                     Home (split hero, glitch punchline, slider, CTA)
/shop                 Catalog (filters left 30%, grid right 70%)
/shop/[slug]          Product detail
/new-drops            Latest drop only
/sold                 Sold archive
/favourites           LocalStorage wishlist
/cart                 Wishlist + "Order via WhatsApp"
/admin/*              Protected admin panel
```

---

## Page specs

### Global header

- **Left:** AZAQUEST wordmark (text, custom logo later)
- **Right:** Favourites (heart icon) → Cart
- Sticky, minimal, black background, white text

### Home (`/`)

**Split editorial hero (40/60):**

| Left (~40%) | Right (~60%) |
|-------------|--------------|
| Hero video (9:16 IG reel) | Glitch punchline: **FIND IT BEFORE IT'S GONE.** |
| `object-fit: cover`, max-height viewport | CTA button: **Begin quest** → `/shop` |
| Muted, loop, autoplay, playsInline | Black or white background, generous whitespace |

**Below hero:**
- Auto-sliding carousel (left to right): latest `is_new_drop` product images
- Click slide → `/new-drops` or product detail

### Shop (`/shop`)

**Layout: 30% filters (left) / 70% product grid (right)**

**Filter sidebar:**
- Category (multi-select)
- Size (XS–XXL, One size)
- Price range (buckets: Under ₦10k, ₦10–20k, ₦20k+)
- Sort: Newest, Price low–high, Price high–low

**Filter UX patterns:**
- Active filter chips above grid with × to remove
- "Clear all filters" button
- Result count: "12 quests available"
- Mobile: filters in bottom sheet / drawer

**Product grid:**
- 2 columns mobile, 3–4 desktop
- Card: image, name, size, price, heart (favourite)
- Only `status = available` items

### Product detail (`/shop/[slug]`)

- Image carousel (all `product_images`)
- Name, size, price (or price range)
- SKU reference
- "Add to cart" / "Add to favourites"
- **Order CTA:** "Continue quest on WhatsApp" — prefilled message:
  > Hi AZAQUEST, I'm interested in: Aesthetic collar longsleeve (XL) — ₦8,500
- Link to original IG post (if set)

### New drops (`/new-drops`)

- Same grid layout as shop
- Query: `available` + `is_new_drop = true`
- **Empty state:** "No active quests right now." + follow IG CTA

### Sold archive (`/sold`)

- Grid of sold items, sorted by `sold_at` desc
- "Claimed" badge overlay
- Recently sold: full images (14–30 days)
- Older sold: text-only or tiny thumbnail after archive cleanup

### Cart (`/cart`)

- Client-side (localStorage) list of saved items
- **"Continue quest on WhatsApp"** — prefilled multi-item message
- No payment processing in v1

### Favourites (`/favourites`)

- localStorage wishlist
- Same card layout as shop grid

---

## Admin panel (`/admin`)

Mobile-friendly — mark sold from phone after IG DMs.

### Screens

| Screen | Purpose |
|--------|---------|
| **Dashboard** | Counts: available / sold this week / in current drop |
| **Products** | Search, filter by status, quick "Mark sold", bulk actions |
| **Add product** | Upload images, category, size, price, toggle "New drop", paste IG URL |
| **Drops** | "Start new drop" / "Clear drop" |
| **Settings** | Hero video upload, WhatsApp number, IG handle, punchline text |
| **Archive** | Trigger image cleanup for sold items 30+ days old |

### Add product flow (~2 min per item)

1. Save images from IG post
2. Admin → Add → fill name / size / price from caption
3. Toggle "Include in new drop" if part of this week's batch
4. Images auto-compressed to WebP via Sharp → uploaded to R2

---

## Visual system

| Token | Value |
|-------|-------|
| Background | `#000` or `#0A0A0A` |
| Surface / cards | `#111` |
| Text primary | `#FFFFFF` |
| Text muted | `#888888` |
| Accent | White only — no red sale banners |
| Typography | Inter / Geist — tight tracking on logo, generous whitespace |
| Product images | Full bleed, no busy borders |
| Motion | Slow fades, 300ms hovers, no bouncy UI |

### Glitch animation (hero punchline)

- Text: **FIND IT BEFORE IT'S GONE.**
- Every 4–6 seconds: 200–400ms glitch (RGB split, clip-path jitter, brief character scramble)
- CSS `@keyframes` + Framer Motion
- Subtle — glitch once, then hold clean text
- Respect `prefers-reduced-motion` — disable glitch, show static text

### Logo (later)

Wordmark **AZAQUEST** — all caps, wide letter-spacing. Optional minimal compass / slash motif.

---

## Image handling

### Upload pipeline

```text
Admin uploads image
    → API route receives file
    → Sharp resizes:
        • card: 600px wide WebP (~80 KB)
        • detail: 1200px wide WebP (~200 KB)
    → Upload both to R2
    → Save URLs in product_images table
```

### Storage rules

- Never store raw IG resolution (1–3 MB each)
- Target: ~150–250 KB per detail image
- Hero video: re-encode H.264, host on R2 (do not hotlink IG CDN)
- Do not use Supabase Storage for product images

### Image math (optimized)

| Scenario | Storage |
|----------|---------|
| 40 available items × 4 images × 200 KB | ~32 MB |
| 200 sold items with full galleries | ~160 MB |
| 500 sold items (if never cleaned) | ~400 MB |
| R2 free tier | 10 GB ≈ 12,000+ images |

---

## Project structure

```text
azaquest/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx                  # Home
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── new-drops/page.tsx
│   │   ├── sold/page.tsx
│   │   ├── favourites/page.tsx
│   │   └── cart/page.tsx
│   ├── admin/
│   │   ├── page.tsx                  # Dashboard
│   │   ├── products/
│   │   ├── drops/
│   │   └── settings/
│   └── api/
│       ├── products/
│       ├── categories/
│       ├── site-settings/
│       └── admin/
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── home/
│   │   ├── SplitHero.tsx
│   │   ├── GlitchText.tsx
│   │   └── DropsSlider.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── FilterChips.tsx
│   └── admin/
├── lib/
│   ├── db/                           # Supabase client
│   ├── r2.ts                         # Cloudflare R2 upload/delete
│   ├── images.ts                     # Sharp resize pipeline
│   ├── whatsapp.ts                   # Prefill message builder
│   └── search.ts                     # Token normalization
├── archive/                          # Monthly JSON exports (metadata only)
│   └── .gitkeep
├── supabase/
│   └── migrations/
├── PLAN.md                           # This file
├── .env.local.example
└── package.json
```

---

## Environment variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Admin
ADMIN_EMAIL=                          # Only this email can access /admin

# Site
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_IG_HANDLE=azaquest
```

---

## Phased build plan

### Phase 0 — Foundation

- [x] Init Next.js 15 repo (App Router, TypeScript, Tailwind)
- [x] Supabase project + schema migration (all tables) — SQL in `supabase/migrations/`
- [x] Seed categories — `002_seed.sql` + mock data fallback
- [x] Supabase Auth — admin magic link (single admin email)
- [x] Cloudflare R2 bucket + upload utility (Sharp → WebP → R2)
- [x] Admin CRUD: create / edit / delete products
- [x] Admin: mark sold + bulk mark sold
- [x] Admin: image upload pipeline
- [x] `.env.local.example` with all required vars

### Phase 1 — Customer storefront

- [x] Global header (logo, favourites, cart)
- [x] `/shop` — product grid + filter sidebar (category, size, price, sort)
- [x] Filter chips + clear all + result count
- [x] `/shop/[slug]` — product detail + WhatsApp CTA
- [x] `/new-drops` — filtered grid + empty state
- [x] `/sold` — sold archive grid
- [x] Favourites + cart (localStorage)
- [x] WhatsApp deep link message builder

### Phase 2 — Home & polish

- [x] Split editorial hero (video left, glitch punchline + CTA right)
- [x] Glitch text animation (`FIND IT BEFORE IT'S GONE.`)
- [x] `prefers-reduced-motion` fallback
- [x] New drops auto-slider below hero
- [x] Mobile responsive pass (filter drawer, hero stack)
- [x] OG meta tags for product pages
- [ ] Supabase realtime or SWR revalidation on product changes

### Phase 3 — Admin polish & lifecycle

- [x] Admin dashboard (counts, quick actions)
- [x] Drops management (start drop / clear drop)
- [x] Site settings (hero video, contact info, punchline)
- [x] Sold item archive cleanup job (strip images 30+ days after sold)
- [x] Monthly JSON metadata export to `archive/`
- [x] Admin mobile UX pass

### Phase 4 — If he adopts it (future)

- [ ] Multiple admin users (seller's account)
- [ ] Paystack / Flutterwave checkout
- [ ] Orders table + notifications
- [ ] Custom domain
- [ ] Custom AZAQUEST logo
- [ ] Analytics (Plausible / Vercel Analytics)

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Manual data entry is tedious | Start with current drop only (~20–40 items), not full IG back-catalog |
| Wrong item marked sold | Search shows image + size + price; confirm modal |
| Seller never uses it | You still win — live stock visibility before DMing |
| IG image copyright | Get permission before public launch; you're helping his sales |
| Price ranges (rings ₦6k–₦20k) | Show "From ₦6,000" on card; detail page says "DM for set" |
| Supabase project pauses (1 week inactive) | Weekly cron ping or upgrade to Pro |
| Storage bloat from sold items | Archive lifecycle — delete images, keep metadata JSON |

---

## IG reference (product examples)

From @azaquest / @azaquest_premium:

- Aesthetic collar longsleeve — ₦8,500, XL
- Baggy jeans and shorts — ₦15,000–25,000
- Aesthetic ring set — ₦6,000–20,000
- Drew socks — ₦3,000

Orders via IG DM or WhatsApp (number in bio).

---

## Out of scope (v1)

- Online payment / checkout
- User accounts (customer-side)
- Order management
- IG scraping / auto-sync
- Custom logo design
- Full IG back-catalog import
- Email notifications
- Multi-admin

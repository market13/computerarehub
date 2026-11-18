# COMPUTER CARE — BACKEND SETUP & INTEGRATION GUIDE
**Stack:** Supabase (PostgreSQL, Auth, Storage), React 19 + Vite, Netlify / Cloudflare Pages  
**Target Environment:** Local Development, Netlify, and Cloudflare Pages  
**Canonical Domain:** `https://computercaregzb.com`

---

## 1. ENVIRONMENT CONFIGURATION

Create `.env` in the root and in `client/.env`. The application enforces strict credential isolation between the public client bundle and private serverless functions.

### 1.1 Client-Safe Environment Variables (`client/.env`)
These are baked into Vite's public bundle. **Never place secrets here.**

```env
# Supabase Public Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...public-anon-key

# Website Production URL (Canonical)
VITE_SITE_URL=https://computercaregzb.com

# Support WhatsApp Phone Number (India Standard)
VITE_WHATSAPP_PHONE=919810550222
```

### 1.2 Private Server Environment Variables (Netlify Dashboard / Supabase Vault)
These are accessible **only** within serverless functions (`netlify/functions/` or Supabase Edge Functions).

```env
# Supabase Privileged Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...secret-service-role-key

# Contact Email for Notifications (TODO: set to confirmed mailbox on computercaregzb.com)
CONTACT_EMAIL=contact@computercaregzb.com

# GST & Business Compliance
COMPANY_NAME=Computer Care
COMPANY_GSTIN=09XXXXX0000X1Z5
STORE_ADDRESS=G 23 Shiva Tower, Ghaziabad, UP 201009
STORE_PHONE=+919810550222
```

---

## 2. CANONICAL BUILD & DEPLOYMENT

The project enforces identical, single-command builds and directory structures across all deployment targets:

- **Canonical Build Command:** `npm run build`
- **Canonical Publish Directory:** `dist`

### 2.1 Netlify (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### 2.2 Cloudflare Pages (`wrangler.jsonc` & `wrangler.toml`)
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "custom-pc-builder",
  "compatibility_date": "2024-09-23",
  "pages_build_output_dir": "./dist"
}
```

The build pipeline automatically:
1. Runs `vite build` to compile the React 19 single-page application.
2. Prerenders all 36 public routes into static HTML (`client/scripts/prerender_routes.cjs`).
3. Generates the comprehensive `sitemap.xml` and `robots.txt` referencing `https://computercaregzb.com`.
4. Runs `client/scripts/verify_build.cjs` to assert zero duplicate H1s, zero legacy domain references, and complete SEO integrity.
5. Copies all output files to root `./dist`.

---

## 3. FORM SUBMISSIONS & LEADS ARCHITECTURE

Form submissions (`expert-consultation`, `bulk-order`, `cart-checkout`) use `client/src/utils/formSubmit.js`:
1. **Primary Route:** Directly inserts leads into Supabase tables (`public.leads` and `public.quotations`) using Row Level Security (RLS).
2. **Netlify Fallback:** If Supabase is unconfigured or unavailable, safely falls back to Netlify Forms POST.
3. **Fail-Safe Route:** If both channels fail, an informative error is presented to the customer with a pre-filled direct WhatsApp link (+91 9810550222), ensuring inquiries are never silently dropped.

---

## 4. SUPABASE PROJECT SETUP

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **New Project**, select Organization, and set:
   - **Name:** `computer-care-production`
   - **Database Password:** Generate a secure 24+ character password.
   - **Region:** `ap-south-1 (Mumbai)` (Crucial for low latency across India).
3. Wait ~2 minutes for the database instance to provision.

### Step 2: Apply Database Schema & Migrations
1. In the Supabase dashboard, navigate to the **SQL Editor**.
2. Run migration 1: `supabase/migrations/20261109000000_init_ecommerce.sql`.
3. Run migration 2: `supabase/migrations/20261118120000_backend_and_security.sql`.
4. Verify tables (`profiles`, `products`, `leads`, `quotations`, `pc_configurations`, `orders`, `audit_logs`).

### Step 3: Populate Catalog Data
Run the catalog migration seed script:
```bash
node supabase/seed_catalog.cjs
```
This reads 581 genuine hardware items from `client/public/data/products.json` and idempotently upserts brands, categories, and products.

### Step 4: Configure Supabase Authentication
1. Navigate to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to `https://computercaregzb.com`.
3. Add redirect URLs:
   - `http://localhost:5173/**`
   - `https://computercaregzb.com/**`
4. Set admin user role: In `public.profiles`, set `role = 'admin'` for store manager emails.

---

## 5. LOCAL RUNTIME INSTRUCTIONS

### Prerequisites
- Node.js v18+ (Node.js v24 is installed locally)
- npm v9+

### Start Local Development
```bash
# 1. Install dependencies
npm --prefix client install

# 2. Start Vite development server
npm --prefix client run dev -- --host 127.0.0.1
```
The application will run locally at `http://127.0.0.1:5173/`.
3. Copy **Key ID** (`rzp_test_...`) and **Key Secret**.
4. Store **Key ID** in `client/.env` as `VITE_RAZORPAY_KEY_ID`.
5. Store **Key Secret** in Netlify / server environment variables.

### Step 3: Configure Razorpay Webhooks
1. In the Razorpay dashboard, navigate to **Settings** -> **Webhooks** -> **Add New Webhook**.
2. Set **Webhook URL** to:
   `https://magical-duckanoo-626d44.netlify.app/.netlify/functions/razorpay-webhook`
3. Enter a random **Secret** and add it to server environment variables as `RAZORPAY_WEBHOOK_SECRET`.
4. Subscribe to the following active events:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`

---

## 4. NETLIFY DEPLOYMENT & SERVERLESS FUNCTIONS

### 4.1 Build Configuration (`netlify.toml`)
Netlify is configured to build the React 19 client and deploy serverless functions:

```toml
[build]
  command = "npm --prefix client install && npm --prefix client run build && node -e \"const fs=require('fs'); fs.cpSync('client/dist', 'dist', {recursive: true});\""
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4.2 Serverless Endpoints Deployed
1. `POST /api/create-razorpay-order`:
   - Accepts cart item IDs and coupon code.
   - Recalculates exact price from database.
   - Creates official order on Razorpay.
   - Returns `razorpay_order_id`, `amount`, and `currency`.
2. `POST /api/verify-payment`:
   - Validates Razorpay HMAC-SHA256 signature.
   - Atomically updates order status to `'confirmed'`.
   - Decrements stock in `product_inventory`.
3. `POST /api/razorpay-webhook`:
   - Handles async payment events from Razorpay.
4. `POST /api/save-configuration`:
   - Saves custom PC rig, validates compatibility, returns shareable link.
5. `POST /api/submit-quotation`:
   - Saves formal quotation / B2B bulk request.

---

## 5. LOCAL RUNTIME INSTRUCTIONS

### Prerequisites
- Node.js v18+ (Node.js v24 is installed locally)
- npm v9+

### Start Local Development
```bash
# 1. Install root & client dependencies
cd "C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder"
npm --prefix client install

# 2. Start Vite development server
npm --prefix client run dev -- --host 127.0.0.1
```
The application will run locally at `http://127.0.0.1:5173/`.

# COMPUTER CARE — BACKEND SETUP & INTEGRATION GUIDE
**Stack:** Supabase (PostgreSQL, Auth, Storage, Edge Functions), React 19 + TypeScript, Razorpay, Netlify  
**Target Environment:** Local Development & Netlify Production  

---

## 1. ENVIRONMENT CONFIGURATION

Create `.env` in the root and in `client/.env`. The application enforces strict credential isolation between the public client bundle and private serverless functions.

### 1.1 Client-Safe Environment Variables (`client/.env`)
These are baked into Vite's public bundle. **Never place secrets here.**

```env
# Supabase Public Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...public-anon-key

# Razorpay Public Key ID (Safe for frontend checkout popup)
VITE_RAZORPAY_KEY_ID=rzp_test_your_public_key_id

# Website Production URL
VITE_SITE_URL=https://magical-duckanoo-626d44.netlify.app

# Support WhatsApp Phone Number (India Standard)
VITE_WHATSAPP_PHONE=919810550222
```

### 1.2 Private Server Environment Variables (Netlify Dashboard / Supabase Vault)
These are accessible **only** within serverless functions (`netlify/functions/` or Supabase Edge Functions).

```env
# Supabase Privileged Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...secret-service-role-key

# Razorpay Secret Credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# GST & Business Compliance
COMPANY_NAME=Computer Care
COMPANY_GSTIN=09XXXXX0000X1Z5
STORE_ADDRESS=Shiva Tower, Ghaziabad, UP 201001
STORE_PHONE=+919810550222
STORE_EMAIL=info@computercare.in
```

---

## 2. SUPABASE PROJECT SETUP

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **New Project**, select Organization, and set:
   - **Name:** `computer-care-production`
   - **Database Password:** Generate a secure 24+ character password.
   - **Region:** `ap-south-1 (Mumbai)` (Crucial for low latency across India).
3. Wait ~2 minutes for the database instance to provision.

### Step 2: Apply Database Schema & Migrations
1. In the Supabase dashboard, navigate to the **SQL Editor**.
2. Click **New Query**.
3. Copy the full contents of `supabase/migrations/20261109000000_init_ecommerce.sql`.
4. Click **Run**.
5. Verify that all 22 tables are created under `Table Editor`.

### Step 3: Configure Supabase Authentication
1. Navigate to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to `https://magical-duckanoo-626d44.netlify.app`.
3. Add redirect URLs:
   - `http://localhost:5173/**`
   - `https://magical-duckanoo-626d44.netlify.app/**`
4. In **Email Templates**, customize the confirmation and password reset emails with Computer Care branding.
5. In **Providers**, ensure **Email** is enabled with:
   - "Confirm email": Optional (can be disabled during development for instant testing).
   - "Secure password reset": Enabled.

### Step 4: Configure Supabase Storage Buckets
1. Navigate to **Storage** -> **Create new bucket**.
2. Create bucket `product-images`:
   - Set as **Public bucket** (so product photos load on CDN).
   - Set allowed MIME types: `image/jpeg, image/png, image/webp`.
   - Max file size: `5MB`.
3. Create bucket `quotation-docs`:
   - Set as **Private bucket** (accessible only by authenticated customers & admin).

---

## 3. RAZORPAY PAYMENT GATEWAY SETUP

### Step 1: Razorpay Merchant Account
1. Sign up at [https://razorpay.com](https://razorpay.com).
2. Switch to **Test Mode** during staging.
3. Complete KYC submission for live Indian payments (UPI, Credit/Debit Cards, NetBanking, EMI).

### Step 2: Generate API Keys
1. Go to **Settings** -> **API Keys**.
2. Click **Generate Test Key**.
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

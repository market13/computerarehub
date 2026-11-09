# COMPUTER CARE — SECURITY ARCHITECTURE & THREAT MODEL
**Classification:** Production E-Commerce Security Specification  
**Standard:** OWASP Top 10 + PCI-DSS SAQ-A + Indian DPDP Act 2023  
**Target Architecture:** Supabase RLS + Netlify Serverless Functions + Razorpay  

---

## 1. THREAT MODELING & ATTACK VECTORS

| Attack Vector | Risk | Mitigation Strategy |
|---|---|---|
| **Price Tampering** | High-value components (e.g. ₹1,80,000 RTX 4090) altered in client payload to ₹1 | Client prices are completely ignored by the server. Order total is recalculated exclusively from database product records in a secure serverless function. |
| **Fake Payment Spoofing** | Attacker calls checkout success handler directly or modifies HTTP response | Never mark an order as paid without server-side HMAC-SHA256 signature verification or verified Razorpay webhook payload. |
| **Privilege Escalation** | Customer attempts to access Admin dashboard or change product prices | Role-Based Access Control (RBAC) enforced via PostgreSQL RLS policies where `auth.uid()` must have `profiles.role = 'admin'`. Frontend route guards act only as UX controls. |
| **Data Scraping & PII Leak** | Attacker accesses other customers' shipping addresses, phone numbers, or orders | Supabase Row Level Security (RLS) guarantees that `customer_addresses` and `orders` can only be queried by the user who created them (`auth.uid() = user_id`). |
| **Wholesale / Purchase Price Exposure** | Competitor discovers Computer Care's purchase prices and wholesale margins | `purchase_price` is strictly hidden from public client views. Stored in a protected column excluded from public API view models. |
| **Webhook Replay Attacks** | Attacker re-sends valid payment webhook to artificially trigger multiple order fulfillments | Idempotency keys and unique index on `payments.razorpay_payment_id` prevent duplicate captures. |
| **Inventory Hot-Running / Race Condition** | Two customers buy the last in-stock CPU simultaneously | PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) in transactional checkout function. |

---

## 2. ROW LEVEL SECURITY (RLS) POLICY MATRIX

All tables have RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

```sql
-- 1. Profiles Table Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by authenticated users"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 2. Customer Addresses Security
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view only their own addresses"
ON public.customer_addresses FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own addresses"
ON public.customer_addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.customer_addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.customer_addresses FOR DELETE
USING (auth.uid() = user_id);

-- 3. Orders & Line Items Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
);

-- 4. Admin Role Check Helper Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. ZERO-TRUST PAYMENT VERIFICATION ENGINE

The client never executes payment capture directly. The flow follows strict cryptographic proof:

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Client as React 19 Client
    participant Server as Netlify Function (/api/create-order)
    participant DB as Supabase PostgreSQL
    participant RZP as Razorpay Gateway
    participant Verify as Netlify Function (/api/verify-payment)

    Customer->>Client: Clicks Proceed to Pay
    Client->>Server: POST /api/create-order (cartItemIds, addressId)
    Server->>DB: Lock stock & recalculate sum(product.selling_price)
    Server->>RZP: orders.create({ amount: calculatedPaise, currency: 'INR' })
    RZP-->>Server: Return razorpay_order_id
    Server->>DB: Insert into orders & payments (status: 'initiated')
    Server-->>Client: Return { orderId, razorpayOrderId, amount }
    
    Client->>RZP: Open Razorpay Modal (Key ID, amount, orderId)
    Customer->>RZP: Completes UPI / Card / NetBanking
    RZP-->>Client: Callback { razorpay_payment_id, razorpay_signature }
    
    Client->>Verify: POST /api/verify-payment { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
    Note over Verify: Compute expectedSignature = HMAC_SHA256(orderId + "|" + paymentId, SECRET)
    alt Signatures Match
        Verify->>DB: BEGIN TRANSACTION; Update payments captured; orders confirmed; COMMIT;
        Verify-->>Client: { success: true, orderNumber }
        Client->>Customer: Display Order Confirmation
    else Signature Tampered
        Verify->>DB: Log fraud alert; Mark payment failed
        Verify-->>Client: 400 Bad Request
    end
```

### Server Signature Verification Logic:
```javascript
const crypto = require('crypto');

function verifyRazorpaySignature({ orderId, paymentId, signature, secret }) {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature, 'utf-8'),
    Buffer.from(signature, 'utf-8')
  );
}
```

---

## 4. CREDENTIAL ISOLATION GUIDELINES

1. **`VITE_` Prefix Rule:**
   - Any variable prefixed with `VITE_` is statically injected into client JavaScript and readable by anyone inspecting browser source.
   - Allowed in client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RAZORPAY_KEY_ID`.
   - **Strictly Forbidden in client:** `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
2. **Database Service Role:**
   - The Supabase `service_role` key bypasses Row Level Security.
   - It is utilized solely within isolated serverless endpoints (`netlify/functions/`) for administrative tasks like stock deduction and webhook processing.

---

## 5. DATA PRIVACY & INPUT SANITIZATION

1. **SQL Injection:**
   - Supabase PostgREST and node-postgres use parameterized queries exclusively. Zero raw string interpolation is permitted in SQL statements.
2. **Cross-Site Scripting (XSS):**
   - React 19 automatically escapes variables rendered in JSX.
   - Rich descriptions or HTML notes are sanitized before rendering.
3. **Indian DPDP Act 2023 Conformance:**
   - Customers have the right to request deletion of their profile and address records.
   - Telephone numbers and email addresses are masked in public logs and client-side administrative previews.

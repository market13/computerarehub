-- ==============================================================================
-- COMPUTER CARE (computercaregzb.com) — SUPABASE DATABASE SCHEMA
-- Custom PC Builder, Hardware Store & Repair Hub | Ghaziabad, UP
-- ==============================================================================

-- 0. Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Admins Table
-- Tracks authenticated admin users authorized to view & manage tickets and requests
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. Build Requests Table
-- Public custom PC consultation and quotation inquiries
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.build_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    budget NUMERIC,
    use_case TEXT,
    preferences TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
        'new',
        'contacted',
        'quoted',
        'confirmed',
        'built',
        'delivered',
        'cancelled'
    )),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. Repair Tickets Table
-- In-store repair and service tickets for laptops, desktops, and custom rigs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.repair_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT NOT NULL UNIQUE DEFAULT upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6)),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    device TEXT NOT NULL,
    issue TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN (
        'received',
        'diagnosing',
        'waiting_parts',
        'repairing',
        'ready',
        'delivered',
        'cancelled'
    )),
    estimate NUMERIC,
    final_amount NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. Helper Function: is_admin()
-- Checks if current authenticated session belongs to a verified administrator
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- ------------------------------------------------------------------------------
-- 5. Trigger: Touch updated_at timestamp on repair_tickets
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS repair_tickets_touch ON public.repair_tickets;
CREATE TRIGGER repair_tickets_touch
  BEFORE UPDATE ON public.repair_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ------------------------------------------------------------------------------
-- 6. RPC: track_repair(p_code, p_phone)
-- Secure public lookup: returns repair details ONLY when BOTH ticket code and phone match
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.track_repair(p_code TEXT, p_phone TEXT)
RETURNS TABLE(
    ticket_code TEXT,
    device TEXT,
    status TEXT,
    estimate NUMERIC,
    updated_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT t.ticket_code, t.device, t.status, t.estimate, t.updated_at
  FROM public.repair_tickets t
  WHERE t.ticket_code = upper(trim(p_code))
    AND t.phone = trim(p_phone)
  LIMIT 1;
$$;

-- ------------------------------------------------------------------------------
-- 7. Grant Standard Schema & Table Permissions to API Roles
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 8. Enable Row Level Security (RLS) on all tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "admin read admins" ON public.admins;
DROP POLICY IF EXISTS "anyone can submit build request" ON public.build_requests;
DROP POLICY IF EXISTS "admin manage build requests" ON public.build_requests;
DROP POLICY IF EXISTS "admin manage repair tickets" ON public.repair_tickets;

-- 8.1 Admins Table Policies
CREATE POLICY "admin read admins"
ON public.admins FOR SELECT
TO public
USING (is_admin());

-- 8.2 Build Requests Policies
-- Public / Anon can ONLY insert requests (status must be 'new'); cannot read or update
CREATE POLICY "anyone can submit build request"
ON public.build_requests FOR INSERT
TO public
WITH CHECK (status = 'new');

-- Admins can read, update, and manage all build requests
CREATE POLICY "admin manage build requests"
ON public.build_requests FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin());

-- 8.3 Repair Tickets Policies
-- Direct SELECT on repair_tickets is BLOCKED for public/anon; they must use track_repair() RPC
CREATE POLICY "admin manage repair tickets"
ON public.repair_tickets FOR ALL
TO public
USING (is_admin())
WITH CHECK (is_admin());

-- ==============================================================================
-- End of Schema
-- ==============================================================================

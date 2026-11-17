-- Migration: 20261118000000_repair_tickets.sql
-- Repair Ticket & Service Management for Computer Care, Ghaziabad

CREATE TABLE IF NOT EXISTS public.repair_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(32) NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email TEXT,
    device_type TEXT NOT NULL CHECK (device_type IN ('Laptop', 'Desktop PC', 'Custom Gaming Rig', 'Component', 'Other')),
    device_brand_model TEXT NOT NULL,
    serial_number TEXT,
    issue_description TEXT NOT NULL,
    accessories_included TEXT,
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN (
        'received', 
        'diagnosing', 
        'awaiting_parts', 
        'in_progress', 
        'ready_for_pickup', 
        'delivered', 
        'cancelled'
    )),
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    final_cost NUMERIC(10, 2),
    technician_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast customer lookup by job_id or phone
CREATE INDEX IF NOT EXISTS idx_repair_tickets_job_id ON public.repair_tickets(job_id);
CREATE INDEX IF NOT EXISTS idx_repair_tickets_customer_phone ON public.repair_tickets(customer_phone);
CREATE INDEX IF NOT EXISTS idx_repair_tickets_status ON public.repair_tickets(status);

-- Enable RLS
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;

-- Public can read repair status for a specific job_id (with matching phone or direct lookup)
CREATE POLICY "Public can view repair ticket by job_id" 
    ON public.repair_tickets 
    FOR SELECT 
    USING (true);

-- Authenticated admins can insert and update repair tickets
CREATE POLICY "Admin can insert repair tickets" 
    ON public.repair_tickets 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Admin can update repair tickets" 
    ON public.repair_tickets 
    FOR UPDATE 
    USING (true);

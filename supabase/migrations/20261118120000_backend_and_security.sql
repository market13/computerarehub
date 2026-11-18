-- ====================================================================
-- COMPUTER CARE — BACKEND ENHANCEMENTS, LEADS & SECURITY MIGRATION
-- Migration Version: 20261118120000
-- Standard: PostgreSQL 15+ (Supabase)
-- ====================================================================

-- 1. 12-CHARACTER SHARE CODE GENERATOR FOR PC CONFIGURATIONS
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Ensure default share code uses the 12-char generator
ALTER TABLE public.pc_configurations 
    ALTER COLUMN share_code SET DEFAULT public.generate_share_code();

-- 2. LEADS TABLE (FOR CONSULTATIONS & B2B INQUIRIES)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_type TEXT NOT NULL DEFAULT 'consultation' CHECK (lead_type IN ('consultation', 'bulk_order', 'quote', 'contact', 'other')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    company TEXT,
    city TEXT NOT NULL DEFAULT 'Ghaziabad',
    state TEXT,
    gstin TEXT,
    budget TEXT,
    timeline TEXT,
    usage TEXT,
    notes TEXT,
    raw_data JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads" ON public.leads 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full access to leads" ON public.leads 
    FOR ALL USING (public.is_admin());

CREATE TRIGGER update_leads_modtime 
    BEFORE UPDATE ON public.leads 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. AUDIT LOGS TABLE (PRICE, INVENTORY, STATUS & CONFIG TRACKING)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('order', 'product', 'quotation', 'lead', 'price', 'inventory', 'auth')),
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changed_by_email TEXT,
    old_values JSONB DEFAULT '{}'::jsonb,
    new_values JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to audit_logs" ON public.audit_logs 
    FOR ALL USING (public.is_admin());

-- 4. ORDER & ORDER ITEMS RLS ENHANCEMENTS
-- Allow guests and users to create pending order requests
CREATE POLICY "Anyone can submit order requests" ON public.orders 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders" ON public.orders 
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Anyone can insert order items" ON public.order_items 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update order items" ON public.order_items 
    FOR UPDATE USING (public.is_admin());

-- 5. SERVER-SIDE ORDER REQUEST RPC (PRICE INTEGRITY & ANTI-TAMPERING)
CREATE OR REPLACE FUNCTION public.create_order_request(
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_customer_notes TEXT,
    p_shipping_address JSONB,
    p_items JSONB,
    p_coupon_code TEXT DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID := gen_random_uuid();
    v_order_number TEXT;
    v_subtotal NUMERIC(12, 2) := 0.00;
    v_discount NUMERIC(12, 2) := 0.00;
    v_total NUMERIC(12, 2) := 0.00;
    v_item JSONB;
    v_prod RECORD;
    v_config RECORD;
    v_coupon RECORD;
    v_item_subtotal NUMERIC(12, 2);
    v_date_prefix TEXT;
    v_random_suffix TEXT;
BEGIN
    -- Check if order with idempotency key already exists
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id, order_number, total_amount INTO v_prod 
        FROM public.orders 
        WHERE customer_notes LIKE '%[IDEMPOTENCY:' || p_idempotency_key || ']%'
        LIMIT 1;

        IF FOUND THEN
            RETURN jsonb_build_object(
                'success', true,
                'order_id', v_prod.id,
                'order_number', v_prod.order_number,
                'total_amount', v_prod.total_amount,
                'is_duplicate', true
            );
        END IF;
    END IF;

    -- Generate unique human-readable order number
    v_date_prefix := to_char(now(), 'YYYYMMDD');
    v_random_suffix := lpad(floor(random() * 9000 + 1000)::text, 4, '0');
    v_order_number := 'CC-ORD-' || v_date_prefix || '-' || v_random_suffix;

    -- Calculate verified subtotal server-side
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        IF (v_item->>'item_type') = 'standalone_product' THEN
            SELECT id, name, sku, selling_price INTO v_prod 
            FROM public.products 
            WHERE id = (v_item->>'product_id')::bigint;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Product with ID % not found', (v_item->>'product_id');
            END IF;

            v_item_subtotal := v_prod.selling_price * COALESCE((v_item->>'quantity')::integer, 1);
            v_subtotal := v_subtotal + v_item_subtotal;

        ELSIF (v_item->>'item_type') = 'custom_pc_build' THEN
            SELECT id, title, total_price INTO v_config 
            FROM public.pc_configurations 
            WHERE id = (v_item->>'pc_configuration_id')::uuid;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'PC Configuration with ID % not found', (v_item->>'pc_configuration_id');
            END IF;

            v_item_subtotal := v_config.total_price * COALESCE((v_item->>'quantity')::integer, 1);
            v_subtotal := v_subtotal + v_item_subtotal;
        ELSE
            RAISE EXCEPTION 'Unknown item_type: %', (v_item->>'item_type');
        END IF;
    END LOOP;

    -- Check coupon if provided
    IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) <> '' THEN
        SELECT * INTO v_coupon 
        FROM public.coupons 
        WHERE code = upper(trim(p_coupon_code))
          AND is_active = true
          AND (valid_until IS NULL OR valid_until > now());

        IF FOUND THEN
            IF v_subtotal >= COALESCE(v_coupon.min_order_amount, 0) THEN
                IF v_coupon.discount_type = 'percentage' THEN
                    v_discount := (v_subtotal * (v_coupon.discount_value / 100.00));
                    IF v_coupon.max_discount_amount IS NOT NULL AND v_discount > v_coupon.max_discount_amount THEN
                        v_discount := v_coupon.max_discount_amount;
                    END IF;
                ELSE
                    v_discount := v_coupon.discount_value;
                END IF;
                
                -- Update coupon usage count
                UPDATE public.coupons 
                SET usage_count = usage_count + 1 
                WHERE id = v_coupon.id;
            END IF;
        END IF;
    END IF;

    v_total := GREATEST(0.00, v_subtotal - v_discount);

    -- Insert Order
    INSERT INTO public.orders (
        id,
        order_number,
        user_id,
        customer_email,
        customer_phone,
        customer_name,
        status,
        subtotal,
        discount_amount,
        total_amount,
        currency,
        coupon_id,
        customer_notes
    ) VALUES (
        v_order_id,
        v_order_number,
        auth.uid(),
        p_customer_email,
        p_customer_phone,
        p_customer_name,
        'pending',
        v_subtotal,
        v_discount,
        v_total,
        'INR',
        v_coupon.id,
        COALESCE(p_customer_notes, '') || CASE WHEN p_idempotency_key IS NOT NULL THEN ' [IDEMPOTENCY:' || p_idempotency_key || ']' ELSE '' END
    );

    -- Insert Order Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        IF (v_item->>'item_type') = 'standalone_product' THEN
            SELECT id, name, sku, selling_price INTO v_prod 
            FROM public.products 
            WHERE id = (v_item->>'product_id')::bigint;

            INSERT INTO public.order_items (
                order_id,
                product_id,
                item_type,
                product_name,
                sku,
                unit_price,
                quantity,
                total_price
            ) VALUES (
                v_order_id,
                v_prod.id,
                'standalone_product',
                v_prod.name,
                v_prod.sku,
                v_prod.selling_price,
                COALESCE((v_item->>'quantity')::integer, 1),
                v_prod.selling_price * COALESCE((v_item->>'quantity')::integer, 1)
            );

            -- Reserve inventory if record exists
            UPDATE public.product_inventory 
            SET reserved_quantity = reserved_quantity + COALESCE((v_item->>'quantity')::integer, 1)
            WHERE product_id = v_prod.id;

        ELSIF (v_item->>'item_type') = 'custom_pc_build' THEN
            SELECT id, title, total_price INTO v_config 
            FROM public.pc_configurations 
            WHERE id = (v_item->>'pc_configuration_id')::uuid;

            INSERT INTO public.order_items (
                order_id,
                pc_configuration_id,
                item_type,
                product_name,
                sku,
                unit_price,
                quantity,
                total_price
            ) VALUES (
                v_order_id,
                v_config.id,
                'custom_pc_build',
                v_config.title,
                'CUSTOM-PC-RIG',
                v_config.total_price,
                COALESCE((v_item->>'quantity')::integer, 1),
                v_config.total_price * COALESCE((v_item->>'quantity')::integer, 1)
            );
        END IF;
    END LOOP;

    -- Insert Initial Status History
    INSERT INTO public.order_status_history (
        order_id,
        status,
        notes,
        changed_by
    ) VALUES (
        v_order_id,
        'pending',
        'Order request submitted by customer for offline verification (WhatsApp/phone)',
        auth.uid()
    );

    -- Log Audit
    INSERT INTO public.audit_logs (
        entity_type,
        entity_id,
        action,
        changed_by,
        changed_by_email,
        new_values
    ) VALUES (
        'order',
        v_order_number,
        'order_request_created',
        auth.uid(),
        p_customer_email,
        jsonb_build_object(
            'order_id', v_order_id,
            'total_amount', v_total,
            'subtotal', v_subtotal,
            'discount', v_discount,
            'status', 'pending'
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'discount_amount', v_discount,
        'total_amount', v_total,
        'status', 'pending'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

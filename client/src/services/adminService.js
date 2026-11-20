import { supabase, isSupabaseConfigured, safeDbQuery } from './supabaseClient.js';

/**
 * Check if the live Supabase backend is reachable
 */
export async function checkBackendConnection() {
  if (!isSupabaseConfigured() || !supabase) {
    return { isLive: false, reason: 'unconfigured' };
  }
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { isLive: false, reason: error.message };
    }
    return { isLive: true };
  } catch (err) {
    return { isLive: false, reason: err.message };
  }
}

/**
 * Fetch all store orders from Supabase
 */
export async function fetchAdminOrders() {
  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          status,
          subtotal,
          discount_amount,
          total_amount,
          customer_notes,
          created_at,
          order_items (
            id,
            product_name,
            sku,
            unit_price,
            quantity,
            total_price,
            item_type
          ),
          shipping_details (
            courier_partner,
            tracking_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((o) => ({
        id: o.order_number,
        dbId: o.id,
        customer: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone,
        city: 'Ghaziabad, UP',
        type: o.order_items?.some((i) => i.item_type === 'custom_pc_build') ? 'Custom PC Rig' : 'Hardware Order',
        itemsCount: o.order_items?.length || 1,
        subtotal: Number(o.subtotal) || 0,
        gst: Math.round(Number(o.subtotal) * 0.18),
        total: Number(o.total_amount) || 0,
        status: o.status,
        date: new Date(o.created_at).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        courier: o.shipping_details?.[0]?.courier_partner || '',
        trackingNumber: o.shipping_details?.[0]?.tracking_number || '',
        parts: (o.order_items || []).map((i) => `${i.product_name} (x${i.quantity})`),
      }));
    },
    async () => {
      try {
        const raw = localStorage.getItem('computercare_orders');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  );
}

/**
 * Update an order's status and record audit log & status history
 */
export async function updateAdminOrderStatus(orderRefOrId, newStatus, notes = '') {
  return await safeDbQuery(
    async (client) => {
      // 1. Update order status
      const { data: order, error } = await client
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .or(`order_number.eq.${orderRefOrId},id.eq.${orderRefOrId}`)
        .select()
        .single();

      if (error) throw error;

      // 2. Record status history
      await client.from('order_status_history').insert({
        order_id: order.id,
        status: newStatus,
        notes: notes || `Admin updated order status to ${newStatus}`,
      });

      // 3. Record audit log
      await client.from('audit_logs').insert({
        entity_type: 'order',
        entity_id: order.order_number,
        action: `status_changed_to_${newStatus}`,
        new_values: { status: newStatus, notes },
      });

      return order;
    },
    async () => {
      return { id: orderRefOrId, status: newStatus };
    }
  );
}

/**
 * Update shipping and tracking details for an order
 */
export async function updateAdminOrderTracking(orderRefOrId, courier, trackingNumber) {
  return await safeDbQuery(
    async (client) => {
      const { data: order } = await client
        .from('orders')
        .select('id, order_number')
        .or(`order_number.eq.${orderRefOrId},id.eq.${orderRefOrId}`)
        .single();

      if (!order) return null;

      const { data, error } = await client
        .from('shipping_details')
        .upsert(
          {
            order_id: order.id,
            courier_partner: courier,
            tracking_number: trackingNumber,
            dispatched_at: new Date().toISOString(),
            shipping_address: { city: 'Ghaziabad', state: 'Uttar Pradesh' },
          },
          { onConflict: 'order_id' }
        )
        .select()
        .single();

      if (error) throw error;

      await client.from('audit_logs').insert({
        entity_type: 'order',
        entity_id: order.order_number,
        action: 'tracking_updated',
        new_values: { courier_partner: courier, tracking_number: trackingNumber },
      });

      return data;
    },
    async () => {
      return { courier, trackingNumber };
    }
  );
}

/**
 * Fetch all leads and quotations
 */
export async function fetchAdminLeadsAndQuotes() {
  return await safeDbQuery(
    async (client) => {
      const results = [];

      // Fetch build_requests
      try {
        const { data: builds } = await client
          .from('build_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (builds) {
          builds.forEach((b) => {
            results.push({
              id: `REQ-${b.id.slice(0, 8).toUpperCase()}`,
              dbId: b.id,
              sourceType: 'build_request',
              type: b.use_case || 'Custom PC Request',
              name: b.name,
              company: 'Direct Customer',
              phone: b.phone,
              email: b.email || '',
              city: 'Ghaziabad',
              category: b.use_case || 'PC Build',
              quantity: '1',
              budget: b.budget ? `₹${Number(b.budget).toLocaleString('en-IN')}` : 'Flexible',
              timeline: 'Immediate',
              notes: b.preferences || '',
              date: new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: b.status,
            });
          });
        }
      } catch (brErr) {
        console.warn('build_requests fetch:', brErr);
      }

      // Fetch quotations
      const { data: quotes } = await client
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotes) {
        quotes.forEach((q) => {
          results.push({
            id: q.quotation_number,
            dbId: q.id,
            sourceType: 'quotation',
            type: q.inquiry_type === 'consultation' ? 'PC Consultation' : q.inquiry_type === 'b2b_bulk' ? 'B2B Bulk Inquiry' : 'Custom PC Build Quote',
            name: q.customer_name,
            company: q.company_name || 'Individual Customer',
            phone: q.customer_phone,
            email: q.customer_email,
            city: q.city || 'Ghaziabad',
            category: q.intended_usage || 'Custom Rig',
            quantity: '1',
            budget: q.budget_range || `₹${Number(q.quoted_subtotal || 0).toLocaleString('en-IN')}`,
            timeline: q.timeline || 'Immediate',
            notes: q.notes || '',
            date: new Date(q.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: q.status === 'pending' ? 'Pending Review' : q.status,
          });
        });
      }

      // Fetch leads
      try {
        const { data: leads } = await client
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (leads) {
          leads.forEach((l) => {
            results.push({
              id: `LEAD-${l.id.slice(0, 8).toUpperCase()}`,
              dbId: l.id,
              sourceType: 'lead',
              type: l.lead_type === 'consultation' ? 'Expert Consultation' : l.lead_type === 'bulk_order' ? 'B2B Bulk Lead' : 'Web Lead',
              name: l.name,
              company: l.company || 'Direct Inquiry',
              phone: l.phone,
              email: l.email || '',
              city: l.city || 'Ghaziabad',
              category: l.usage || 'Hardware',
              quantity: '1',
              budget: l.budget || 'Flexible',
              timeline: l.timeline || 'Immediate',
              notes: l.notes || '',
              date: new Date(l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: l.status === 'new' ? 'Pending Review' : l.status,
            });
          });
        }
      } catch (leadErr) {
        console.warn('Leads fetch:', leadErr);
      }

      return results;
    },
    async () => {
      try {
        const raw = localStorage.getItem('computercare_bulk_inquiries');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  );
}

/**
 * Update lead or quotation status
 */
export async function updateAdminInquiryStatus(sourceType, dbIdOrNum, newStatus, staffNotes = '') {
  return await safeDbQuery(
    async (client) => {
      if (sourceType === 'lead') {
        const statusMap = { 'Pending Review': 'new', 'Contacted': 'contacted', 'Approved': 'converted', 'Rejected': 'closed' };
        const mapped = statusMap[newStatus] || newStatus.toLowerCase();
        await client
          .from('leads')
          .update({
            status: mapped,
            notes: staffNotes ? `[Staff Note: ${staffNotes}]` : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', dbIdOrNum);
      } else {
        const statusMap = { 'Pending Review': 'pending', 'Contacted': 'reviewed', 'Approved': 'quoted', 'Rejected': 'rejected' };
        const mapped = statusMap[newStatus] || newStatus.toLowerCase();
        await client
          .from('quotations')
          .update({
            status: mapped,
            notes: staffNotes ? `[Staff Note: ${staffNotes}]` : undefined,
            updated_at: new Date().toISOString(),
          })
          .or(`quotation_number.eq.${dbIdOrNum},id.eq.${dbIdOrNum}`);
      }

      await client.from('audit_logs').insert({
        entity_type: sourceType === 'lead' ? 'lead' : 'quotation',
        entity_id: String(dbIdOrNum),
        action: `status_changed_to_${newStatus}`,
        new_values: { status: newStatus, staffNotes },
      });

      return { success: true };
    },
    async () => {
      return { success: true };
    }
  );
}

/**
 * Fetch customer list for admin
 */
export async function fetchAdminCustomers() {
  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          phone,
          role,
          created_at,
          orders ( id, total_amount, status )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p) => ({
        id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone || 'N/A',
        role: p.role,
        orderCount: p.orders?.length || 0,
        totalSpent: (p.orders || []).reduce((sum, o) => sum + (o.status !== 'cancelled' ? Number(o.total_amount || 0) : 0), 0),
        joinedDate: new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      }));
    },
    async () => {
      return [];
    }
  );
}

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

      // 1. Fetch build_requests (Primary schema table)
      try {
        const { data: builds, error: brErr } = await client
          .from('build_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (brErr) {
          console.warn('[adminService] build_requests fetch error:', brErr);
        } else if (builds) {
          builds.forEach((b) => {
            const isBulk = (b.use_case || '').toLowerCase().includes('bulk') || 
                           (b.use_case || '').toLowerCase().includes('b2b') || 
                           (b.preferences || '').toLowerCase().includes('company:') ||
                           (b.preferences || '').toLowerCase().includes('gstin');

            results.push({
              id: `REQ-${b.id.slice(0, 8).toUpperCase()}`,
              dbId: b.id,
              sourceType: 'build_request',
              type: isBulk ? 'B2B Bulk Order' : (b.use_case || 'Custom PC Request'),
              name: b.name,
              company: isBulk ? 'Corporate / B2B' : 'Direct Customer',
              phone: b.phone,
              email: b.email || '',
              city: 'Ghaziabad',
              category: b.use_case || 'PC Build',
              quantity: isBulk ? 'Bulk' : '1',
              budget: b.budget ? `₹${Number(b.budget).toLocaleString('en-IN')}` : 'Flexible',
              timeline: 'Immediate',
              notes: b.preferences || '',
              date: new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              status: b.status === 'new' ? 'Pending Review' : (b.status === 'contacted' ? 'Contacted' : (b.status === 'quoted' ? 'Approved' : b.status)),
            });
          });
        }
      } catch (brErr) {
        console.warn('build_requests fetch exception:', brErr);
      }

      // 2. Fetch quotations (Optional legacy / secondary table)
      try {
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
      } catch (_qErr) {
        // Table quotations may not exist in standard schema; ignore gracefully
      }

      // 3. Fetch leads (Optional legacy table)
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
      } catch (_leadErr) {
        // Table leads may not exist in standard schema; ignore gracefully
      }

      return results;
    },
    async () => {
      try {
        const loaded = [];
        const rawBulk = localStorage.getItem('computercare_bulk_inquiries');
        if (rawBulk) {
          JSON.parse(rawBulk).forEach(item => {
            loaded.push({
              id: item.refNumber || `B2B-${Math.floor(Math.random() * 90000)}`,
              type: 'B2B Bulk Order',
              name: item.fullName || 'Enterprise Client',
              company: item.companyName || 'N/A',
              phone: item.maskedPhone || item.phone || 'N/A',
              email: item.maskedEmail || item.email || 'N/A',
              city: item.city || 'N/A',
              category: item.category || 'Office PCs',
              quantity: item.quantity || '10+ Units',
              budget: item.budgetRange || 'Flexible',
              timeline: item.timeline || 'Immediate',
              date: item.formattedDate || item.timestamp || 'Recently',
              status: item.adminStatus || 'Pending Review'
            });
          });
        }
        const rawConsult = localStorage.getItem('computercare_pc_consultations');
        if (rawConsult) {
          JSON.parse(rawConsult).forEach(item => {
            loaded.push({
              id: item.refNumber || `TECH-${Math.floor(Math.random() * 90000)}`,
              type: 'PC Consultation / Quote',
              name: item.fullName || 'Client',
              company: 'Individual Customer',
              phone: item.maskedPhone || item.phone || 'N/A',
              email: item.maskedEmail || item.email || 'N/A',
              city: item.city || 'N/A',
              category: item.useCase || 'PC Build',
              quantity: '1',
              budget: item.budget || 'Flexible',
              timeline: item.callTime || 'Immediate',
              date: item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-IN') : 'Recently',
              status: 'Pending Review'
            });
          });
        }
        return loaded;
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
      if (sourceType === 'build_request') {
        const statusMap = {
          'Pending Review': 'new',
          'Contacted': 'contacted',
          'Approved': 'confirmed',
          'Confirmed': 'confirmed',
          'Quoted': 'quoted',
          'Built': 'built',
          'Delivered': 'delivered',
          'Rejected': 'cancelled',
          'Cancelled': 'cancelled'
        };
        const mapped = statusMap[newStatus] || newStatus.toLowerCase();
        await client
          .from('build_requests')
          .update({
            status: mapped,
            notes: staffNotes ? `[Staff Note: ${staffNotes}]` : undefined,
          })
          .eq('id', dbIdOrNum);
      } else if (sourceType === 'lead') {
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

      try {
        await client.from('audit_logs').insert({
          entity_type: sourceType || 'build_request',
          entity_id: String(dbIdOrNum),
          action: `status_changed_to_${newStatus}`,
          new_values: { status: newStatus, staffNotes },
        });
      } catch {
        // Table audit_logs may not exist; ignore
      }

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

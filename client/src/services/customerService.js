import { supabase, isSupabaseConfigured, safeDbQuery } from './supabaseClient.js';

const LOCAL_PROFILE_KEY = 'computercare_customer_profile';
const LOCAL_ADDRESSES_KEY = 'computercare_customer_addresses';

/**
 * Fetch customer profile
 */
export async function getCustomerProfile(userId) {
  if (!userId) return null;

  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    async () => {
      try {
        const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
  );
}

/**
 * Update customer profile (name, phone)
 */
export async function updateCustomerProfile(userId, { fullName, phone }) {
  if (!userId) return { error: new Error('User ID required') };

  const updates = {
    full_name: fullName.trim(),
    phone: phone ? phone.trim() : null,
    updated_at: new Date().toISOString(),
  };

  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      try {
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return { data, error: null };
    },
    async () => {
      try {
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify({ id: userId, ...updates }));
        return { data: { id: userId, ...updates }, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }
  );
}

/**
 * Fetch saved customer addresses
 */
export async function getCustomerAddresses(userId) {
  if (!userId) return [];

  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('customer_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    async () => {
      try {
        const raw = localStorage.getItem(LOCAL_ADDRESSES_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  );
}

/**
 * Save / Add customer address
 */
export async function saveCustomerAddress(userId, address) {
  if (!userId) return null;

  const row = {
    user_id: userId,
    recipient_name: address.recipientName,
    phone: address.phone,
    alternate_phone: address.alternatePhone || null,
    street_address: address.streetAddress,
    landmark: address.landmark || null,
    city: address.city || 'Ghaziabad',
    state: address.state || 'Uttar Pradesh',
    postal_code: address.postalCode,
    is_default: Boolean(address.isDefault),
  };

  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('customer_addresses')
        .insert(row)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    async () => {
      try {
        const raw = localStorage.getItem(LOCAL_ADDRESSES_KEY);
        const existing = raw ? JSON.parse(raw) : [];
        const newAddress = { id: `addr_${Date.now()}`, ...row };
        existing.push(newAddress);
        localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(existing));
        return newAddress;
      } catch {
        return null;
      }
    }
  );
}

/**
 * Fetch customer orders
 */
export async function getCustomerOrders(userId, userEmail) {
  return await safeDbQuery(
    async (client) => {
      let query = client
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          created_at,
          order_items (
            product_name,
            quantity,
            total_price,
            item_type
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (userEmail) {
        query = query.eq('customer_email', userEmail);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
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
 * Fetch customer saved builds
 */
export async function getCustomerSavedBuilds(userId) {
  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('pc_configurations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    async () => {
      try {
        const raw = localStorage.getItem('computercare_saved_builds');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Object.values(parsed);
      } catch {
        return [];
      }
    }
  );
}

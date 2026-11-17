import { supabase, safeDbQuery } from './supabaseClient';

const OVERRIDES_STORAGE_KEY = 'computercare_stock_overrides';

/**
 * Fetch product overrides (price, mrp, stock, availability)
 */
export async function getProductOverrides() {
  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('products')
        .select('id, price, mrp, stock_quantity, is_active, is_featured');
      if (error) throw error;

      const map = {};
      (data || []).forEach((p) => {
        map[p.id] = {
          price: p.price,
          mrp: p.mrp,
          stock: p.stock_quantity,
          isFeatured: p.is_featured,
        };
      });
      return map;
    },
    async () => {
      try {
        return JSON.parse(localStorage.getItem(OVERRIDES_STORAGE_KEY) || '{}');
      } catch {
        return {};
      }
    }
  );
}

/**
 * Save product price, stock or visibility edit
 */
export async function saveProductOverride(productId, { price, mrp, stock, isFeatured }) {
  const payload = {
    price: Number(price) || 0,
    mrp: Number(mrp) || 0,
    stock: Number(stock) || 0,
    isFeatured: Boolean(isFeatured),
  };

  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('products')
        .update({
          price: payload.price,
          mrp: payload.mrp,
          stock_quantity: payload.stock,
          is_featured: payload.isFeatured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      // Also update local cache
      saveToLocalOverrides(productId, payload);
      return data;
    },
    async () => {
      return saveToLocalOverrides(productId, payload);
    }
  );
}

function saveToLocalOverrides(productId, payload) {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[productId] = payload;
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(existing));
    return existing;
  } catch (err) {
    console.warn('LocalStorage save failed for product override:', err);
    return null;
  }
}

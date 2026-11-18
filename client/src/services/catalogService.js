import { supabase, isSupabaseConfigured, safeDbQuery } from './supabaseClient.js';

const OVERRIDES_STORAGE_KEY = 'computercare_stock_overrides';

/**
 * Normalizes a database product row into standard frontend product shape
 */
function normalizeDbProduct(row) {
  if (!row) return null;
  return {
    id: row.legacy_id || row.id,
    dbId: row.id,
    title: row.name,
    handle: row.handle,
    vendor: row.brands?.name || row.vendor || 'Computer Care',
    category: row.category_key || row.category,
    price: Number(row.selling_price ?? row.price) || 0,
    compare_at_price: Number(row.mrp_price ?? row.compare_at_price) || Number(row.selling_price ?? row.price) || 0,
    available: row.is_available !== false,
    sku: row.sku,
    image: row.product_images?.[0]?.image_url || `/images/products/${row.category_key || 'case'}/default.jpg`,
    description: row.description || '',
    specs: row.product_specifications?.additional_specs || {},
    stock_quantity: row.product_inventory?.stock_quantity ?? 10,
  };
}

/**
 * Hybrid Catalog Fetcher:
 * 1. Attempts Supabase query first with server-side filtering and pagination.
 * 2. Seamlessly falls back to static JSON files if Supabase is unavailable or offline.
 */
export async function fetchCategoryProducts(categoryKey = 'all', {
  page = 1,
  limit = 40,
  search = '',
  brand = '',
  minPrice = 0,
  maxPrice = Infinity,
  inStockOnly = false,
} = {}) {
  // 1. Try Supabase query
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          legacy_id,
          sku,
          name,
          handle,
          category_key,
          description,
          selling_price,
          mrp_price,
          is_available,
          brands ( name ),
          product_inventory ( stock_quantity, reserved_quantity )
        `, { count: 'exact' });

      if (categoryKey && categoryKey !== 'all') {
        query = query.eq('category_key', categoryKey);
      }

      if (search && search.trim()) {
        const cleanSearch = search.trim();
        query = query.or(`name.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`);
      }

      if (minPrice > 0) {
        query = query.gte('selling_price', minPrice);
      }

      if (maxPrice < Infinity && maxPrice > 0) {
        query = query.lte('selling_price', maxPrice);
      }

      if (inStockOnly) {
        query = query.eq('is_available', true);
      }

      const offset = (page - 1) * limit;
      query = query.order('selling_price', { ascending: true }).range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (!error && data && data.length > 0) {
        let products = data.map(normalizeDbProduct);
        if (brand && brand.trim()) {
          const brandLower = brand.toLowerCase().trim();
          products = products.filter((p) => p.vendor.toLowerCase().includes(brandLower));
        }

        return {
          products,
          totalCount: count ?? products.length,
          page,
          totalPages: Math.ceil((count ?? products.length) / limit),
          source: 'supabase',
        };
      }
    } catch (err) {
      console.warn('[CatalogService] Supabase catalog read fallback to static JSON:', err);
    }
  }

  // 2. Static JSON fallback
  try {
    let items = [];
    if (categoryKey && categoryKey !== 'all') {
      const resp = await fetch(`/data/categories/${categoryKey}.json`);
      if (resp.ok) {
        items = await resp.json();
      }
    } else {
      const resp = await fetch('/data/products.json');
      if (resp.ok) {
        const allData = await resp.json();
        Object.values(allData).forEach((catItems) => {
          if (Array.isArray(catItems)) items.push(...catItems);
        });
      }
    }

    // Apply client-side filters
    let filtered = items;

    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(s)) ||
          (p.vendor && p.vendor.toLowerCase().includes(s)) ||
          (p.description && p.description.toLowerCase().includes(s))
      );
    }

    if (brand && brand.trim()) {
      const b = brand.toLowerCase().trim();
      filtered = filtered.filter((p) => p.vendor && p.vendor.toLowerCase().includes(b));
    }

    if (minPrice > 0) {
      filtered = filtered.filter((p) => (Number(p.price) || 0) >= minPrice);
    }

    if (maxPrice < Infinity && maxPrice > 0) {
      filtered = filtered.filter((p) => (Number(p.price) || 0) <= maxPrice);
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.available !== false);
    }

    const totalCount = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      products: paginated,
      totalCount,
      page,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      source: 'static',
    };
  } catch (staticErr) {
    console.error('[CatalogService] Failed to load static catalog:', staticErr);
    return {
      products: [],
      totalCount: 0,
      page: 1,
      totalPages: 1,
      source: 'error',
    };
  }
}

/**
 * Universal Search Catalog
 */
export async function searchCatalog(options) {
  return await fetchCategoryProducts(options.category || 'all', options);
}

/**
 * Fetch product overrides (price, mrp, stock, availability)
 */
export async function getProductOverrides() {
  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('products')
        .select('id, legacy_id, selling_price, mrp_price, is_available, is_featured, product_inventory ( stock_quantity )');
      if (error) throw error;

      const map = {};
      (data || []).forEach((p) => {
        const key = p.legacy_id || p.id;
        map[key] = {
          price: p.selling_price,
          mrp: p.mrp_price,
          stock: p.product_inventory?.stock_quantity ?? 10,
          isAvailable: p.is_available,
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
export async function saveProductOverride(productId, { price, mrp, stock, isFeatured, isAvailable }) {
  const payload = {
    price: Number(price) || 0,
    mrp: Number(mrp) || 0,
    stock: Number(stock) || 0,
    isFeatured: Boolean(isFeatured),
    isAvailable: isAvailable !== false,
  };

  return await safeDbQuery(
    async (client) => {
      // 1. Update product selling price and MRP
      const { data, error } = await client
        .from('products')
        .update({
          selling_price: payload.price,
          mrp_price: payload.mrp,
          is_featured: payload.isFeatured,
          is_available: payload.isAvailable,
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${productId},legacy_id.eq.${productId}`)
        .select()
        .maybeSingle();

      if (error) throw error;

      // 2. Update inventory if product exists
      if (data?.id) {
        await client
          .from('product_inventory')
          .upsert({
            product_id: data.id,
            stock_quantity: payload.stock,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'product_id' });

        // 3. Log Audit
        await client
          .from('audit_logs')
          .insert({
            entity_type: 'product',
            entity_id: String(data.id),
            action: 'price_or_stock_override',
            new_values: payload,
          });
      }

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

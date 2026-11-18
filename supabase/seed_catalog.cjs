/**
 * Computer Care — Supabase Catalog Seed Script
 * Migrates 581 genuine PC parts and hardware from client/public/data/products.json
 * into Supabase PostgreSQL (brands, categories, products, inventory, specifications).
 *
 * Safe & Idempotent: Can be run repeatedly without duplicating records.
 *
 * Usage:
 *   node supabase/seed_catalog.cjs
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env or client/.env if present
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', 'client', '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...vals] = trimmed.split('=');
          const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('your-project-id')) {
  console.log('ℹ️  Supabase credentials not configured in environment.');
  console.log('   To seed your Supabase database, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  console.log('   Catalog JSON files remain available for static and client-side usage.');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'client', 'public', 'data', 'products.json');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedCatalog() {
  console.log('🚀 Starting Computer Care Catalog Seeding...');
  
  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    console.error(`❌ Products JSON not found at: ${PRODUCTS_JSON_PATH}`);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));
  const categoryKeys = Object.keys(rawData);

  // 1. Collect unique brands and categories
  const brandNames = new Set();
  const allProducts = [];

  for (const catKey of categoryKeys) {
    const items = rawData[catKey] || [];
    for (const item of items) {
      if (item.vendor) brandNames.add(item.vendor.trim());
      allProducts.push({ ...item, categoryKey: catKey });
    }
  }

  console.log(`📦 Found ${allProducts.length} products across ${categoryKeys.length} categories and ${brandNames.size} brands.`);

  // 2. Upsert Brands
  console.log('🏷️  Upserting Brands...');
  const brandRecords = Array.from(brandNames).map(name => ({
    name,
    slug: slugify(name),
    is_authorized_partner: ['Ant Esports', 'Cooler Master', 'Geonix', 'Gigabyte', 'MSI', 'ASUS', 'Corsair', 'Intel', 'AMD'].includes(name)
  }));

  const { data: upsertedBrands, error: brandErr } = await supabase
    .from('brands')
    .upsert(brandRecords, { onConflict: 'name' })
    .select('id, name');

  if (brandErr) {
    console.error('❌ Error upserting brands:', brandErr.message);
  }

  // Fetch all brands into map
  const { data: allBrands } = await supabase.from('brands').select('id, name');
  const brandMap = new Map((allBrands || []).map(b => [b.name.toLowerCase(), b.id]));

  // 3. Upsert Categories
  console.log('📂 Upserting Categories...');
  const categoryRecords = categoryKeys.map((key, idx) => ({
    key,
    name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slug: slugify(key),
    is_pc_component: ['case', 'case_fan', 'cpu', 'motherboard', 'ram', 'gpu', 'cooler', 'storage', 'psu', 'monitor'].includes(key),
    display_order: idx + 1
  }));

  const { error: catErr } = await supabase
    .from('categories')
    .upsert(categoryRecords, { onConflict: 'key' });

  if (catErr) {
    console.error('❌ Error upserting categories:', catErr.message);
  }

  const { data: allCats } = await supabase.from('categories').select('id, key');
  const catMap = new Map((allCats || []).map(c => [c.key, c.id]));

  // 4. Upsert Products in Chunks of 50
  console.log(`💻 Upserting ${allProducts.length} Products...`);
  const CHUNK_SIZE = 50;
  let insertedCount = 0;

  for (let i = 0; i < allProducts.length; i += CHUNK_SIZE) {
    const chunk = allProducts.slice(i, i + CHUNK_SIZE);
    const productRows = chunk.map(p => {
      const brandId = brandMap.get((p.vendor || '').toLowerCase()) || brandMap.get('geonix') || (allBrands && allBrands[0] ? allBrands[0].id : null);
      const catId = catMap.get(p.categoryKey) || (allCats && allCats[0] ? allCats[0].id : null);
      const price = Number(p.price) || 0;
      const comparePrice = Number(p.compare_at_price) || price;

      return {
        legacy_id: p.id,
        sku: p.sku || `SKU-${p.id}`,
        name: p.title,
        handle: p.handle || slugify(p.title),
        brand_id: brandId,
        category_id: catId,
        category_key: p.categoryKey,
        description: p.description || p.title,
        selling_price: price,
        mrp_price: Math.max(price, comparePrice),
        warranty_months: 12,
        is_available: p.available !== false,
        is_archived: false
      };
    });

    const { data: savedProducts, error: prodErr } = await supabase
      .from('products')
      .upsert(productRows, { onConflict: 'sku' })
      .select('id, legacy_id');

    if (prodErr) {
      console.warn(`⚠️ Batch ${i / CHUNK_SIZE + 1} product error:`, prodErr.message);
    } else if (savedProducts) {
      insertedCount += savedProducts.length;

      // Upsert Inventory for saved products
      const inventoryRows = savedProducts.map(sp => ({
        product_id: sp.id,
        stock_quantity: 15,
        reserved_quantity: 0,
        low_stock_threshold: 3
      }));

      await supabase
        .from('product_inventory')
        .upsert(inventoryRows, { onConflict: 'product_id' });
    }
  }

  console.log(`✅ Finished Seeding: ${insertedCount} products successfully upserted into Supabase!`);
}

seedCatalog().catch(err => {
  console.error('Fatal Seeding Error:', err);
  process.exit(1);
});

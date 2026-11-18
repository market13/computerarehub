import { supabase, isSupabaseConfigured, safeDbQuery } from './supabaseClient.js';

const LOCAL_STORAGE_KEY = 'computercare_saved_quotations';

export function generateQuoteNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CC-QT-${dateStr}-${randomSuffix}`;
}

/**
 * Save a custom PC build or consultation quote
 */
export async function saveBuildQuote({
  customerName = 'Guest Builder',
  customerPhone = '',
  customerEmail = '',
  city = 'Ghaziabad',
  intendedUsage = 'Gaming & Creator Workstation',
  build = {},
  totalPrice = 0,
  estimatedWattage = 0,
  notes = '',
  inquiryType = 'custom_pc',
}) {
  const quotationNumber = generateQuoteNumber();

  const record = {
    quotation_number: quotationNumber,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail || 'enquiry@computercaregzb.com',
    city: city || 'Ghaziabad',
    intended_usage: intendedUsage,
    budget_range: `₹${totalPrice.toLocaleString('en-IN')}`,
    quoted_subtotal: Number(totalPrice) || 0,
    status: 'pending',
    notes: `${notes ? notes + ' | ' : ''}Power: ~${estimatedWattage}W | Parts: ${Object.keys(build).length}`,
    created_at: new Date().toISOString(),
    items: build,
  };

  return await safeDbQuery(
    async (client) => {
      // 1. Insert into quotations table
      const { data, error } = await client
        .from('quotations')
        .insert({
          quotation_number: record.quotation_number,
          inquiry_type: inquiryType,
          customer_name: record.customer_name,
          customer_phone: record.customer_phone,
          customer_email: record.customer_email,
          city: record.city,
          intended_usage: record.intended_usage,
          budget_range: record.budget_range,
          quoted_subtotal: record.quoted_subtotal,
          notes: record.notes,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return { quotationNumber, record: data };
    },
    async () => {
      // Offline / LocalStorage fallback
      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        existing.unshift(record);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return { quotationNumber, record };
    }
  );
}

/**
 * Format a quote message for WhatsApp
 */
export function formatWhatsAppQuoteText(build, totalPrice, estimatedWattage, quoteNumber = null) {
  const slots = [
    { key: 'case', label: 'PC Cabinet' },
    { key: 'case_fan', label: 'Cooling Fans' },
    { key: 'cpu', label: 'CPU' },
    { key: 'motherboard', label: 'Motherboard' },
    { key: 'ram', label: 'RAM' },
    { key: 'gpu', label: 'Graphics Card' },
    { key: 'cooler', label: 'Cooler / AIO' },
    { key: 'storage', label: 'Storage (SSD)' },
    { key: 'psu', label: 'Power Supply' },
    { key: 'monitor', label: 'Monitor' },
  ];

  const itemsList = slots
    .map((slot) => {
      const part = build[slot.key];
      if (!part) return null;
      return `• ${slot.label}: ${part.title} (₹${(part.price || 0).toLocaleString('en-IN')})`;
    })
    .filter(Boolean)
    .join('\n');

  let text = `Hi Computer Care, I configured a custom PC build on computercaregzb.com:\n`;
  if (quoteNumber) {
    text += `*Quotation Ref:* ${quoteNumber}\n\n`;
  } else {
    text += `\n`;
  }
  text += `${itemsList}\n\n`;
  text += `*Total Estimated Price:* ₹${Number(totalPrice).toLocaleString('en-IN')}\n`;
  text += `*Estimated Power:* ~${estimatedWattage}W\n`;
  text += `Store: Computer Care, G 23 Shiva Tower, Ghaziabad\n`;
  text += `Please verify component availability and provide your best offer.`;

  return text;
}

/**
 * Retrieve all quotes for Admin review
 */
export async function getStoredQuotes() {
  return await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    async () => {
      try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      } catch {
        return [];
      }
    }
  );
}

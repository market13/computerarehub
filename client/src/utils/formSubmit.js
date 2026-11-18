import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { STORE_PHONE } from '../constants/storeInfo.js';

/**
 * Builds a direct WhatsApp contact URL with pre-filled message
 * @param {string} message - Text message
 * @returns {string} WhatsApp URL
 */
export function getWhatsAppFallbackUrl(message) {
  const cleanPhone = (STORE_PHONE || '919810550222').replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Universal Form Submitter
 * 1. Attempts direct insertion into Supabase (leads / quotations table) with RLS.
 * 2. If Supabase is unconfigured or insertion fails, falls back to Netlify Forms POST.
 * 3. If both fail (e.g. hosted on Cloudflare Pages without Supabase), throws a descriptive
 *    error with WhatsApp fallback details so customer inquiries are never silently lost.
 *
 * @param {string} formName - Form identifier ('expert-consultation', 'bulk-order', 'cart-checkout', etc.)
 * @param {Record<string, any>} data - Key-value pair payload
 * @returns {Promise<{ success: boolean, provider: 'supabase' | 'netlify' }>}
 */
export async function submitForm(formName, data) {
  let supabaseError = null;

  // 1. Attempt Supabase direct submission if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      if (formName === 'expert-consultation') {
        const leadPayload = {
          lead_type: 'consultation',
          name: data.fullName || data.name || 'Consultation Request',
          phone: data.phone || '',
          email: data.email || null,
          city: data.city || 'Ghaziabad',
          usage: data.useCase || data.usage || null,
          budget: data.budget ? String(data.budget) : null,
          notes: `Call Time: ${data.callTime || 'Anytime'}${data.notes ? ' | Notes: ' + data.notes : ''}`,
          raw_data: data,
          status: 'new',
        };

        const { error } = await supabase.from('leads').insert(leadPayload);
        if (!error) {
          return { success: true, provider: 'supabase' };
        }
        // If leads table does not exist or fails, try quotations
        const quotePayload = {
          quotation_number: data.refNumber || `CC-CALL-${Math.floor(100000 + Math.random() * 900000)}`,
          inquiry_type: 'consultation',
          customer_name: data.fullName || data.name || 'Consultation Request',
          customer_phone: data.phone || '',
          customer_email: data.email || 'enquiry@computercaregzb.com',
          city: data.city || 'Ghaziabad',
          intended_usage: data.useCase || data.usage || 'General Consultation',
          budget_range: data.budget ? String(data.budget) : 'Flexible',
          notes: `Call Time: ${data.callTime || 'Anytime'}${data.notes ? ' | Notes: ' + data.notes : ''}`,
          status: 'pending',
        };
        const { error: quoteErr } = await supabase.from('quotations').insert(quotePayload);
        if (!quoteErr) {
          return { success: true, provider: 'supabase' };
        }
        supabaseError = quoteErr;
      } else if (formName === 'bulk-order') {
        const leadPayload = {
          lead_type: 'bulk_order',
          name: data.fullName || data.name || 'B2B Inquiry',
          phone: data.phone || '',
          email: data.email || null,
          company: data.companyName || data.company || null,
          city: data.city || 'Ghaziabad',
          state: data.state || null,
          gstin: data.gstin || null,
          budget: data.budgetRange || data.budget ? String(data.budgetRange || data.budget) : null,
          timeline: data.timeline || null,
          notes: `Category: ${data.category || 'Hardware'} | Qty: ${data.quantity || 'N/A'}${data.requirements ? ' | ' + data.requirements : ''}`,
          raw_data: data,
          status: 'new',
        };

        const { error } = await supabase.from('leads').insert(leadPayload);
        if (!error) {
          return { success: true, provider: 'supabase' };
        }

        const quotePayload = {
          quotation_number: data.refNumber || `CC-B2B-${Math.floor(100000 + Math.random() * 900000)}`,
          inquiry_type: 'b2b_bulk',
          customer_name: data.fullName || data.name || 'B2B Inquiry',
          company_name: data.companyName || data.company || null,
          customer_phone: data.phone || '',
          customer_email: data.email || 'enquiry@computercaregzb.com',
          city: data.city || 'Ghaziabad',
          state: data.state || null,
          gstin: data.gstin || null,
          budget_range: data.budgetRange || data.budget ? String(data.budgetRange || data.budget) : null,
          timeline: data.timeline || null,
          notes: `Category: ${data.category || 'Hardware'} | Qty: ${data.quantity || 'N/A'}${data.requirements ? ' | ' + data.requirements : ''}`,
          status: 'pending',
        };
        const { error: quoteErr } = await supabase.from('quotations').insert(quotePayload);
        if (!quoteErr) {
          return { success: true, provider: 'supabase' };
        }
        supabaseError = quoteErr;
      } else {
        // Generic fallback into leads
        const { error } = await supabase.from('leads').insert({
          lead_type: 'other',
          name: data.fullName || data.name || 'Web Inquiry',
          phone: data.phone || '',
          email: data.email || null,
          city: data.city || 'Ghaziabad',
          notes: data.notes || JSON.stringify(data),
          raw_data: data,
          status: 'new',
        });
        if (!error) {
          return { success: true, provider: 'supabase' };
        }
        supabaseError = error;
      }
    } catch (err) {
      supabaseError = err;
    }
  }

  // 2. Fallback to Netlify Forms POST
  try {
    const params = new URLSearchParams();
    params.append('form-name', formName);

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      body: params.toString(),
    });

    // Netlify Forms returns 200, 302, 303, or 204 on success
    if (response.ok || response.status === 302 || response.status === 303 || response.status === 204) {
      return { success: true, provider: 'netlify' };
    }
  } catch (netErr) {
    console.warn('[FormSubmit] Netlify forms submission fallback failed:', netErr);
  }

  // 3. Both failed
  const errorMsg = 'Could not submit form online. Please reach out to us directly on WhatsApp.';
  const waMessage = `Hi Computer Care, I attempted to submit the "${formName}" form on computercaregzb.com:\n` +
    `Name: ${data.fullName || data.name || 'Customer'}\n` +
    `Phone: ${data.phone || ''}\n` +
    `Details: ${data.notes || data.requirements || data.useCase || ''}`;

  const submissionError = new Error(errorMsg);
  submissionError.supabaseError = supabaseError;
  submissionError.whatsAppUrl = getWhatsAppFallbackUrl(waMessage);
  throw submissionError;
}

/**
 * Backward compatibility alias for submitForm
 */
export const submitToNetlify = submitForm;

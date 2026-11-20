import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { STORE_PHONE, CONTACT_EMAIL } from '../constants/storeInfo.js';

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
 * Builds a direct mailto URL to support@computercaregzb.com
 * @param {string} subject - Email subject
 * @param {string} body - Email body text
 * @returns {string} mailto URL
 */
export function getMailtoFallbackUrl(subject, body) {
  const email = (CONTACT_EMAIL || 'support@computercaregzb.com').trim();
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Sends structured inquiry email directly to support@computercaregzb.com via FormSubmit AJAX
 * @param {string} formName
 * @param {Record<string, any>} data
 * @returns {Promise<boolean>}
 */
async function dispatchEmailInquiry(formName, data) {
  const recipient = (CONTACT_EMAIL || 'support@computercaregzb.com').trim();
  const refCode = data.refNumber || `CC-${Date.now().toString(36).toUpperCase()}`;
  const customerName = data.fullName || data.name || data.companyName || 'Valued Customer';
  const customerPhone = data.phone || 'Not provided';
  const customerEmail = data.email || 'Not provided';

  let subject = `[Computer Care Inquiry: ${formName}] ${customerName}`;
  if (formName === 'expert-consultation') {
    subject = `[PC Recommendation Request] ${customerName} (${customerPhone}) - ${data.budget || 'Custom Budget'}`;
  } else if (formName === 'bulk-order') {
    subject = `[B2B Bulk Order Inquiry] ${data.companyName || customerName} (${customerPhone})`;
  } else if (formName === 'cart-checkout') {
    subject = `[Order Request] ${customerName} (${customerPhone}) - Ref #${refCode}`;
  }

  const payload = {
    _subject: subject,
    _template: 'table',
    _captcha: 'false',
    'Reference ID': refCode,
    'Inquiry Type': formName,
    'Customer Name': customerName,
    'Phone / WhatsApp': customerPhone,
    'Customer Email': customerEmail,
    'City': data.city || 'Ghaziabad',
    ...(data.state ? { 'State': data.state } : {}),
    ...(data.companyName ? { 'Company': data.companyName } : {}),
    ...(data.gstin ? { 'GSTIN': data.gstin } : {}),
    ...(data.useCase ? { 'PC Purpose': data.useCase } : {}),
    ...(data.budget ? { 'Target Budget': String(data.budget) } : {}),
    ...(data.budgetRange ? { 'Budget Range': String(data.budgetRange) } : {}),
    ...(data.preferredBrand ? { 'Preferred Platform / Brand': data.preferredBrand } : {}),
    ...(data.callTime ? { 'Preferred Call Time': data.callTime } : {}),
    ...(data.category ? { 'Category': data.category } : {}),
    ...(data.quantity ? { 'Quantity': String(data.quantity) } : {}),
    ...(data.timeline ? { 'Timeline': data.timeline } : {}),
    ...(data.requirements ? { 'Requirements': data.requirements } : {}),
    ...(data.notes ? { 'Customer Notes': data.notes } : {}),
    'Submission Time (IST)': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    'Website': 'https://computercaregzb.com',
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (err) {
    console.warn('[FormSubmit] Email delivery error:', err);
    return false;
  }
}

/**
 * Universal Form Submitter
 * 1. Dispatches structured email alert directly to support@computercaregzb.com.
 * 2. Attempts direct insertion into Supabase (leads / quotations table) with RLS.
 * 3. Falls back to Netlify Forms POST if available.
 * 4. If all fail, throws a descriptive error with WhatsApp & mailto fallback links.
 *
 * @param {string} formName - Form identifier ('expert-consultation', 'bulk-order', 'cart-checkout', etc.)
 * @param {Record<string, any>} data - Key-value pair payload
 * @returns {Promise<{ success: boolean, provider: 'email' | 'supabase' | 'netlify' }>}
 */
export async function submitForm(formName, data) {
  let emailDispatched = false;
  let supabaseSuccess = false;
  let netlifySuccess = false;
  let supabaseError = null;

  // 1. Dispatch Email directly to support@computercaregzb.com
  try {
    emailDispatched = await dispatchEmailInquiry(formName, data);
  } catch (e) {
    console.warn('[FormSubmit] Email dispatch failed:', e);
  }

  // 2. Attempt Supabase direct submission if configured
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
          supabaseSuccess = true;
        } else {
          // If leads table does not exist or fails, try quotations
          const quotePayload = {
            quotation_number: data.refNumber || `CC-CALL-${Math.floor(100000 + Math.random() * 900000)}`,
            inquiry_type: 'consultation',
            customer_name: data.fullName || data.name || 'Consultation Request',
            customer_phone: data.phone || '',
            customer_email: data.email || CONTACT_EMAIL,
            city: data.city || 'Ghaziabad',
            intended_usage: data.useCase || data.usage || 'General Consultation',
            budget_range: data.budget ? String(data.budget) : 'Flexible',
            notes: `Call Time: ${data.callTime || 'Anytime'}${data.notes ? ' | Notes: ' + data.notes : ''}`,
            status: 'pending',
          };
          const { error: quoteErr } = await supabase.from('quotations').insert(quotePayload);
          if (!quoteErr) {
            supabaseSuccess = true;
          } else {
            supabaseError = quoteErr;
          }
        }
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
          supabaseSuccess = true;
        } else {
          const quotePayload = {
            quotation_number: data.refNumber || `CC-B2B-${Math.floor(100000 + Math.random() * 900000)}`,
            inquiry_type: 'b2b_bulk',
            customer_name: data.fullName || data.name || 'B2B Inquiry',
            company_name: data.companyName || data.company || null,
            customer_phone: data.phone || '',
            customer_email: data.email || CONTACT_EMAIL,
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
            supabaseSuccess = true;
          } else {
            supabaseError = quoteErr;
          }
        }
      } else {
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
          supabaseSuccess = true;
        } else {
          supabaseError = error;
        }
      }
    } catch (err) {
      supabaseError = err;
    }
  }

  // 3. Fallback to Netlify Forms POST
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

    if (response.ok || response.status === 302 || response.status === 303 || response.status === 204) {
      netlifySuccess = true;
    }
  } catch (netErr) {
    console.warn('[FormSubmit] Netlify forms submission fallback failed:', netErr);
  }

  // If any delivery channel succeeded:
  if (emailDispatched || supabaseSuccess || netlifySuccess) {
    return {
      success: true,
      provider: emailDispatched ? 'email' : (supabaseSuccess ? 'supabase' : 'netlify'),
      emailDispatched,
      supabaseSuccess,
    };
  }

  // 4. All failed
  const errorMsg = 'Could not submit form online. Please reach out directly via WhatsApp or Email.';
  const waMessage = `Hi Computer Care, I attempted to submit the "${formName}" form on computercaregzb.com:\n` +
    `Name: ${data.fullName || data.name || 'Customer'}\n` +
    `Phone: ${data.phone || ''}\n` +
    `Details: ${data.notes || data.requirements || data.useCase || ''}`;

  const submissionError = new Error(errorMsg);
  submissionError.supabaseError = supabaseError;
  submissionError.whatsAppUrl = getWhatsAppFallbackUrl(waMessage);
  submissionError.mailtoUrl = getMailtoFallbackUrl(
    `Inquiry: ${formName} from ${data.fullName || data.name || 'Customer'}`,
    `Name: ${data.fullName || data.name || ''}\nPhone: ${data.phone || ''}\nCity: ${data.city || ''}\nMessage: ${data.notes || data.requirements || data.useCase || ''}`
  );
  throw submissionError;
}

/**
 * Backward compatibility alias for submitForm
 */
export const submitToNetlify = submitForm;

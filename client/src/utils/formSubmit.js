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

  // 2. Attempt Supabase direct submission into build_requests table
  if (isSupabaseConfigured() && supabase) {
    try {
      // Helper to parse numeric budget safely for PostgreSQL numeric column
      let numBudget = null;
      const rawBudget = data.budget || data.budgetRange || data.totalPrice || data.totalAmount;
      if (typeof rawBudget === 'number' && !isNaN(rawBudget)) {
        numBudget = Math.round(rawBudget);
      } else if (typeof rawBudget === 'string') {
        const numbers = rawBudget.replace(/,/g, '').match(/\d+/g);
        if (numbers && numbers.length > 0) {
          if (numbers.length >= 2) {
            numBudget = Math.round((parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2);
          } else {
            numBudget = Math.round(parseFloat(numbers[0]));
          }
        }
      }

      if (formName === 'expert-consultation') {
        const useCaseMap = {
          gaming: 'Gaming',
          rendering: '3D VFX / Rendering',
          editing: 'Video Editing',
          office: 'Office / Productivity',
          coding: 'Programming / DevOps',
          deeplearning: 'AI & Deep Learning',
          student: 'Student / Home Study',
        };
        const mappedUseCase = useCaseMap[data.useCase] || (data.useCase ? String(data.useCase) : 'Gaming');

        const prefParts = [
          data.budget ? `Budget: ${data.budget}` : '',
          data.city ? `City: ${data.city}` : '',
          data.callTime ? `Call Time: ${data.callTime}` : '',
          data.preferredBrand ? `Platform: ${data.preferredBrand}` : '',
          data.notes ? `Notes: ${data.notes}` : '',
          data.refNumber ? `Ref: ${data.refNumber}` : ''
        ].filter(Boolean);

        const buildPayload = {
          name: data.fullName || data.name || 'Consultation Request',
          phone: data.phone || '',
          email: data.email || null,
          budget: numBudget,
          use_case: mappedUseCase,
          preferences: prefParts.join(' | ') || 'Consultation Callback Request',
          status: 'new'
        };

        // Note: NO .select() because RLS allows INSERT ONLY for anon
        const { error } = await supabase.from('build_requests').insert([buildPayload]);
        if (!error) {
          supabaseSuccess = true;
        } else {
          console.warn('[FormSubmit] build_requests insert error:', error);
          supabaseError = error;
        }
      } else if (formName === 'bulk-order') {
        const prefParts = [
          data.companyName ? `Company: ${data.companyName}` : '',
          data.gstin ? `GSTIN: ${data.gstin}` : '',
          data.category ? `Category: ${data.category}` : '',
          data.quantity ? `Qty: ${data.quantity}` : '',
          data.city ? `City: ${data.city}` : '',
          data.state ? `State: ${data.state}` : '',
          data.timeline ? `Timeline: ${data.timeline}` : '',
          data.requirements ? `Requirements: ${data.requirements}` : '',
          data.refNumber ? `Ref: ${data.refNumber}` : ''
        ].filter(Boolean);

        const buildPayload = {
          name: data.fullName || data.name || (data.companyName ? `${data.companyName} (Contact)` : 'B2B Inquiry'),
          phone: data.phone || '',
          email: data.email || null,
          budget: numBudget,
          use_case: 'B2B / Bulk Order',
          preferences: prefParts.join(' | ') || 'Bulk Hardware Inquiry',
          status: 'new'
        };

        const { error } = await supabase.from('build_requests').insert([buildPayload]);
        if (!error) {
          supabaseSuccess = true;
        } else {
          console.warn('[FormSubmit] build_requests insert error:', error);
          supabaseError = error;
        }
      } else if (formName === 'cart-checkout') {
        const prefParts = [
          data.itemsCount ? `Items: ${data.itemsCount}` : '',
          data.city ? `City: ${data.city}` : '',
          data.address ? `Address: ${data.address}` : '',
          data.pincode ? `Pincode: ${data.pincode}` : '',
          data.refNumber ? `Ref: ${data.refNumber}` : ''
        ].filter(Boolean);

        const buildPayload = {
          name: data.fullName || data.name || 'Store Customer',
          phone: data.phone || '',
          email: data.email || null,
          budget: numBudget,
          use_case: 'Hardware Order',
          preferences: prefParts.join(' | ') || 'Online Order Checkout',
          status: 'new'
        };

        const { error } = await supabase.from('build_requests').insert([buildPayload]);
        if (!error) {
          supabaseSuccess = true;
        } else {
          console.warn('[FormSubmit] build_requests insert error:', error);
          supabaseError = error;
        }
      } else {
        const buildPayload = {
          name: data.fullName || data.name || 'Website Inquiry',
          phone: data.phone || '',
          email: data.email || null,
          budget: numBudget,
          use_case: 'General Inquiry',
          preferences: `Form: ${formName} | ${data.notes || data.message || JSON.stringify(data)}`,
          status: 'new'
        };
        const { error } = await supabase.from('build_requests').insert([buildPayload]);
        if (!error) {
          supabaseSuccess = true;
        } else {
          supabaseError = error;
        }
      }
    } catch (err) {
      console.warn('[FormSubmit] Exception inserting into build_requests:', err);
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

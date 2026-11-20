import { CONTACT_EMAIL, STORE_PHONE, STORE_NAME } from '../constants/storeInfo.js';

/**
 * Sends store notification when a new order request or quotation arrives.
 * 1. Checks if CONTACT_EMAIL is configured (TODO: verified store address on computercaregzb.com).
 * 2. If configured, dispatches an alert payload to serverless notification endpoint.
 * 3. Provides formatted WhatsApp merchant ping link.
 */
export async function notifyShopNewOrder({
  orderNumber,
  customerName,
  customerPhone,
  totalAmount,
  itemCount,
}) {
  const result = {
    emailNotified: false,
    merchantWhatsAppUrl: null,
  };

  // 1. Dispatch Email notification if CONTACT_EMAIL is configured
  const recipient = (CONTACT_EMAIL || 'support@computercaregzb.com').trim();
  if (recipient) {
    try {
      const resp = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[NEW ORDER REQUEST] #${orderNumber} from ${customerName}`,
          _template: 'table',
          _captcha: 'false',
          'Order Number': `#${orderNumber}`,
          'Customer Name': customerName,
          'Customer Phone': customerPhone,
          'Items Count': itemCount,
          'Total Order Amount': `₹${Number(totalAmount).toLocaleString('en-IN')}`,
          'Order Time (IST)': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          'Store Admin Link': 'https://computercaregzb.com/admin',
        }),
      });
      result.emailNotified = resp.ok;
    } catch (err) {
      console.warn('[NotificationService] Email notification dispatch error:', err);
      // Fallback to internal endpoint
      try {
        const localResp = await fetch('/api/notify-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient,
            subject: `[NEW ORDER REQUEST] #${orderNumber} from ${customerName}`,
            orderNumber,
            customerName,
            customerPhone,
            totalAmount,
            itemCount,
            timestamp: new Date().toISOString(),
          }),
        });
        result.emailNotified = localResp.ok;
      } catch (innerErr) {
        console.warn('[NotificationService] Internal endpoint fallback error:', innerErr);
      }
    }
  }

  // 2. Merchant WhatsApp notification link
  const cleanPhone = (STORE_PHONE || '919810550222').replace(/\D/g, '');
  const alertText = `🚨 *NEW ORDER REQUEST - ${STORE_NAME}*\n` +
    `Ref: #${orderNumber}\n` +
    `Customer: ${customerName} (${customerPhone})\n` +
    `Items: ${itemCount}\n` +
    `Total: ₹${Number(totalAmount).toLocaleString('en-IN')}\n` +
    `Time: ${new Date().toLocaleTimeString('en-IN')}\n` +
    `Please review in Admin Portal: https://computercaregzb.com/admin`;

  result.merchantWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(alertText)}`;
  return result;
}

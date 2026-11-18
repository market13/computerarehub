import { supabase, isSupabaseConfigured, safeDbQuery } from './supabaseClient.js';
import { STORE_PHONE, STORE_ADDRESS, STORE_NAME } from '../constants/storeInfo.js';

const LOCAL_ORDERS_KEY = 'computercare_orders';

export function generateOrderRef() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CC-ORD-${dateStr}-${randomSuffix}`;
}

/**
 * Creates an offline "Order Request" for hardware items / custom PC builds.
 * Payment is collected offline (UPI/cash/at store) upon shop confirmation.
 */
export async function createOrderRequest({
  customerName,
  customerEmail,
  customerPhone,
  customerNotes = '',
  shippingAddress = {},
  items = [],
  couponCode = null,
  idempotencyKey = null,
}) {
  const orderRef = generateOrderRef();
  const cleanPhone = (STORE_PHONE || '919810550222').replace(/\D/g, '');

  return await safeDbQuery(
    async (client) => {
      // 1. Attempt Postgres RPC function create_order_request
      try {
        const { data: rpcResult, error: rpcError } = await client.rpc('create_order_request', {
          p_customer_name: customerName,
          p_customer_email: customerEmail || 'guest@computercaregzb.com',
          p_customer_phone: customerPhone,
          p_customer_notes: customerNotes,
          p_shipping_address: shippingAddress,
          p_items: items,
          p_coupon_code: couponCode,
          p_idempotency_key: idempotencyKey,
        });

        if (!rpcError && rpcResult?.order_number) {
          saveToLocalOrders({
            orderNumber: rpcResult.order_number,
            customerName,
            customerPhone,
            totalAmount: rpcResult.total_amount,
            status: 'pending',
            items,
            createdAt: new Date().toISOString(),
          });

          return {
            success: true,
            orderNumber: rpcResult.order_number,
            orderId: rpcResult.order_id,
            totalAmount: rpcResult.total_amount,
            subtotal: rpcResult.subtotal,
            discount: rpcResult.discount_amount,
            status: 'pending',
          };
        }
      } catch (rpcErr) {
        console.warn('RPC create_order_request error, falling back to direct table insert:', rpcErr);
      }

      // 2. Direct table insert fallback if RPC isn't deployed yet
      const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
      const totalAmount = subtotal;

      const { data: orderData, error: orderErr } = await client
        .from('orders')
        .insert({
          order_number: orderRef,
          customer_name: customerName,
          customer_email: customerEmail || 'guest@computercaregzb.com',
          customer_phone: customerPhone,
          status: 'pending',
          subtotal,
          total_amount: totalAmount,
          customer_notes: customerNotes,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      saveToLocalOrders({
        orderNumber: orderRef,
        customerName,
        customerPhone,
        totalAmount,
        status: 'pending',
        items,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        orderNumber: orderRef,
        orderId: orderData?.id,
        totalAmount,
        status: 'pending',
      };
    },
    async () => {
      // Offline fallback
      const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

      const localRecord = {
        orderNumber: orderRef,
        customerName,
        customerPhone,
        customerEmail,
        customerNotes,
        shippingAddress,
        items,
        subtotal,
        totalAmount: subtotal,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      saveToLocalOrders(localRecord);

      return {
        success: true,
        orderNumber: orderRef,
        totalAmount: subtotal,
        status: 'pending',
        offline: true,
      };
    }
  );
}

/**
 * Format a WhatsApp order request message with payment instructions
 */
export function formatWhatsAppOrderMessage({
  orderNumber,
  customerName,
  customerPhone,
  customerCity,
  items = [],
  totalAmount = 0,
}) {
  const itemsText = items
    .map((item, idx) => `${idx + 1}. ${item.title || item.name || 'Component'} (x${item.quantity || 1}) - ₹${Number(item.price || item.total_price || 0).toLocaleString('en-IN')}`)
    .join('\n');

  let text = `Hi ${STORE_NAME}, I placed an order request on computercaregzb.com:\n\n`;
  text += `*Order Ref:* ${orderNumber}\n`;
  text += `*Customer:* ${customerName} (${customerPhone})\n`;
  if (customerCity) text += `*City / Store Pickup:* ${customerCity}\n`;
  text += `\n*Hardware Items:*\n${itemsText}\n\n`;
  text += `*Total Amount:* ₹${Number(totalAmount).toLocaleString('en-IN')}\n`;
  text += `*Payment Method:* Offline (UPI / Cash / Store Pickup at ${STORE_ADDRESS})\n\n`;
  text += `Please verify component availability and provide shop confirmation.`;

  return text;
}

function saveToLocalOrders(order) {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

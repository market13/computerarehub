import { supabase, isSupabaseConfigured, safeDbQuery } from './supabaseClient.js';

const FALLBACK_COUPONS = {
  GHZFIRST: {
    code: 'GHZFIRST',
    discount_type: 'fixed_amount',
    discount_value: 500,
    min_order_amount: 10000,
    description: 'Flat ₹500 off for first-time store builders',
  },
  CARE1000: {
    code: 'CARE1000',
    discount_type: 'fixed_amount',
    discount_value: 1000,
    min_order_amount: 50000,
    description: 'Flat ₹1,000 off on high-end PC builds over ₹50,000',
  },
  GZBGAMING: {
    code: 'GZBGAMING',
    discount_type: 'percentage',
    discount_value: 2,
    min_order_amount: 25000,
    max_discount_amount: 1500,
    description: '2% off up to ₹1,500 on gaming rigs',
  },
};

/**
 * Validates a coupon code against Supabase `coupons` table
 * (falling back to offline store coupons when database is offline)
 */
export async function validateCoupon(code, subtotal = 0) {
  if (!code || !code.trim()) {
    return { valid: false, message: 'Please enter a coupon code.' };
  }

  const cleanCode = code.trim().toUpperCase();

  const result = await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('coupons')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return checkFallbackCoupon(cleanCode, subtotal);
      }

      // 1. Check validity dates
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        return { valid: false, message: 'This coupon has expired.' };
      }

      // 2. Check usage limits
      if (data.usage_limit && data.usage_count >= data.usage_limit) {
        return { valid: false, message: 'This coupon has reached its maximum redemptions.' };
      }

      // 3. Check min order amount
      const minAmount = Number(data.min_order_amount) || 0;
      if (subtotal < minAmount) {
        return {
          valid: false,
          message: `Minimum order amount of ₹${minAmount.toLocaleString('en-IN')} required for this coupon.`,
        };
      }

      // 4. Calculate discount
      let discount = 0;
      if (data.discount_type === 'percentage') {
        discount = Math.round(subtotal * (Number(data.discount_value) / 100));
        if (data.max_discount_amount && discount > Number(data.max_discount_amount)) {
          discount = Number(data.max_discount_amount);
        }
      } else {
        discount = Number(data.discount_value);
      }

      return {
        valid: true,
        discount: Math.min(discount, subtotal),
        coupon: data,
        message: `Coupon "${cleanCode}" applied successfully!`,
      };
    },
    async () => {
      return checkFallbackCoupon(cleanCode, subtotal);
    }
  );

  return result?.data || result;
}

function checkFallbackCoupon(code, subtotal) {
  const coupon = FALLBACK_COUPONS[code];
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code.' };
  }

  if (subtotal < coupon.min_order_amount) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${coupon.min_order_amount.toLocaleString('en-IN')} required.`,
    };
  }

  let discount = coupon.discount_value;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round(subtotal * (coupon.discount_value / 100));
    if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
      discount = coupon.max_discount_amount;
    }
  }

  return {
    valid: true,
    discount: Math.min(discount, subtotal),
    coupon,
    message: `Coupon "${code}" applied! ${coupon.description}`,
  };
}

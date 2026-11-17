import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Real client if env is set, otherwise null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Universal safe executor:
 * If Supabase is active, calls real query.
 * Otherwise, falls back to localStorage or local memory handler.
 */
export async function safeDbQuery(onlineFn, offlineFallbackFn) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const result = await onlineFn(supabase);
      if (result.error) throw result.error;
      return { data: result.data, error: null, source: 'supabase' };
    } catch (err) {
      console.warn('[Computer Care DB] Supabase query failed, falling back:', err.message);
      if (offlineFallbackFn) {
        const fallbackData = await offlineFallbackFn();
        return { data: fallbackData, error: null, source: 'offline-fallback' };
      }
      return { data: null, error: err, source: 'error' };
    }
  }

  // Graceful offline fallback
  if (offlineFallbackFn) {
    const fallbackData = await offlineFallbackFn();
    return { data: fallbackData, error: null, source: 'local-storage' };
  }
  return { data: null, error: null, source: 'unconfigured' };
}

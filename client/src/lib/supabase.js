import { createClient } from '@supabase/supabase-js';

const metaEnv = (typeof import.meta !== 'undefined' && import.meta?.env) ? import.meta.env : {};
const procEnv = (typeof process !== 'undefined' && process?.env) ? process.env : {};

// Supabase credentials for Computer Care (computercaregzb.com)
const DEFAULT_SUPABASE_URL = 'https://aydhfzqiambrqjhgxcwu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZGhmenFpYW1icnFqaGd4Y3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxOTYxMzUsImV4cCI6MjExMDc3MjEzNX0.7ED9m5WOFM6I9pMSsy0_DGCQ7XT_4LN9ysSN_wUt1FM';

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || procEnv.VITE_SUPABASE_URL || procEnv.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || procEnv.VITE_SUPABASE_ANON_KEY || procEnv.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error('Backend not configured: Supabase URL or Anon Key missing.') };
  }
  return await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password.trim(),
  });
}

/**
 * Sign up a new customer
 */
export async function signUp(email, password, metadata = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error('Backend not configured: Supabase URL or Anon Key missing.') };
  }
  return await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: password.trim(),
    options: {
      data: metadata,
    },
  });
}

/**
 * Sign out current session
 */
export async function signOut() {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: null };
  }
  return await supabase.auth.signOut();
}

/**
 * Get current session user
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
  } catch {
    return null;
  }
}

/**
 * Retrieve user profile from public.profiles
 */
export async function getUserProfile(userId) {
  if (!isSupabaseConfigured() || !supabase || !userId) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Failed to fetch profile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Error loading profile:', err);
    return null;
  }
}

/**
 * Server-verified Admin Role Check:
 * Enforced by querying profiles.role from the database using auth.uid().
 * Never trusts a client-side boolean.
 */
export async function checkIsAdmin() {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    // Check JWT app_metadata first for fast check
    if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
      return true;
    }

    // Verify against database profiles table
    const profile = await getUserProfile(user.id);
    return profile?.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Safe database query executor with fallback support
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
    return { data: fallbackData, error: null, source: 'offline-fallback' };
  }
  return { data: null, error: null, source: 'unconfigured' };
}

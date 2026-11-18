import { supabase, isSupabaseConfigured, safeDbQuery } from './supabaseClient.js';

const LOCAL_BUILDS_KEY = 'computercare_saved_builds';
const memoryStore = {};

function getOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://computercaregzb.com';
}

/**
 * Generate a client-side 12-char alphanumeric share code for offline fallback
 */
function generateClientShareCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Save a custom PC configuration to Supabase (with localStorage fallback)
 * and generate a permanent shareable link /builder?config=<code>
 */
export async function savePCConfiguration({
  title = 'Custom Gaming Rig',
  build = {},
  totalPrice = 0,
  estimatedWattage = 0,
  isCompatible = true,
  compatibilityNotes = [],
  gamingScores = {},
  targetUsage = 'Gaming & High-Performance Workstation',
}) {
  const shareCode = generateClientShareCode();
  const buildSnapshot = { ...build };
  const origin = getOrigin();

  const queryResult = await safeDbQuery(
    async (client) => {
      // 1. Insert into pc_configurations table
      const { data: config, error: configError } = await client
        .from('pc_configurations')
        .insert({
          share_code: shareCode,
          title,
          target_usage: targetUsage,
          estimated_wattage: Math.round(estimatedWattage),
          is_compatible: Boolean(isCompatible),
          compatibility_notes: {
            build: buildSnapshot,
            notes: compatibilityNotes,
          },
          gaming_scores: gamingScores,
          total_price: Number(totalPrice) || 0,
          is_public: true,
        })
        .select()
        .single();

      if (configError) throw configError;

      saveToLocalStorage(shareCode, {
        share_code: shareCode,
        title,
        build: buildSnapshot,
        total_price: totalPrice,
        estimated_wattage: estimatedWattage,
      });

      return {
        success: true,
        shareCode,
        shareUrl: `${origin}/builder?config=${shareCode}`,
        config,
      };
    },
    async () => {
      // Offline fallback
      saveToLocalStorage(shareCode, {
        share_code: shareCode,
        title,
        build: buildSnapshot,
        total_price: totalPrice,
        estimated_wattage: estimatedWattage,
      });

      return {
        success: true,
        shareCode,
        shareUrl: `${origin}/builder?config=${shareCode}`,
        offline: true,
      };
    }
  );

  return queryResult?.data || queryResult;
}

/**
 * Retrieve a saved PC configuration by its unique share code
 */
export async function getPCConfigurationByCode(shareCode) {
  if (!shareCode) return null;
  const cleanCode = shareCode.trim().toUpperCase();

  const queryResult = await safeDbQuery(
    async (client) => {
      const { data, error } = await client
        .from('pc_configurations')
        .select('*')
        .eq('share_code', cleanCode)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return getFromLocalStorage(cleanCode);
      }

      const restoredBuild = data.compatibility_notes?.build || null;
      return {
        config: data,
        build: restoredBuild,
      };
    },
    async () => {
      return getFromLocalStorage(cleanCode);
    }
  );

  return queryResult?.data || queryResult;
}

function saveToLocalStorage(code, data) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_BUILDS_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      existing[code] = {
        ...data,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_BUILDS_KEY, JSON.stringify(existing));
      return;
    }
  } catch (err) {
    console.warn('LocalStorage save failed for build config:', err);
  }
  memoryStore[code] = {
    ...data,
    savedAt: new Date().toISOString(),
  };
}

function getFromLocalStorage(code) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_BUILDS_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      const item = existing[code];
      if (item && item.build) {
        return {
          config: item,
          build: item.build,
        };
      }
    }
  } catch {
    // fallback
  }
  if (memoryStore[code] && memoryStore[code].build) {
    return {
      config: memoryStore[code],
      build: memoryStore[code].build,
    };
  }
  return null;
}

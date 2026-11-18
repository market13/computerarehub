// Re-export from canonical client/src/lib/supabase.js
export {
  supabase,
  isSupabaseConfigured,
  safeDbQuery,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getUserProfile,
  checkIsAdmin,
  onAuthStateChange
} from '../lib/supabase';

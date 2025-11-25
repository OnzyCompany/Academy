import { createClient } from '@supabase/supabase-js';

// Fallback for development if env vars are missing
// Safely access env to prevent "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!env.VITE_SUPABASE_URL && !!env.VITE_SUPABASE_ANON_KEY;
};
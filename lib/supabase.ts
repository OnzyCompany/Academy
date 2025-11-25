import { createClient } from '@supabase/supabase-js';

// Fallback for development if env vars are missing
// Safely access env to prevent "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
const env = (import.meta as any).env || {};

// Credentials provided by the user
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://qsevqrnfyicyunqwpatk.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZXZxcm5meWljeXVucXdwYXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjM2NjcsImV4cCI6MjA3MjgzOTY2N30.12WJnxMzYE6ODi2ZlphYGDcIrDWPoBvcPW9yJpdKjGw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return true;
};
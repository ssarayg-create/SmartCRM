import { createClient } from '@supabase/supabase-js';

// Supabase Initialization with multi-layer safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: any): url is string => {
  try {
    return (
      !!url && 
      typeof url === 'string' && 
      url.startsWith('http') && 
      !url.includes('missing-config') && 
      !url.includes('placeholder')
    );
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseUrl.includes('missing-config') && 
  !supabaseUrl.includes('example.com') &&
  supabaseAnonKey !== 'dummy-key' && 
  supabaseAnonKey !== 'missing-key';

// Log configuration status for debugging
if (import.meta.env.DEV) {
  if (isSupabaseConfigured) {
    console.log(">> SmartCRM: Supabase inicializado correctamente.");
  } else {
    console.warn(">> SmartCRM: Supabase no detectado o incompleto. Operando en modo local (localStorage).");
  }
}

// Fallback values to prevent createClient from throwing
// We use a generic URL if config is missing
const safeUrl = isSupabaseConfigured ? supabaseUrl! : 'https://api.supabase.co';
const safeKey = isSupabaseConfigured ? supabaseAnonKey! : 'dummy-key';

export const supabase = createClient(safeUrl, safeKey);

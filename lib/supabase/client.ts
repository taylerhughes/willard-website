import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Supabase URL:', url);
  console.log('Supabase Key:', key ? 'exists' : 'missing');
  
  return createBrowserClient(url!, key!)
}

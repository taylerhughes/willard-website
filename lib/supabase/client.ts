import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use dummy values if Supabase env vars are not set
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  return createBrowserClient(url, key)
}

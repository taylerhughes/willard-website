import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build time or when env vars are missing, return a mock client
    // that will fail gracefully at runtime
    if (typeof window === 'undefined') {
      console.warn('Supabase credentials not available during build');
      // Return a minimal mock for build-time
      return {
        auth: {
          signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
          getUser: async () => ({ data: { user: null }, error: null }),
          signOut: async () => ({ error: null }),
        }
      } as any;
    }
    throw new Error('Supabase credentials are required');
  }

  console.log('Supabase URL:', url);
  console.log('Supabase Key:', key ? 'exists' : 'missing');

  return createBrowserClient(url, key)
}

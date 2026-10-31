import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY: Never import this module into client components or client bundles.
if (typeof window !== 'undefined') {
  throw new Error('lib/supabase/admin.ts must only be used in a server-side context.');
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_service_role_key';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

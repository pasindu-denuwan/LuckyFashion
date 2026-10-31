import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AdminRole = 'owner' | 'content_manager' | 'quotation_manager';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  fullName?: string;
}

/**
 * Server-side role guard for admin pages and server actions.
 * Enforces role-based access control directly on the backend.
 */
export async function requireRole(allowedRoles?: AdminRole[]): Promise<AdminUser> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/admin/login');
  }

  // Fetch admin profile
  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    // User is authenticated in Supabase Auth but has no admin profile row
    redirect('/admin/login?error=unauthorized_profile');
  }

  const adminRole = profile.role as AdminRole;

  if (allowedRoles && allowedRoles.length > 0) {
    // 'owner' always has access to all admin sections
    const hasAccess = adminRole === 'owner' || allowedRoles.includes(adminRole);
    if (!hasAccess) {
      redirect('/admin/overview?error=forbidden');
    }
  }

  return {
    id: user.id,
    email: user.email || profile.email,
    role: adminRole,
    fullName: profile.full_name,
  };
}


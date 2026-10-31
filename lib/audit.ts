import { createAdminClient } from '@/lib/supabase/admin';

interface AuditLogEntry {
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}

export async function logAdminAction(entry: AuditLogEntry) {
  try {
    const supabase = createAdminClient();
    await supabase.from('audit_logs').insert({
      user_id: entry.userId || null,
      user_email: entry.userEmail || null,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId || null,
      details: entry.details || {},
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}


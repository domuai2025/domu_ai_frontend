import { useEffect, useState } from 'react';
import { useSupabase } from '@/components/supabase/provider';
import type { Permission, UserPermissions } from './types';

export function usePermissions() {
  const { supabase } = useSupabase();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from('user_permissions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setPermissions(data);
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [supabase]);

  const hasPermission = (permission: Permission): boolean => {
    if (!permissions) return false;
    if (permissions.permissions.includes('admin:full')) return true;
    return permissions.permissions.includes(permission);
  };

  return { permissions, loading, hasPermission };
}
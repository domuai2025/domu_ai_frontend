'use client';

import { useSupabase } from '@/components/supabase/provider';
import { useEffect, useState } from 'react';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  fallback = <div>You don&apos;t have permission to view this content</div>,
}: PermissionGuardProps) {
  const { supabase } = useSupabase();
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_permissions')
          .select('permissions')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        setHasPermission(data.permissions.includes(permission));
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkPermission();
  }, [supabase, permission]);

  if (isLoading) return <div>Loading...</div>;
  return hasPermission ? children : fallback;
}
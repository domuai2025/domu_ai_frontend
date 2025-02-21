'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/supabase/provider';
import { LoadingState } from '@/components/ui/loading-state';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (!session && requireAuth) {
        router.push(redirectTo);
      } else if (session && !requireAuth) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo, router, supabase.auth]);

  if (requireAuth && !isAuthenticated) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!requireAuth && isAuthenticated) {
    return <LoadingState message="Redirecting..." />;
  }

  return <>{children}</>;
}
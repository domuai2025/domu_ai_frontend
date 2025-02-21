"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/supabase/provider'; // adjust import path as needed
import { AuthScreen } from "@/components/auth/auth-screen";
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function AuthPage() {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to dashboard when signed in
        router.push('/dashboard');
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return <AuthScreen />;
}

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/auth-helpers-nextjs";
import supabase from "@/lib/supabaseClient"; // ✅ Import Supabase client

// ✅ Create Auth Context
const AuthContext = createContext<{ user: User | null; session: Session | null }>({
  user: null,
  session: null,
});

// ✅ Create Provider Component
export function SupabaseClientProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // ✅ Fetch current session
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
    };

    fetchUser();

    // ✅ Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom Hook to Use Auth in Components
export const useAuth = () => {
  return useContext(AuthContext);
};

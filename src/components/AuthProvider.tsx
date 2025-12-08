"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Initializing auth");

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await getSupabase().auth.getSession();
        console.log("AuthProvider: Initial session", {
          user: session?.user?.email,
          error,
        });
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("AuthProvider: Error getting initial session", error);
        // Don't throw, just set user to null and continue
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((event, session) => {
      console.log("AuthProvider: Auth state changed", {
        event,
        user: session?.user?.email,
      });

      // Handle token refresh events
      if (event === "TOKEN_REFRESHED") {
        console.log("AuthProvider: Token refreshed");
      }

      // Handle sign out events
      if (event === "SIGNED_OUT") {
        console.log("AuthProvider: User signed out");
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log("AuthProvider: Signing out");
    await getSupabase().auth.signOut();
  };

  console.log("AuthProvider: Current state", { user: user?.email, loading });

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

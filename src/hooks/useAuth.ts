import { useCallback, useContext, useMemo } from "react";
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/contexts/AuthContext";

interface AuthActions {
  login: (credentials: SignInWithPasswordCredentials) => Promise<void>;
  signup: (credentials: SignUpWithPasswordCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const login = useCallback<Required<AuthActions>["login"]>(
    async (credentials) => {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) {
        throw error;
      }
    },
    []
  );

  const signup = useCallback<Required<AuthActions>["signup"]>(
    async (credentials) => {
      const { error } = await supabase.auth.signUp(credentials);
      if (error) {
        throw error;
      }
    },
    []
  );

  const logout = useCallback<Required<AuthActions>["logout"]>(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, []);

  const resendVerification = useCallback(async () => {
    if (!context.user?.email) {
      throw new Error("No user email found");
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: context.user.email,
    });
    if (error) {
      throw error;
    }
  }, [context.user?.email]);

  const authState = useMemo(
    () => ({
      ...context,
      isAuthenticated: !!context.user,
      isAdmin: context.user?.user_metadata?.role === "admin",
      isEmailVerified: context.user?.email_confirmed_at != null,
      login,
      signup,
      logout,
      resendVerification,
    }),
    [context, login, logout, signup, resendVerification]
  );

  return authState;
}

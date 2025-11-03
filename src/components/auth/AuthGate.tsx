import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface AuthGateProps {
  children: ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

export function AuthGate({
  children,
  redirectTo = "/login",
  requireAdmin = false,
}: AuthGateProps) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && location !== redirectTo) {
      setLocation(redirectTo);
      return;
    }
  }, [isAuthenticated, loading, redirectTo, location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Access restricted</h2>
          <p className="text-slate-600">
            Your account doesn&apos;t have permission to view this page. Please contact an administrator if you believe this is a
            mistake.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

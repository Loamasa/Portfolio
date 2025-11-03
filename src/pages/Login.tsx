import { LoginForm } from "@/components/auth/LoginForm";
import { APP_TITLE } from "@/lib/const";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/cv-manager");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-3xl grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <p className="text-primary font-semibold uppercase tracking-widest">Welcome back</p>
          <h1 className="text-4xl font-bold text-slate-900">Sign in to {APP_TITLE}</h1>
          <p className="text-slate-600">
            Manage your portfolio, CV, and blog content from a single dashboard powered by Supabase.
          </p>
        </div>
        <LoginForm onSuccess={() => setLocation("/cv-manager")} />
      </div>
    </div>
  );
}

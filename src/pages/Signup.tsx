import { SignupForm } from "@/components/auth/SignupForm";
import { APP_TITLE } from "@/lib/const";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Signup() {
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
          <p className="text-primary font-semibold uppercase tracking-widest">Join us</p>
          <h1 className="text-4xl font-bold text-slate-900">Create your {APP_TITLE} account</h1>
          <p className="text-slate-600">
            Use email and password sign-up powered by Supabase authentication. Verify your email to unlock the full
            experience.
          </p>
        </div>
        <SignupForm onSuccess={() => setLocation("/login")} />
      </div>
    </div>
  );
}

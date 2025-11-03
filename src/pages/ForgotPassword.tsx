import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { APP_TITLE } from "@/lib/const";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ForgotPassword() {
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
          <p className="text-primary font-semibold uppercase tracking-widest">Reset password</p>
          <h1 className="text-4xl font-bold text-slate-900">Forgot your password?</h1>
          <p className="text-slate-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

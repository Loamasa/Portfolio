import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { APP_TITLE } from "@/lib/const";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ResetPassword() {
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
          <p className="text-primary font-semibold uppercase tracking-widest">Set new password</p>
          <h1 className="text-4xl font-bold text-slate-900">Create a new password</h1>
          <p className="text-slate-600">
            Enter a strong password for your {APP_TITLE} account. Make sure it's something you'll remember!
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

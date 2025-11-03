import { useState } from "react";
import { AlertCircle, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function EmailVerificationBanner() {
  const { user, isEmailVerified, resendVerification } = useAuth();
  const [sending, setSending] = useState(false);

  if (!user || isEmailVerified) {
    return null;
  }

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      toast.success("Verification email sent! Check your inbox.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send verification email";
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-amber-900">Email not verified.</span>
              <span className="text-amber-700 ml-2">
                Please check your inbox and verify your email address to unlock all features.
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={sending}
            className="flex items-center gap-2 border-amber-300 hover:bg-amber-100"
          >
            <Mail className="w-4 h-4" />
            {sending ? "Sending..." : "Resend email"}
          </Button>
        </div>
      </div>
    </div>
  );
}

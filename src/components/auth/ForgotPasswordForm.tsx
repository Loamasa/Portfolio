import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reset email";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <KeyRound className="w-5 h-5" />
            Check your email
          </CardTitle>
          <CardDescription>
            We've sent you a password reset link. Please check your inbox and follow the instructions.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between text-sm text-slate-600">
          <span>Remembered your password?</span>
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="w-5 h-5" />
          Reset password
        </CardTitle>
        <CardDescription>Enter your email to receive a password reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="reset-email">
              Email
            </label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-slate-600">
        <span>Remembered your password?</span>
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

"use client"; // Needs to be a client component for form logic

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordReset } from "@/lib/firebase/auth"; // Assuming this function exists
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordReset(email);
      setMessage("Password reset email sent. Please check your inbox.");
      toast({ title: "Email Sent", description: "Password reset email sent. Please check your inbox." });
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
      toast({ variant: "destructive", title: "Error", description: err.message || "Could not send reset email." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {message ? (
            <p className="text-green-600 dark:text-green-500">{message}</p>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Chrome, Eye, EyeOff, Mail, KeyRound } from "lucide-react"; // Using Chrome for Google icon

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/profile"); // Or redirect to intended page
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      toast({ variant: "destructive", title: "Login Failed", description: err.message || "Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      toast({ title: "Login Successful", description: "Welcome!" });
      router.push("/profile"); // Or redirect to intended page
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
      toast({ variant: "destructive", title: "Google Login Failed", description: err.message || "Could not sign in with Google." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your Gunvor.TV profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignIn} className="space-y-6">
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <Chrome className="mr-2 h-5 w-5" /> {/* Using Chrome icon for Google */}
            Sign In with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </p>
          <Button variant="link" asChild className="p-0 h-auto text-xs">
             <Link href="/forgot-password">Forgot Password?</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Create dummy pages for signup and forgot-password to avoid 404s for now
export function SignupPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your Gunvor.TV account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Sign up form will be here.</p>
          <Button variant="link" asChild className="block text-center mt-4">
            <Link href="/login">Already have an account? Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ForgotPasswordPage() {
   return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Reset your Gunvor.TV password.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Forgot password form will be here.</p>
           <Button variant="link" asChild className="block text-center mt-4">
            <Link href="/login">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

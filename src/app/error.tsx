"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  let title = "Something went wrong!";
  let message = "An unexpected error occurred. Please try again or contact support if the issue persists.";

  if (error.message.includes("auth/invalid-api-key") || error.message.includes("Firebase: Error (auth/invalid-api-key)")) {
    title = "Firebase Configuration Error";
    message = "There seems to be an issue with the Firebase API key configuration. Please ensure your environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY) are correctly set up in your .env file and the Firebase project is configured to allow this domain.";
  } else if (error.message.toLowerCase().includes("failed to fetch")) {
    title = "Network Error";
    message = "We couldn't fetch the required data. Please check your internet connection and try again.";
  }


  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-12 px-4">
      <AlertTriangle className="h-24 w-24 text-destructive mb-8" />
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-6 max-w-lg">
        {message}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-2">Error Digest: {error.digest}</p>
      )}
       <div className="mb-8 max-w-xl w-full text-left">
        <p className="text-sm font-semibold text-destructive-foreground bg-destructive/10 p-3 rounded-md overflow-auto">
         <strong>Error Details:</strong><br /> 
         <code>{error.message}</code>
        </p>
      </div>
      <div className="flex space-x-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/firebase-auth-context";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
// Assume a function `deleteCurrentUserAccount` exists in firebase/auth.ts
// import { deleteCurrentUserAccount } from "@/lib/firebase/auth"; 
import { useRouter } from "next/navigation";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "User not authenticated." });
      setIsLoading(false);
      return;
    }

    try {
      // This function needs to be implemented in "@/lib/firebase/auth.ts"
      // It should handle re-authentication if required by Firebase for sensitive operations.
      // await deleteCurrentUserAccount(); 
      console.warn("Account deletion functionality not fully implemented yet."); // Placeholder
      toast({ title: "Account Deletion Requested", description: "If implemented, your account would be deleted. This is a placeholder." });
      // After successful deletion, sign out and redirect
      // await signOutUser(); // From @/lib/firebase/auth
      router.push("/"); 
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Deletion Failed", description: error.message || "Could not delete account." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isLoading ? "Deleting..." : "Yes, delete account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Note: You would need to implement `deleteCurrentUserAccount` in `src/lib/firebase/auth.ts`.
// Example (needs proper error handling and re-authentication flow):
/*
import { deleteUser } from "firebase/auth";
export const deleteCurrentUserAccount = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await deleteUser(currentUser);
  } else {
    throw new Error("No user is currently signed in.");
  }
};
*/

"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useAuth } from "@/contexts/firebase-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/firebase/auth";
import type { User } from "firebase/auth";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User; // Current Firebase user object
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth(); // To refresh auth state if needed, though Firebase handles it mostly

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!authUser) {
        setError("User not authenticated.");
        setIsLoading(false);
        return;
    }

    try {
      await updateUserProfile(authUser, { displayName, photoURL });
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      onClose(); // Close modal on success
      // Potentially trigger a re-fetch of user data or rely on auth state listeners
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="displayName" className="text-right">
              Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="col-span-3"
              placeholder="Your display name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photoURL" className="text-right">
              Avatar URL
            </Label>
            <Input
              id="photoURL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          {error && <p className="col-span-4 text-sm text-destructive text-center">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import type { Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
// import { updateReview } from "@/lib/firebase/firestore"; // Assuming this exists

interface EditReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onReviewUpdate?: () => void;
}

export default function EditReviewDialog({ isOpen, onClose, review, onReviewUpdate }: EditReviewDialogProps) {
  const [rating, setRating] = useState(review.rating);
  const [text, setText] = useState(review.text);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // await updateReview(review.id, rating, text);
      console.log("Updating review (placeholder):", review.id, rating, text);
      toast({ title: "Review Updated", description: "Your review has been successfully updated." });
      onReviewUpdate?.();
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message || "Could not update review." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Review</DialogTitle>
          <DialogDescription>Update your rating and comments for this content.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            {/* Basic number input for rating, can be replaced with star component */}
            <input 
              type="number" 
              id="rating" 
              value={rating} 
              onChange={(e) => setRating(Math.max(1, Math.min(5, parseInt(e.target.value,10))))} 
              min="1" max="5" 
              className="mt-1 block w-full rounded-md border-input bg-background p-2 shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50" 
            />
          </div>
          <div>
            <Label htmlFor="reviewText">Your Review</Label>
            <Textarea
              id="reviewText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Share your thoughts..."
            />
          </div>
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

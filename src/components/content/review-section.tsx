"use client";

import { useState, useEffect, FormEvent } from "react";
import type { Review } from "@/types";
import { useAuth } from "@/contexts/firebase-auth-context";
import { addReview, getReviewsForContent } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Send, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewSectionProps {
  contentId: string;
  contentType: "movie" | "series";
}

const StarRatingInput = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};


export default function ReviewSection({ contentId, contentType }: ReviewSectionProps) {
  const { user, isDemoMode } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const fetchedReviews = await getReviewsForContent(contentId);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load reviews." });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [contentId]);

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to submit a review." });
      return;
    }
    if (newReviewRating === 0) {
      toast({ variant: "destructive", title: "Rating Required", description: "Please select a star rating." });
      return;
    }
    if (!newReviewText.trim()) {
      toast({ variant: "destructive", title: "Review Text Required", description: "Please write your review." });
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(user.uid, contentId, newReviewRating, newReviewText);
      toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
      setNewReviewText("");
      setNewReviewRating(0);
      fetchReviews(); // Refresh reviews list
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not submit your review." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reviews & Ratings</CardTitle>
        <CardDescription>See what others think or share your own opinion.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Submission Form */}
        {user && !isDemoMode && (
          <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-semibold">Write Your Review</h3>
            <div>
              <Label htmlFor="rating" className="mb-1 block">Your Rating</Label>
              <StarRatingInput rating={newReviewRating} setRating={setNewReviewRating} />
            </div>
            <div>
              <Label htmlFor="reviewText" className="mb-1 block">Your Review</Label>
              <Textarea
                id="reviewText"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder={`Share your thoughts on this ${contentType}...`}
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Submit Review</>}
            </Button>
          </form>
        )}
        {isDemoMode && (
          <div className="p-4 border rounded-lg bg-muted/20 text-center">
            <p className="text-muted-foreground">
              <a href="/login" className="text-primary hover:underline">Log in</a> to write a review.
            </p>
          </div>
        )}

        {/* Display Reviews */}
        <div className="space-y-6">
          {isLoadingReviews ? (
            <>
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg flex gap-4 items-start">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatarUrl} alt={review.userDisplayName || "User"} />
                  <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{review.userDisplayName || "Anonymous User"}</h4>
                    <div className="flex items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-foreground/90">{review.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

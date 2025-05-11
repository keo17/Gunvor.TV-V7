"use client";

import type { Review } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
// Assume EditReviewDialog and functions like deleteReview, updateReview exist
// import EditReviewDialog from "./edit-review-dialog";
// import { deleteReview } from "@/lib/firebase/firestore";

interface ReviewCardProps {
  review: Review;
  onReviewUpdate?: () => void; // Callback to refresh reviews list
}

export default function ReviewCard({ review, onReviewUpdate }: ReviewCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    // Placeholder for delete logic
    // await deleteReview(review.id);
    toast({ title: "Review Deletion (Placeholder)", description: `Review for content ID ${review.contentId} would be deleted.` });
    onReviewUpdate?.();
  };
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
    ));
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        {/* TODO: Link to content page or show content title */}
        <CardTitle className="text-xl">Review for Content ID: {review.contentId}</CardTitle> 
        <div className="flex items-center">
           {renderStars(review.rating)}
        </div>
        <CardDescription>
          Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80">{review.text}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
      {/* {isEditing && (
        <EditReviewDialog
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          review={review}
          onReviewUpdate={onReviewUpdate}
        />
      )} */}
      {isEditing && <p className="text-center text-sm p-4 text-muted-foreground">Edit review dialog would appear here.</p>}
    </Card>
  );
}

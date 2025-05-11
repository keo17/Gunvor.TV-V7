"use client";

import { useState, useEffect } from "react";
import { Heart, PlusCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentItem, WishlistItem as WishlistItemType } from "@/types";
import { useAuth } from "@/contexts/firebase-auth-context";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WishlistButtonProps {
  contentItem: ContentItem;
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
  onWishlistChange?: () => void; // Optional: if parent needs to react
}

export default function WishlistButton({ contentItem, variant="ghost", size="icon", className, onWishlistChange }: WishlistButtonProps) {
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  useEffect(() => {
    const checkIfWishlisted = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const userWishlist = await getWishlist(user.uid);
          const existingItem = userWishlist.find(item => item.contentId === contentItem.id);
          if (existingItem) {
            setIsWishlisted(true);
            setWishlistItemId(existingItem.id);
          } else {
            setIsWishlisted(false);
            setWishlistItemId(null);
          }
        } catch (error) {
          console.error("Error checking wishlist status:", error);
          // Don't show toast for this initial check
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsWishlisted(false); // Not logged in, so not wishlisted
        setWishlistItemId(null);
        setIsLoading(false); // No user, so not loading
      }
    };

    checkIfWishlisted();
  }, [user, contentItem.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDemoMode || !user) {
      toast({ title: "Login Required", description: "Please log in to manage your wishlist." });
      return;
    }

    setIsLoading(true); // Set loading for the toggle action
    try {
      if (isWishlisted && wishlistItemId) {
        await removeFromWishlist(user.uid, wishlistItemId);
        toast({ title: "Removed from Wishlist", description: `${contentItem.title} removed from your wishlist.` });
        setIsWishlisted(false);
        setWishlistItemId(null);
      } else {
        const newWishlistItemId = await addToWishlist(user.uid, contentItem.id);
        toast({ title: "Added to Wishlist", description: `${contentItem.title} added to your wishlist.` });
        setIsWishlisted(true);
        setWishlistItemId(newWishlistItemId);
      }
      onWishlistChange?.();
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update wishlist." });
    } finally {
      setIsLoading(false); // Clear loading after action
    }
  };

  if (isLoading && user) { // Only show skeleton if user is logged in and data is being fetched
    return <Button variant={variant} size={size} className={className} disabled><Heart className="h-5 w-5 animate-pulse" /></Button>;
  }

  const Icon = isWishlisted ? CheckCircle : PlusCircle;
  const label = isWishlisted ? "Remove from wishlist" : "Add to wishlist";
  const iconColor = isWishlisted ? "text-accent" : "";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleWishlistToggle}
            aria-label={label}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

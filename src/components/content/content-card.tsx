"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, PlayCircle, PlusCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ContentItem, WishlistItem } from "@/types";
import { useAuth } from "@/contexts/firebase-auth-context";
import { addToWishlist, removeFromWishlist } from "@/lib/firebase/firestore"; // Assuming these exist
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

interface ContentCardProps {
  item: ContentItem;
  currentWishlist?: WishlistItem[]; // Pass current user's wishlist items
  onWishlistChange?: () => void; // Callback to refresh wishlist on parent
}

export default function ContentCard({ item, currentWishlist, onWishlistChange }: ContentCardProps) {
  const { user, isDemoMode } = useAuth();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (currentWishlist) {
      setIsWishlisted(currentWishlist.some(wishlistItem => wishlistItem.contentId === item.id));
    }
  }, [currentWishlist, item.id]);


  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent card click if button is inside link

    if (isDemoMode || !user) {
      toast({ title: "Login Required", description: "Please log in to manage your wishlist." });
      return;
    }

    try {
      if (isWishlisted) {
        const wishlistItemToRemove = currentWishlist?.find(wi => wi.contentId === item.id);
        if (wishlistItemToRemove) {
          await removeFromWishlist(user.uid, wishlistItemToRemove.id);
          toast({ title: "Removed from Wishlist", description: `${item.title} removed from your wishlist.` });
          setIsWishlisted(false);
        }
      } else {
        await addToWishlist(user.uid, item.id);
        toast({ title: "Added to Wishlist", description: `${item.title} added to your wishlist.` });
        setIsWishlisted(true);
      }
      onWishlistChange?.(); // Notify parent to refresh wishlist data
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update wishlist." });
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="group relative w-72 overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.03] focus-within:scale-[1.03] focus-within:shadow-xl"> {/* Increased base width */}
        <Link href={`/${item.type}/${item.id}`} className="block">
          <CardHeader className="p-0">
            <AspectRatio ratio={3 / 2}> {/* Maintained aspect ratio */}
              <Image
                src={item.imageUrl || `https://picsum.photos/seed/${item.id}/300/450`}
                alt={item.title}
                fill={true}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                data-ai-hint="movie poster"
              />
            </AspectRatio>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 group-hover:from-black/80 transition-all duration-300" />
          </CardHeader>
          <CardContent className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <CardTitle className="text-base font-semibold text-white line-clamp-2 leading-snug mb-1 group-hover:text-accent transition-colors"> {/* Adjusted title font size */}
              {item.title}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mb-2">
              {item.genre?.slice(0, 1).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs backdrop-blur-sm bg-white/20 text-white border-white/30 group-hover:bg-accent/80 group-hover:text-accent-foreground">
                  {g}
                </Badge>
              ))}
              {item.rating && (
                 <Badge variant="default" className="text-xs bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                  {item.rating.toFixed(1)} ★
                </Badge>
              )}
            </div>
          </CardContent>
        </Link>

        {/* Wishlist button absolutely positioned */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all group-hover:opacity-100 opacity-0 group-focus-within:opacity-100"
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? <CheckCircle className="h-5 w-5 text-accent" /> : <PlusCircle className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Play button overlay on hover */}
        <Link href={`/${item.type}/${item.id}`} className="absolute inset-0 flex items-center justify-center z-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm">
          <PlayCircle className="h-16 w-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform" />
        </Link>
      </Card>
    </TooltipProvider>
  );
}

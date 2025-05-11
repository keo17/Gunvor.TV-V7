"use client";

import { useState, useEffect } from 'react';
import type { ContentItem, WishlistItem } from '@/types';
import { useAuth } from '@/contexts/firebase-auth-context';
import { getWishlist } from '@/lib/firebase/firestore';
import ContentCard from './content-card';
import { Skeleton } from '@/components/ui/skeleton';

interface WishlistContentCardProps {
  item: ContentItem;
}

export default function WishlistContentCard({ item }: WishlistContentCardProps) {
  const { user, loading: authLoading } = useAuth();
  const [currentUserWishlist, setCurrentUserWishlist] = useState<WishlistItem[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

  const fetchUserWishlist = async () => {
    if (user) {
      setIsLoadingWishlist(true);
      try {
        const wishlistData = await getWishlist(user.uid);
        setCurrentUserWishlist(wishlistData);
      } catch (error) {
        console.error("Failed to fetch user wishlist", error);
        // Optionally show a toast error
      } finally {
        setIsLoadingWishlist(false);
      }
    } else {
      setCurrentUserWishlist([]); // No user, empty wishlist
      setIsLoadingWishlist(false);
    }
  };
  
  useEffect(() => {
    if (!authLoading) { // Only fetch if auth state is resolved
        fetchUserWishlist();
    }
  }, [user, authLoading]);


  if (authLoading || (user && isLoadingWishlist)) {
    return <Skeleton className="w-full aspect-[2/3] rounded-lg" />;
  }

  return (
    <ContentCard
      item={item}
      currentWishlist={currentUserWishlist}
      onWishlistChange={fetchUserWishlist} // Re-fetch wishlist on change
    />
  );
}

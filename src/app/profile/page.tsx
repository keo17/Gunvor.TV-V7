"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/firebase-auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, LogOut, UserCircle, Heart, MessageSquare, ShieldAlert } from "lucide-react";
import type { WishlistItem, Review as ReviewType } from "@/types";
import { getWishlist, getReviewsByUser } from "@/lib/firebase/firestore";
import { signOutUser } from "@/lib/firebase/auth";
import ContentCard from "@/components/content/content-card";
import EditProfileModal from "@/components/profile/edit-profile-modal";
import DeleteAccountDialog from "@/components/profile/delete-account-dialog";
import ReviewCard from "@/components/profile/review-card"; // Create this component
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          const [wishlistData, reviewsData] = await Promise.all([
            getWishlist(user.uid),
            getReviewsByUser(user.uid), // Assuming this function exists
          ]);
          setWishlist(wishlistData);
          setReviews(reviewsData);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };
  
  const onWishlistUpdate = async () => {
    if (user) {
      const wishlistData = await getWishlist(user.uid);
      setWishlist(wishlistData);
    }
  };

  const onReviewUpdate = async () => {
    if (user) {
      const reviewsData = await getReviewsByUser(user.uid);
      setReviews(reviewsData);
    }
  };


  if (authLoading || (!user && !authLoading)) {
    // Show a more detailed skeleton similar to the page structure
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="space-y-2 text-center md:text-left">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-32 mt-2" />
          </div>
        </div>
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!user) return null; // Should be redirected by useEffect

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 border-b">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback className="text-4xl">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-3xl md:text-4xl font-bold">{user.displayName || "User Profile"}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">{user.email}</CardDescription>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                <Button onClick={() => setIsEditModalOpen(true)}><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
                <Button variant="outline" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="wishlist" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto mb-6">
          <TabsTrigger value="wishlist"><Heart className="mr-2 h-4 w-4" />Wishlist</TabsTrigger>
          <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4" />My Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>Movies and series you want to watch.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-lg" />)}
                </div>
              ) : wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {wishlist.map((wishlistItem) =>
                    wishlistItem.content ? (
                      <ContentCard key={wishlistItem.id} item={wishlistItem.content} currentWishlist={wishlist} onWishlistChange={onWishlistUpdate} />
                    ) : null
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Your wishlist is empty. Start adding some content!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Your Reviews</CardTitle>
              <CardDescription>Reviews you&apos;ve written.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                 <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} onReviewUpdate={onReviewUpdate} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">You haven&apos;t written any reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 border-t pt-8">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center"><ShieldAlert className="mr-2 h-5 w-5" />Account Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive-foreground mb-4">
              Deleting your account is permanent and cannot be undone. All your data, including wishlist and reviews, will be removed.
            </p>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete Account</Button>
          </CardContent>
        </Card>
      </div>


      {isEditModalOpen && <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={user} />}
      {isDeleteDialogOpen && <DeleteAccountDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} />}
    </div>
  );
}

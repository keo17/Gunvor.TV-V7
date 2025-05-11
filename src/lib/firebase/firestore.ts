import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";
import type { WishlistItem, Review, ContentItem } from "@/types";
import { getContentById } from "@/lib/data"; // To fetch content details

const WISHLIST_COLLECTION = "wishlists";
const REVIEWS_COLLECTION = "reviews";

// Wishlist Functions
export const addToWishlist = async (userId: string, contentId: string): Promise<string> => {
  // Check if already in wishlist to prevent duplicates (optional, depends on desired UX)
  const q = query(
    collection(db, WISHLIST_COLLECTION),
    where("userId", "==", userId),
    where("contentId", "==", contentId)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Item already exists, perhaps return existing ID or throw error
    return querySnapshot.docs[0].id; 
  }

  const docRef = await addDoc(collection(db, WISHLIST_COLLECTION), {
    userId,
    contentId,
    addedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const removeFromWishlist = async (userId: string, wishlistItemId: string): Promise<void> => {
  // In this setup, wishlistItemId is the Firestore document ID.
  // If you only have contentId, you'd query first to find the document ID.
  const docRef = doc(db, WISHLIST_COLLECTION, wishlistItemId);
  await deleteDoc(docRef);
};

export const getWishlist = async (userId: string): Promise<WishlistItem[]> => {
  const q = query(
    collection(db, WISHLIST_COLLECTION),
    where("userId", "==", userId),
    orderBy("addedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const wishlist: WishlistItem[] = [];
  for (const document of querySnapshot.docs) {
    const data = document.data();
    const contentItem = await getContentById(data.contentId); // Fetch content details
    wishlist.push({
      id: document.id,
      userId: data.userId,
      contentId: data.contentId,
      addedAt: (data.addedAt as Timestamp)?.toDate() || new Date(), // Handle serverTimestamp
      content: contentItem, // Populate content
    });
  }
  return wishlist;
};

// Review Functions (Placeholder - implement as needed)
export const addReview = async (userId: string, contentId: string, rating: number, text: string): Promise<string> => {
  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
    userId,
    contentId,
    rating,
    text,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getReviewsForContent = async (contentId: string): Promise<Review[]> => {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where("contentId", "==", contentId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate(),
  } as Review));
};

export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate(),
  } as Review));
};

export const updateReview = async (reviewId: string, rating: number, text: string): Promise<void> => {
  // Placeholder for update logic
  console.log("Updating review:", reviewId, rating, text);
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  // Placeholder for delete logic
  console.log("Deleting review:", reviewId);
};

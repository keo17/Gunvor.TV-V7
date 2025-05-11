import type { User as FirebaseUser } from 'firebase/auth';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'series';
  imageUrl: string;
  videoUrl: string;
  genre: string[];
  rating?: number; // Optional, might not be available for all items
  duration?: string; // e.g., "2h 15min" or "45min"
  language?: string;
  releaseDate?: string; // e.g., "2023-10-26"
  creators?: { id: string; name: string; role?: string }[]; // Simplified creator info
  collectionIds?: string[];
  tags?: string[]; // For "New", "Featured", etc.
  cast?: { name: string; role: string; avatarUrl?: string }[];
  seasons?: Season[]; // For series
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Episode {
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  duration?: string;
}

export interface Creator {
  id: string;
  name: string;
  avatarUrl?: string;
  bio: string;
  socialMediaLinks?: { platform: string; url: string }[];
  contentIds?: string[]; // IDs of content created by them
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  contentIds: string[];
  imageUrl?: string; // Optional image for the collection
}

export interface UserProfile extends FirebaseUser {
  // Extend with any custom profile fields if necessary
  // For example:
  // username?: string;
  // bio?: string;
}

export interface Review {
  id: string;
  userId: string;
  userDisplayName?: string;
  userAvatarUrl?: string;
  contentId: string;
  rating: number; // 1-5
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface WishlistItem {
  id: string; // Firestore document ID
  userId: string;
  contentId: string;
  addedAt: Date;
  content?: ContentItem; // Optionally populate content details
}

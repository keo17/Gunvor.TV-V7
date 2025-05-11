import type { User as FirebaseUser } from 'firebase/auth';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'series'; // 'short_film' will be mapped to 'movie'
  imageUrl?: string; // Optional as it might not always be present
  videoUrl?: string; // Optional
  genre?: string[];
  rating?: number; // Optional, may not be in new data
  duration?: string; // e.g., "2h 15min" or "45min"
  language?: string;
  releaseDate?: string; // e.g., "2023-10-26"
  creators?: { id: string; name: string; role?: string }[]; // Populated from creator_ids
  tags?: string[];
  cast?: { name: string; role: string; avatarUrl?: string }[];
  seasons?: Season[]; // For series, optional
  // Raw fields from JSON, might be useful for intermediate processing
  creatorIds?: string[]; 
  durationInSeconds?: number;
  viewCount?: number; // Added for new layout
  reviewCount?: number; // Added for new layout
  behindTheScenesImages?: string[]; // Added for new layout
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
  email?: string;
  socialMediaLinks?: { [platform: string]: string }; // Changed to object
  contentIds?: string[]; // IDs of content created by them
}

export interface UserProfile extends FirebaseUser {
  // Extend with any custom profile fields if necessary
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

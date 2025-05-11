import type { ContentItem, Creator, Collection } from '@/types';

// Use placeholder URLs for now, replace with actual R2 URLs
const CONTENT_JSON_URL = process.env.NEXT_PUBLIC_CONTENT_JSON_URL || 'https://pub-3506313670324029912ed8991909429f.r2.dev/Done/abuur_media_short_films.json';
const CREATORS_JSON_URL = process.env.NEXT_PUBLIC_CREATORS_JSON_URL || 'https://pub-3506313670324029912ed8991909429f.r2.dev/Creators/creators.json';

// Basic cache for fetched data to avoid refetching during the same request lifecycle or short periods
// For more robust caching, consider Next.js fetch cache revalidation options.
let contentCache: ContentItem[] | null = null;
let creatorsCache: Creator[] | null = null;
let collectionsCache: Collection[] | null = null;

const fetchData = async <T>(url: string, cacheVar: T[] | null, setter: (data: T[]) => void): Promise<T[]> => {
  if (cacheVar) {
    return cacheVar;
  }
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    // Ensure data is an array, as some JSON files might be objects with an array property
    const dataArray = Array.isArray(data) ? data : (data.items || data.results || []); 
    setter(dataArray);
    return dataArray;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return []; // Return empty array on error
  }
};

export async function getContentItems(): Promise<ContentItem[]> {
  return fetchData<ContentItem>(CONTENT_JSON_URL, contentCache, (data) => contentCache = data);
}

export async function getCreators(): Promise<Creator[]> {
   return fetchData<Creator>(CREATORS_JSON_URL, creatorsCache, (data) => creatorsCache = data);
}

export async function getContentById(id: string): Promise<ContentItem | undefined> {
  const items = await getContentItems();
  return items.find(item => item.id === id);
}

export async function getCreatorById(id: string): Promise<Creator | undefined> {
  const creators = await getCreators();
  return creators.find(creator => creator.id === id);
}

// Mock collections data or derive from content items
export async function getCollections(): Promise<Collection[]> {
  if (collectionsCache) return collectionsCache;

  const contentItems = await getContentItems();
  const collectionsMap = new Map<string, Collection>();

  // Example of deriving collections if content items have collectionIds
  contentItems.forEach(item => {
    if (item.collectionIds) {
      item.collectionIds.forEach(collectionId => {
        if (!collectionsMap.has(collectionId)) {
          // Create a mock collection if details are not available
          collectionsMap.set(collectionId, {
            id: collectionId,
            name: `Collection ${collectionId.charAt(0).toUpperCase() + collectionId.slice(1)}`, // e.g., "Collection Action"
            description: `A collection of exciting ${collectionId} content.`,
            contentIds: [],
            imageUrl: `https://picsum.photos/seed/${collectionId}/600/400` // Placeholder image
          });
        }
        collectionsMap.get(collectionId)?.contentIds.push(item.id);
      });
    }
  });
  
  // If no collections derived, use some static mock data
  if (collectionsMap.size === 0) {
     collectionsCache = [
        { id: 'featured', name: 'Featured Content', description: 'Our top picks for you.', contentIds: contentItems.slice(0, 5).map(ci => ci.id), imageUrl: 'https://picsum.photos/seed/featured/600/400' },
        { id: 'new-releases', name: 'New Releases', description: 'The latest movies and series.', contentIds: contentItems.slice(5, 10).map(ci => ci.id), imageUrl: 'https://picsum.photos/seed/new/600/400' },
        { id: 'action', name: 'Action Packed', description: 'Thrilling action adventures.', contentIds: contentItems.filter(ci => ci.genre?.includes('Action')).slice(0,5).map(ci => ci.id), imageUrl: 'https://picsum.photos/seed/action/600/400' },
     ];
     return collectionsCache;
  }


  collectionsCache = Array.from(collectionsMap.values());
  return collectionsCache;
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  const collections = await getCollections();
  return collections.find(collection => collection.id === id);
}

export async function getRelatedContent(contentId: string, type?: 'movie' | 'series', currentGenres?: string[]): Promise<ContentItem[]> {
  const allContent = await getContentItems();
  const currentContent = allContent.find(c => c.id === contentId);

  if (!currentContent) return [];

  const related = allContent.filter(item => {
    if (item.id === contentId) return false; // Exclude current item
    if (type && item.type !== type) return false; // Match type if specified

    // Simple genre matching
    if (currentGenres && currentGenres.length > 0 && item.genre) {
      return item.genre.some(g => currentGenres.includes(g));
    }
    // Fallback: if no genres provided for current item, or item has no genres, don't filter by genre
    return true; 
  });

  return related.slice(0, 10); // Limit to 10 related items
}

// Utility for Random Shuffle
export async function getRandomContentItem(): Promise<ContentItem | undefined> {
  const items = await getContentItems();
  if (items.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export async function searchContent(query: string): Promise<ContentItem[]> {
  if (!query) return [];
  const items = await getContentItems();
  const lowerCaseQuery = query.toLowerCase();
  return items.filter(item => 
    item.title.toLowerCase().includes(lowerCaseQuery) ||
    item.description.toLowerCase().includes(lowerCaseQuery) ||
    (item.genre && item.genre.some(g => g.toLowerCase().includes(lowerCaseQuery)))
  );
}

import type { ContentItem, Creator } from '@/types';

const CONTENT_JSON_URL = 'https://pub-dc5d8d6f2f7645ceb824919e8889fa94.r2.dev/abuur_media_short_films.json';
const CREATORS_JSON_URL = 'https://pub-dc5d8d6f2f7645ceb824919e8889fa94.r2.dev/Creators/Creators/creators.json';

let allCreatorsCache: Creator[] | null = null;
let allContentItemsCache: ContentItem[] | null = null;

async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}: ${response.statusText} (${response.status})`);
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error; // Re-throw to be caught by callers or error boundaries
  }
}

// This function might still be useful if some data sources provide duration in seconds
// and others provide it as a formatted string.
function formatDuration(totalSeconds?: number): string | undefined {
  if (totalSeconds === undefined || isNaN(totalSeconds) || totalSeconds < 0) {
    return undefined;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  let durationString = "";
  if (hours > 0) {
    durationString += `${hours}h `;
  }
  if (minutes > 0 || (hours === 0 && totalSeconds > 0) ) { 
    durationString += `${minutes}min`;
  }
  
  if (durationString.trim() === "" && totalSeconds > 0) return `${totalSeconds}s`; 
  if (durationString.trim() === "" && totalSeconds === 0) return "0min";

  return durationString.trim() || undefined;
}


export async function getCreators(): Promise<Creator[]> {
  if (allCreatorsCache) {
    return allCreatorsCache;
  }
  const rawCreators = await fetchData<any[]>(CREATORS_JSON_URL);
  allCreatorsCache = rawCreators.map(creator => ({
    id: creator.id,
    name: creator.name,
    bio: creator.bio,
    avatarUrl: creator.avatar_url, // Assuming creators.json still uses avatar_url
    email: creator.email,
    socialMediaLinks: creator.social_media_links,
    contentIds: creator.content_ids,
  }));
  return allCreatorsCache;
}

export async function getContentItems(): Promise<ContentItem[]> {
  if (allContentItemsCache) {
    return allContentItemsCache;
  }

  const rawContentItems = await fetchData<any[]>(CONTENT_JSON_URL);
  const creators = await getCreators(); 

  const items = rawContentItems.map(item => {
    const itemCreators = item.creatorId // Use new single creatorId field
      ? (() => {
          const foundCreator = creators.find(c => c.id === item.creatorId);
          return foundCreator ? [{ id: foundCreator.id, name: foundCreator.name, role: undefined as string | undefined }] : undefined;
        })()
      : (item.creator_ids && Array.isArray(item.creator_ids) // Fallback to old creator_ids if new one is not present
          ? item.creator_ids.map((creatorId: string) => {
              const foundCreator = creators.find(c => c.id === creatorId);
              return foundCreator ? { id: foundCreator.id, name: foundCreator.name, role: undefined as string | undefined } : null;
            }).filter(Boolean)
          : undefined);

    const resolvedGenre = typeof item.genre === 'string' 
      ? [item.genre] 
      : (Array.isArray(item.genre) ? item.genre : (Array.isArray(item.genres) ? item.genres : undefined));

    const resolvedDuration = item.duration || formatDuration(item.duration_in_seconds);

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      type: (item.type === 'short_film' || item.type === 'movies') ? 'movie' : item.type,
      imageUrl: item.posterUrl || `https://picsum.photos/seed/${item.id}/400/600`, // Use item.posterUrl
      videoUrl: item.videoUrl, // Use item.videoUrl
      genre: resolvedGenre,
      rating: item.rating,
      duration: resolvedDuration,
      language: item.language,
      releaseDate: item.production_date || item.release_date, // Check both potential date fields
      creators: itemCreators,
      tags: item.tags,
      cast: item.actors?.map((actorName: string) => ({ name: actorName, role: 'Actor' })) || [],
      seasons: item.type === 'series' ? item.seasons : undefined, 
      creatorIds: item.creatorId ? [item.creatorId] : item.creator_ids, // Store creatorId(s)
      durationInSeconds: item.duration_in_seconds, // Keep if available, used by formatDuration fallback
    };
  });
  allContentItemsCache = items;
  return allContentItemsCache;
}


export async function getContentById(id: string): Promise<ContentItem | undefined> {
  const items = await getContentItems(); 
  return items.find(item => item.id === id);
}

export async function getCreatorById(id: string): Promise<Creator | undefined> {
  const creators = await getCreators();
  return creators.find(creator => creator.id === id);
}

export async function getRelatedContent(contentId: string, type?: 'movie' | 'series', currentGenres?: string[]): Promise<ContentItem[]> {
  const allContent = await getContentItems();
  const currentContent = allContent.find(c => c.id === contentId);

  if (!currentContent) return [];

  let related = allContent.filter(item => {
    if (item.id === contentId) return false; 
    if (type && item.type !== type) return false; 

    if (currentGenres && currentGenres.length > 0 && item.genre && item.genre.length > 0) {
      return item.genre.some(g => currentGenres.includes(g));
    }
    if (type) return item.type === type; 

    return true; 
  });

  return related.sort(() => 0.5 - Math.random()).slice(0, 10);
}


export async function searchContent(query: string): Promise<ContentItem[]> {
  if (!query) return [];
  const items = await getContentItems();
  const lowerCaseQuery = query.toLowerCase();
  return items.filter(item =>
    item.title.toLowerCase().includes(lowerCaseQuery) ||
    (item.description && item.description.toLowerCase().includes(lowerCaseQuery)) ||
    (item.genre && item.genre.some(g => g.toLowerCase().includes(lowerCaseQuery))) ||
    (item.tags && item.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)))
  );
}

// Helper to get a random content item, used for shuffle button
export async function getRandomContentItem(): Promise<ContentItem | undefined> {
  const items = await getContentItems();
  if (items.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

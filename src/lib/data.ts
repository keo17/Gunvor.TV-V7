
import type { ContentItem, Creator, Collection } from '@/types';

// Mock data to replace R2 fetching due to 401 errors
const mockContentItems: ContentItem[] = [
  {
    id: 'movie1',
    title: 'Epic Adventure',
    description: 'An epic adventure through mountains and valleys.',
    type: 'movie',
    imageUrl: 'https://picsum.photos/seed/movie1/400/600',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    genre: ['Action', 'Adventure'],
    rating: 8.5,
    duration: '2h 30min',
    language: 'English',
    releaseDate: '2023-01-15',
    creators: [{ id: 'creator1', name: 'Jane Doe', role: 'Director' }],
    collectionIds: ['featured', 'action'],
    tags: ['Featured', 'Popular'],
    cast: [{ name: 'John Smith', role: 'Hero' }, { name: 'Alice Wonderland', role: 'Guide'}]
  },
  {
    id: 'series1',
    title: 'Mystery of the Lost City',
    description: 'A thrilling series uncovering ancient secrets.',
    type: 'series',
    imageUrl: 'https://picsum.photos/seed/series1/400/600',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', // Main series trailer or link
    genre: ['Mystery', 'Thriller'],
    rating: 9.0,
    language: 'English',
    releaseDate: '2023-05-20',
    creators: [{ id: 'creator2', name: 'Robert Downy', role: 'Writer' }],
    collectionIds: ['featured', 'new-releases'],
    tags: ['New', 'Critically Acclaimed'],
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: 'The First Clue', description: 'The journey begins.', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: '45min' },
          { episodeNumber: 2, title: 'Into the Unknown', description: 'Deeper into the mystery.', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: '48min' },
        ]
      }
    ]
  },
  {
    id: 'movie2',
    title: 'Cosmic Odyssey',
    description: 'A journey to the stars and beyond.',
    type: 'movie',
    imageUrl: 'https://picsum.photos/seed/movie2/400/600',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    genre: ['Sci-Fi', 'Adventure'],
    rating: 7.9,
    duration: '2h 10min',
    language: 'English',
    releaseDate: '2022-11-05',
    creators: [{ id: 'creator1', name: 'Jane Doe', role: 'Director' }],
    collectionIds: ['action'],
    tags: ['Popular']
  },
   {
    id: 'movie3',
    title: 'The Last Stand',
    description: 'A group of heroes make their last stand against an invading force.',
    type: 'movie',
    imageUrl: 'https://picsum.photos/seed/movie3/400/600',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    genre: ['Action', 'War'],
    rating: 8.2,
    duration: '2h 05min',
    language: 'English',
    releaseDate: '2023-07-21',
    creators: [{ id: 'creator3', name: 'Mike Johnson', role: 'Director' }],
    collectionIds: ['action', 'featured'],
  },
  {
    id: 'series2',
    title: 'Chronicles of Eldoria',
    description: 'A fantasy epic about a magical kingdom.',
    type: 'series',
    imageUrl: 'https://picsum.photos/seed/series2/400/600',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    genre: ['Fantasy', 'Adventure'],
    rating: 8.8,
    language: 'English',
    releaseDate: '2024-01-10',
    creators: [{ id: 'creator4', name: 'Sarah Williams', role: 'Showrunner' }],
    collectionIds: ['new-releases'],
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: 'The Prophecy Unfolds', description: 'A new hero emerges.', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: '50min' },
          { episodeNumber: 2, title: 'The Shadow Rises', description: 'A dark threat looms.', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: '52min' },
        ]
      }
    ]
  },
  // Add 15 more items for variety
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `movie${i + 4}`,
    title: `Action Movie ${i + 1}`,
    description: `An exciting action movie number ${i + 1}.`,
    type: 'movie' as 'movie' | 'series',
    imageUrl: `https://picsum.photos/seed/actionmovie${i + 1}/400/600`,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    genre: ['Action', i % 2 === 0 ? 'Thriller' : 'Adventure'],
    rating: 7.0 + (i % 10) / 10,
    duration: `1h ${45 + i}min`,
    language: 'English',
    releaseDate: `2023-03-${10 + i}`,
    creators: [{ id: `creator${(i % 2) + 1}`, name: i % 2 === 0 ? 'Jane Doe' : 'Robert Downy', role: 'Director' }],
    collectionIds: ['action'],
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `series${i + 3}`,
    title: `Drama Series ${i + 1}`,
    description: `A captivating drama series number ${i + 1}.`,
    type: 'series' as 'movie' | 'series',
    imageUrl: `https://picsum.photos/seed/dramaseries${i + 1}/400/600`,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    genre: ['Drama', i % 2 === 0 ? 'Romance' : 'Family'],
    rating: 7.5 + (i % 10) / 10,
    language: 'English',
    releaseDate: `2023-04-${10 + i}`,
    creators: [{ id: `creator${(i % 2) + 3}`, name: i % 2 === 0 ? 'Mike Johnson' : 'Sarah Williams', role: 'Creator' }],
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: 'Pilot', description: 'Series begins.', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: '42min' },
        ]
      }
    ],
    collectionIds: ['new-releases'],
  }))
];

const mockCreators: Creator[] = [
  {
    id: 'creator1',
    name: 'Jane Doe',
    avatarUrl: 'https://picsum.photos/seed/creator1/200/200',
    bio: 'Award-winning director known for visually stunning action films and compelling sci-fi narratives. Jane has over a decade of experience in the film industry.',
    socialMediaLinks: [{ platform: 'twitter', url: 'https://twitter.com/janedoe' }],
    contentIds: ['movie1', 'movie2']
  },
  {
    id: 'creator2',
    name: 'Robert Downy',
    avatarUrl: 'https://picsum.photos/seed/creator2/200/200',
    bio: 'Master storyteller specializing in mystery and thriller genres. Robert has penned several best-selling novels before transitioning to screenwriting.',
    socialMediaLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/in/robertdowny' }],
    contentIds: ['series1']
  },
  {
    id: 'creator3',
    name: 'Mike Johnson',
    avatarUrl: 'https://picsum.photos/seed/creator3/200/200',
    bio: 'Action director with a knack for intense fight choreography and large-scale battles. Mike is a veteran in the action genre.',
    contentIds: ['movie3']
  },
  {
    id: 'creator4',
    name: 'Sarah Williams',
    avatarUrl: 'https://picsum.photos/seed/creator4/200/200',
    bio: 'Visionary showrunner known for creating immersive fantasy worlds and complex characters. Sarah has a strong background in literature and mythology.',
    contentIds: ['series2']
  }
];

const mockCollections: Collection[] = [
  {
    id: 'featured',
    name: 'Featured Content',
    description: 'Our top picks and most popular movies and series.',
    contentIds: ['movie1', 'series1', 'movie3'],
    imageUrl: 'https://picsum.photos/seed/featured_collection/600/400'
  },
  {
    id: 'new-releases',
    name: 'New Releases',
    description: 'The latest additions to our catalog.',
    contentIds: ['series1', 'series2'],
    imageUrl: 'https://picsum.photos/seed/new_releases_collection/600/400'
  },
  {
    id: 'action',
    name: 'Action Packed',
    description: 'Thrilling action adventures and blockbusters.',
    contentIds: ['movie1', 'movie2', 'movie3', ...mockContentItems.filter(ci => ci.genre.includes('Action') && !['movie1','movie2','movie3'].includes(ci.id)).slice(0,2).map(ci => ci.id)],
    imageUrl: 'https://picsum.photos/seed/action_collection/600/400'
  }
];


export async function getContentItems(): Promise<ContentItem[]> {
  return mockContentItems;
}

export async function getCreators(): Promise<Creator[]> {
   return mockCreators;
}

export async function getContentById(id: string): Promise<ContentItem | undefined> {
  const items = await getContentItems();
  return items.find(item => item.id === id);
}

export async function getCreatorById(id: string): Promise<Creator | undefined> {
  const creators = await getCreators();
  return creators.find(creator => creator.id === id);
}

export async function getCollections(): Promise<Collection[]> {
  return mockCollections;
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
    // Or, if this causes too few results, match by type primarily
    if (type) return item.type === type;

    return true;
  });

  // Shuffle and take top N results
  return related.sort(() => 0.5 - Math.random()).slice(0, 10);
}

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

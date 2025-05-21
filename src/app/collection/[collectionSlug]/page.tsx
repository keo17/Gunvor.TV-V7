
import { getContentItems } from "@/lib/data";
import WishlistContentCard from "@/components/content/wishlist-content-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentItem } from "@/types";
import { notFound } from "next/navigation";
import { Film, Tv, Video, Clapperboard, Drama, Globe, Smile, Layers, Landmark, ShieldQuestion } from "lucide-react"; // Added more icons

interface CollectionPageProps {
  params: {
    collectionSlug: string;
  };
}

// Helper function to get title and icon based on slug
const getCollectionDetails = (slug: string) => {
  switch (slug) {
    // Somali Collections
    case "somali_films":
      return { title: "Somali Films", icon: <Film className="h-8 w-8 mr-3 text-primary" />, language: "Somali", tags: ["Somali Movies"], type: "movies" as ContentItem['type'] };
    case "somali_series":
      return { title: "Somali Musalsal", icon: <Tv className="h-8 w-8 mr-3 text-primary" />, language: "Somali", tags: ["Somali Musalsal"], type: "series" as ContentItem['type'] };
    case "somali_short_film":
      return { title: "Somali Short Films", icon: <Video className="h-8 w-8 mr-3 text-primary" />, language: "Somali", tags: ["Somali Short Film"], type: "movies" as ContentItem['type'], maxDuration: 2400, genre: ['"Somali Short Film"'] }; // Max 40 mins
    
    // Hindi Collections
    case "hindi_films":
      return { title: "Hindi Films", icon: <Film className="h-8 w-8 mr-3 text-primary" />, language: "Hindi", type: "movies" as ContentItem['type'] };
    case "hindi_series":
      return { title: "Hindi Musalsal", icon: <Tv className="h-8 w-8 mr-3 text-primary" />, language: "Hindi", type: "series" as ContentItem['type'] };
    case "hindi_short_films":
      return { title: "Hindi Short Films", icon: <Video className="h-8 w-8 mr-3 text-primary" />, language: "Hindi", type: "movies" as ContentItem['type'], maxDuration: 2400 };

    // New Collections from "More" dropdown
    case "recap_kdrama":
      return { title: "Recap Kdrama", icon: <Drama className="h-8 w-8 mr-3 text-primary" />, tags: ["kdrama", "recap"], type: "series" as ContentItem['type'] }; // Assuming recaps are series
    case "hollywood":
      return { title: "Hollywood Movies & Series", icon: <Globe className="h-8 w-8 mr-3 text-primary" />, tags: ["hollywood"], language: "English" };
    case "cartoon":
      return { title: "Cartoons", icon: <Smile className="h-8 w-8 mr-3 text-primary" />, tags: ["cartoon", "animation"], type: "series" as ContentItem['type'] };
    case "recaps": // General recaps
      return { title: "Recaps", icon: <Clapperboard className="h-8 w-8 mr-3 text-primary" />, tags: ["recap"], type: "series" as ContentItem['type'] };
    case "documentary":
      return { title: "Documentaries", icon: <Landmark className="h-8 w-8 mr-3 text-primary" />, genre: ["Documentary"], type: "movies" as ContentItem['type'] };
    case "others":
      return { title: "Other Collections", icon: <Layers className="h-8 w-8 mr-3 text-primary" />, tags: ["other", "miscellaneous"] }; // General catch-all, may need refinement

    default:
      return null;
  }
};

export async function generateMetadata({ params }: CollectionPageProps) {
  const collectionDetails = getCollectionDetails(params.collectionSlug);
  if (!collectionDetails) {
    return { title: "Collection Not Found" };
  }
  return {
    title: `${collectionDetails.title} - Gunvor.TV`,
    description: `Browse ${collectionDetails.title.toLowerCase()} on Gunvor.TV.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionSlug } = params;
  const collectionDetails = getCollectionDetails(collectionSlug);

  if (!collectionDetails) {
    notFound();
  }

  const allContent = await getContentItems();
  
  let filteredItems = allContent.filter(item => {
    let matches = true;
    if (collectionDetails.language && item.language?.toLowerCase() !== collectionDetails.language.toLowerCase()) {
      matches = false;
    }
    if (collectionDetails.type && item.type !== collectionDetails.type) {
      matches = false;
    }
    if (collectionDetails.maxDuration && (item.durationInSeconds === undefined || item.durationInSeconds >= collectionDetails.maxDuration)) {
        matches = false;
    }
      // Add check for genre specifically for somali_short_films
    if (collectionSlug === "somali_short_films" && item.genre && !item.genre.includes("Somali Short Film")) {
       matches = false;
    }
    if (collectionDetails.genre && !item.genre?.some(g => collectionDetails.genre?.includes(g))) {
        matches = false;
    }
    // This check is now handled by the general collectionDetails.genre check above
    // if (collectionSlug === "somali_short_films" && item.genre && !item.genre.includes("Somali Short Film")) {
    if (collectionDetails.tags && !item.tags?.some(t => collectionDetails.tags?.includes(t.toLowerCase()))) {
      if (collectionDetails.tags.some(ct => item.title.toLowerCase().includes(ct) || item.description.toLowerCase().includes(ct))){            // If tag not found in item.tags, check title/description for the tag
      } else {
            matches = false;
        }
    }
    return matches;
  });

  // Simple sort by release date if available, newest first
  filteredItems.sort((a, b) => {
    if (a.releaseDate && b.releaseDate) {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    }
    return 0;
  });


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            {collectionDetails.icon || <ShieldQuestion className="h-8 w-8 mr-3 text-primary" />}
            <CardTitle className="text-3xl md:text-4xl font-bold">{collectionDetails.title}</CardTitle>
          </div>
          <CardDescription>Explore our collection of {collectionDetails.title.toLowerCase()}.</CardDescription>
        </CardHeader>
      </Card>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <WishlistContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No content found for {collectionDetails.title.toLowerCase()}. Please check back later!</p>
        </div>
      )}
    </div>
  );
}

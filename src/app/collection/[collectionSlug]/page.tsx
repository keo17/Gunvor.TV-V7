import { getContentItems } from "@/lib/data";
import WishlistContentCard from "@/components/content/wishlist-content-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentItem } from "@/types";
import { notFound } from "next/navigation";
import { Film, Tv, Video } from "lucide-react"; // Video for short films

interface CollectionPageProps {
  params: {
    collectionSlug: string;
  };
}

// Helper function to get title and icon based on slug
const getCollectionDetails = (slug: string) => {
  switch (slug) {
    case "somali-films":
      return { title: "Somali Films", icon: <Film className="h-8 w-8 mr-3 text-primary" />, language: "Somali", type: "movie" as ContentItem['type'] };
    case "somali-series":
      return { title: "Somali Musalsal", icon: <Tv className="h-8 w-8 mr-3 text-primary" />, language: "Somali", type: "series" as ContentItem['type'] };
    case "somali-short-films":
      return { title: "Somali Short Films", icon: <Video className="h-8 w-8 mr-3 text-primary" />, language: "Somali", type: "movie" as ContentItem['type'], maxDuration: 2400 }; // Max 40 mins
    case "hindi-films":
      return { title: "Hindi Films", icon: <Film className="h-8 w-8 mr-3 text-primary" />, language: "Hindi", type: "movie" as ContentItem['type'] };
    case "hindi-series":
      return { title: "Hindi Musalsal", icon: <Tv className="h-8 w-8 mr-3 text-primary" />, language: "Hindi", type: "series" as ContentItem['type'] };
    case "hindi-short-films":
      return { title: "Hindi Short Films", icon: <Video className="h-8 w-8 mr-3 text-primary" />, language: "Hindi", type: "movie" as ContentItem['type'], maxDuration: 2400 }; // Max 40 mins
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
            {collectionDetails.icon}
            <CardTitle className="text-3xl md:text-4xl font-bold">{collectionDetails.title}</CardTitle>
          </div>
          <CardDescription>Explore our collection of {collectionDetails.title.toLowerCase()}.</CardDescription>
        </CardHeader>
        {/* TODO: Add Search and Sort controls here if needed later */}
      </Card>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <WishlistContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No content found for {collectionDetails.title.toLowerCase()}.</p>
        </div>
      )}
    </div>
  );
}

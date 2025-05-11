import { getCollectionById, getContentItems } from "@/lib/data";
import { notFound } from "next/navigation";
import ContentCard from "@/components/content/content-card";
import type { ContentItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import WishlistContentCard from "@/components/content/wishlist-content-card";

interface CollectionPageProps {
  params: {
    collectionId: string;
  };
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const collection = await getCollectionById(params.collectionId);
  if (!collection) {
    return { title: "Collection Not Found" };
  }
  return {
    title: `${collection.name} - Content Compass`,
    description: collection.description.substring(0, 160),
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollectionById(params.collectionId);

  if (!collection) {
    notFound();
  }

  const allContentItems = await getContentItems();
  const itemsInCollection = allContentItems.filter(item => collection.contentIds.includes(item.id));

  return (
    <div className="container mx-auto py-8 px-4">
       <Card className="mb-8 overflow-hidden shadow-lg">
        {collection.imageUrl && (
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={collection.imageUrl}
              alt={collection.name}
              fill
              className="object-cover"
              data-ai-hint="abstract background"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <CardHeader className={collection.imageUrl ? "relative z-10 pt-6 pb-4 bg-gradient-to-t from-card via-card/80 to-transparent -mt-16 md:-mt-24" : ""}>
          <CardTitle className={`text-3xl md:text-4xl font-bold ${collection.imageUrl ? 'text-foreground' : ''}`}>{collection.name}</CardTitle>
          <CardDescription className={`mt-2 text-base ${collection.imageUrl ? 'text-foreground/80' : ''}`}>{collection.description}</CardDescription>
        </CardHeader>
      </Card>

      {itemsInCollection.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {itemsInCollection.map((item) => (
            <WishlistContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No items found in this collection.</p>
        </div>
      )}
    </div>
  );
}

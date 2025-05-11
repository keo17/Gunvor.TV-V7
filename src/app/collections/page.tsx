import { getCollections } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react"; // Layers icon for collections

export default async function AllCollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Layers className="h-8 w-8 mr-3 text-primary" />
            <CardTitle className="text-3xl md:text-4xl font-bold">All Collections</CardTitle>
          </div>
          <CardDescription>Discover curated collections of movies and series.</CardDescription>
        </CardHeader>
      </Card>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collection/${collection.id}`} className="group block">
              <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out group-hover:scale-[1.02]">
                <div className="relative aspect-video">
                  <Image
                    src={collection.imageUrl || `https://picsum.photos/seed/${collection.id}/600/338`}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="collection theme"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                </div>
                <CardHeader className="relative z-10 pt-4 pb-2 -mt-12 bg-gradient-to-t from-card via-card/80 to-transparent">
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{collection.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{collection.contentIds.length} items</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No collections found.</p>
        </div>
      )}
    </div>
  );
}

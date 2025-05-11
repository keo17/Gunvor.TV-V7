import { getContentItems, getCollections, getCreators } from "@/lib/data";
import ContentRow from "@/components/content/content-row";
import type { Collection, ContentItem } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default async function HomePage() {
  const allContentItems = await getContentItems();
  const collections = await getCollections();
  // const creators = await getCreators(); // Example: If you want a row for creators' top content

  const heroItem = allContentItems.length > 0 ? allContentItems[Math.floor(Math.random() * Math.min(allContentItems.length, 5))] : null;


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {heroItem && (
        <div className="relative mb-12 rounded-lg overflow-hidden shadow-xl aspect-video md:aspect-[16/7]">
          <Image
            src={heroItem.imageUrl || `https://picsum.photos/seed/${heroItem.id}/1200/500`}
            alt={heroItem.title}
            layout="fill"
            objectFit="cover"
            className="brightness-75"
            data-ai-hint="movie scene"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-6 md:p-10 flex flex-col justify-end">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">{heroItem.title}</h1>
            <p className="text-sm md:text-lg text-neutral-300 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 max-w-2xl">{heroItem.description}</p>
            <Button asChild size="lg" className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={`/${heroItem.type}/${heroItem.id}`}>
                Watch Now <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {collections.map((collection) => {
        const collectionItems = allContentItems.filter(item => collection.contentIds.includes(item.id));
        if (collectionItems.length === 0) return null;
        return (
          <ContentRow
            key={collection.id}
            title={collection.name}
            items={collectionItems}
            viewAllLink={`/collection/${collection.id}`}
          />
        );
      })}

      {/* Example: "All Movies" row */}
      <ContentRow
        title="All Movies"
        items={allContentItems.filter(item => item.type === 'movie').slice(0,15)} // Display first 15 movies
        viewAllLink="/movies"
      />

      {/* Example: "All Series" row */}
      <ContentRow
        title="All Series"
        items={allContentItems.filter(item => item.type === 'series').slice(0,15)} // Display first 15 series
        viewAllLink="/series"
      />
    </div>
  );
}

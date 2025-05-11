import { getContentItems } from "@/lib/data";
import ContentRow from "@/components/content/content-row";
import type { ContentItem } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default async function HomePage() {
  const allContentItems = await getContentItems();
  
  // Select a hero item: try to pick one with a good image and description
  const heroItem = allContentItems.length > 0 
    ? allContentItems.find(item => item.imageUrl && item.description && item.imageUrl !== `https://picsum.photos/seed/${item.id}/1200/500`) || allContentItems[Math.floor(Math.random() * allContentItems.length)] 
    : null;


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {heroItem && (
        <div className="relative mb-12 rounded-lg overflow-hidden shadow-xl aspect-video md:aspect-[16/7]">
          <Image
            src={heroItem.imageUrl || `https://picsum.photos/seed/${heroItem.id}/1200/500`}
            alt={heroItem.title}
            fill // Changed from layout="fill" and objectFit="cover"
            className="object-cover brightness-75"
            priority // Ensure hero image loads quickly
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

      {/* "All Movies" row - assuming short_film maps to movie */}
      <ContentRow
        title="All Movies"
        items={allContentItems.filter(item => item.type === 'movie').slice(0,18)} // Display first 18 movies
        viewAllLink="/movies"
      />

      {/* "All Series" row - this might be empty if no series data from new source */}
      <ContentRow
        title="All Series"
        items={allContentItems.filter(item => item.type === 'series').slice(0,18)} // Display first 18 series
        viewAllLink="/series"
      />
    </div>
  );
}

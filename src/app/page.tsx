import { getContentItems } from "@/lib/data";
import ContentRow from "@/components/content/content-row";
import type { ContentItem } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import FeaturedCarousel from "@/components/content/FeaturedCarousel"; // Import the new component

// Define a type that matches what FeaturedCarousel expects
interface FeaturedCarouselItem {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

export default async function HomePage() {
  const allContentItems = await getContentItems();

  // Select and map items for the featured carousel
  const rawFeaturedItems = allContentItems.filter(item => item.imageUrl && item.description).slice(0, 5);

  // Map ContentItem to FeaturedCarouselItem to include the link property
  const featuredItems: FeaturedCarouselItem[] = rawFeaturedItems.map(item => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl!,
    link: `/${item.type === 'short_film' ? 'movie' : item.type}/${item.id}`, // Construct the link
  }));

  // Fallback if fewer than 5 items have descriptions/images
  const finalFeaturedItems = featuredItems.length > 0 ? featuredItems : allContentItems.slice(0, 5).map(item => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl || `https://picsum.photos/seed/${item.id}/1200/500`, // Provide a fallback image URL
    link: `/${item.type === 'short_film' ? 'movie' : item.type}/${item.id}`, // Construct the link
  }));

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Replaced static hero with Featured Carousel */}
      {finalFeaturedItems.length > 0 && (
        <FeaturedCarousel items={finalFeaturedItems} />
      )}

      {/* "All Movies" row - assuming short_film maps to movie */}
      <ContentRow
        title="All Movies"
        items={allContentItems.filter(item => item.type === 'movie' || item.type === 'short_film').slice(0,18)} // Display first 18 movies/short films
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

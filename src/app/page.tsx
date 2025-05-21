
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
    imageUrl: item.imageUrl!, // item.imageUrl is checked in rawFeaturedItems filter
    link: `/${item.type}/${item.id}`, // Corrected: item.type is already transformed from 'short_film' to 'movie' if applicable
  }));

  // Fallback if fewer than 5 items have descriptions/images
  const finalFeaturedItems = featuredItems.length > 0 ? featuredItems : allContentItems.slice(0, 5).map(item => ({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl || `https://placehold.co/1200x500.png`, // Provide a fallback image URL using placehold.co
    link: `/${item.type}/${item.id}`, // Corrected: item.type is already transformed
  }));

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Replaced static hero with Featured Carousel */}
      {finalFeaturedItems.length > 0 && (
        <FeaturedCarousel items={finalFeaturedItems} />
      )}

      {/* "All Movies" row - type 'short_film' is mapped to 'movie' in getContentItems */}
      <ContentRow
        title="All Movies"
        items={allContentItems.filter(item => item.type === 'movie').slice(0,18)} // Simplified filter
        viewAllLink="/movies"
      />

      {/* "All Series" row */}
      <ContentRow
        title="All Series"
        items={allContentItems.filter(item => item.type === 'series').slice(0,18)} // Display first 18 series
        viewAllLink="/series"
      />
    </div>
  );
}


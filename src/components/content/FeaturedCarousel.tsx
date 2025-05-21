"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedContent {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

interface FeaturedCarouselProps {
  items: FeaturedContent[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
  const [shuffledContent, setShuffledContent] = useState<FeaturedContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shuffle content on initial load and when items prop changes
  useEffect(() => {
    if (items && items.length > 0) {
      setShuffledContent(shuffleArray([...items]));
    }
  }, [items]);

  useEffect(() => {
    if (shuffledContent.length <= 1) return; // Don't start interval if 0 or 1 item

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledContent.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [shuffledContent.length]);

  // Fisher-Yates (aka Knuth) Shuffle algorithm
  const shuffleArray = (array: FeaturedContent[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  if (shuffledContent.length === 0) {
    return null; // Don't render if no content
  }

  const currentItem = shuffledContent[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl aspect-[3/2] md:aspect-[16/7] mb-12">
      <Link href={currentItem.link} className="block w-full h-full">
        <Image
          src={currentItem.imageUrl}
          alt={currentItem.title}
          fill={true}
          className="object-cover brightness-75 transition-transform duration-500 ease-in-out transform hover:scale-105"
          priority // Ensure hero image loads quickly
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint="featured movie scene"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-6 md:p-10 flex flex-col justify-end">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">
            {currentItem.title}
          </h1>
          {/* Add description or other details here if available in FeaturedContent type */}
          {/* <p className="text-sm md:text-lg text-neutral-300 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 max-w-2xl">{currentItem.description}</p> */}
          {/* Add a call to action button if needed */}
          {/* <Button asChild size="lg" className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={currentItem.link}>
              Watch Now <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button> */}
        </div>
        {/* Clickable overlay */}
        <span className="absolute inset-0 z-10" aria-hidden="true"></span>
      </Link>
      {/* Add carousel indicators or controls here if desired */}
    </div>
  );
};

export default FeaturedCarousel;

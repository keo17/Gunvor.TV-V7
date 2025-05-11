import Link from "next/link";
import ContentCard from "./content-card";
import type { ContentItem, WishlistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import WishlistContentCard from "./wishlist-content-card";

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  viewAllLink?: string;
  displayLimit?: number;
}

export default function ContentRow({ title, items, viewAllLink, displayLimit = 20 }: ContentRowProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const displayedItems = items.slice(0, displayLimit);

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {viewAllLink && items.length > 5 && ( // Only show "View All" if there are more than 5 items to make it meaningful
          <Button variant="link" asChild className="text-accent hover:text-accent/80">
            <Link href={viewAllLink}>
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {displayedItems.map((item) => (
            // Using WishlistContentCard to handle wishlist state internally via useAuth
            <WishlistContentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

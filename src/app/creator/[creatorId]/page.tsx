import { getCreatorById, getContentItems } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WishlistContentCard from "@/components/content/wishlist-content-card";
import type { ContentItem, Creator } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin, Youtube, Globe } from "lucide-react"; 
import Link from "next/link";

interface CreatorPageProps {
  params: {
    creatorId: string;
  };
}

export async function generateMetadata({ params }: CreatorPageProps) {
  const creator = await getCreatorById(params.creatorId);
  if (!creator) {
    return { title: "Creator Not Found" };
  }
  return {
    title: `${creator.name} - Gunvor.TV`,
    description: creator.bio ? creator.bio.substring(0, 160) : `Content by ${creator.name}`,
  };
}

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "twitter": return <Twitter className="h-5 w-5" />;
    case "instagram": return <Instagram className="h-5 w-5" />;
    case "linkedin": return <Linkedin className="h-5 w-5" />;
    case "youtube": return <Youtube className="h-5 w-5" />;
    default: return <Globe className="h-5 w-5" />; // Default for other platforms like website, etc.
  }
};

export default async function CreatorPage({ params }: CreatorPageProps) {
  const creator = await getCreatorById(params.creatorId);

  if (!creator) {
    notFound();
  }

  const allContentItems = await getContentItems();
  // Filter content items that list this creator
  const creatorContent = allContentItems.filter(item => 
    (item.creatorIds && item.creatorIds.includes(creator.id)) || // If content lists creator by ID (new structure)
    (creator.contentIds && creator.contentIds.includes(item.id)) // If creator lists content by ID
  );

  const socialLinks = creator.socialMediaLinks ? Object.entries(creator.socialMediaLinks) : [];


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 md:p-8 border-b">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-md">
              <AvatarImage src={creator.avatarUrl || `https://picsum.photos/seed/${creator.id}/200/200`} alt={creator.name} data-ai-hint="person photo" />
              <AvatarFallback className="text-5xl">{creator.name ? creator.name.substring(0, 1).toUpperCase() : "C"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-3xl md:text-4xl font-bold">{creator.name}</CardTitle>
              {/* Placeholder for creator role/title if available */}
              {/* <CardDescription className="text-lg text-muted-foreground mt-1">Filmmaker / Director</CardDescription> */}
              <div className="mt-4 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                <p className="text-muted-foreground line-clamp-4">{creator.bio}</p>
              </div>
              {socialLinks.length > 0 && (
                <div className="mt-4 flex justify-center md:justify-start space-x-3">
                  {socialLinks.map(([platform, url]) => (
                    <Button key={platform} variant="outline" size="icon" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer" aria-label={platform}>
                        <SocialIcon platform={platform} />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6">Content by {creator.name}</h2>
        {creatorContent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {creatorContent.map((item) => (
              <WishlistContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No content found for this creator.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { getContentById, getRelatedContent } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tv, CalendarDays, Star, Clapperboard, Users, MessageSquare, Share2, Play, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WishlistButton from "@/components/content/wishlist-button";
import PlayClientButton from "@/components/content/play-client-button";
import ReviewSection from "@/components/content/review-section";
import { Button } from "@/components/ui/button";
import WishlistContentCard from "@/components/content/wishlist-content-card";

interface SeriesPageProps {
  params: {
    seriesId: string;
  };
}

export async function generateMetadata({ params }: SeriesPageProps) {
  const series = await getContentById(params.seriesId);
  if (!series || series.type !== 'series') {
    return { title: "Series Not Found" };
  }
  return {
    title: `${series.title} - Gunvor.TV`,
    description: series.description ? series.description.substring(0, 160) : `Details for ${series.title}`,
  };
}

// Dummy data for view count and review count
const viewCount = 55432; // Dummy
const reviewCount = 288; // Dummy

export default async function SeriesPage({ params }: SeriesPageProps) {
  const series = await getContentById(params.seriesId);

  if (!series || series.type !== 'series') {
    notFound();
  }

  const relatedSeries = await getRelatedContent(series.id, 'series', series.genre);
  const seriesCreators = series.creators || [];
  const totalEpisodes = series.seasons?.reduce((acc, season) => acc + season.episodes.length, 0) || 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Left Column: Poster */}
        <div className="md:col-span-1">
          <Image
            src={series.imageUrl || `https://picsum.photos/seed/${series.id}/400/600`}
            alt={`${series.title} Poster`}
            width={400}
            height={600}
            className="rounded-lg shadow-xl object-cover aspect-[2/3] w-full"
            priority
            data-ai-hint="series poster"
          />
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-1">{series.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-2 mb-4">
            {series.seasons && <span>{series.seasons.length} Season{series.seasons.length === 1 ? '' : 's'}</span>}
            {totalEpisodes > 0 && <span>• {totalEpisodes} Episode{totalEpisodes === 1 ? '' : 's'}</span>}
            {series.genre?.[0] && <span>• {series.genre[0]}</span>}
            {series.language && <span>• {series.language}</span>}
          </div>

          <PlayClientButton 
            videoUrl={series.seasons?.[0]?.episodes?.[0]?.videoUrl || series.videoUrl} 
            className="w-full md:w-auto mb-4 bg-accent hover:bg-accent/90 text-accent-foreground" 
            size="lg"
          >
            Play S1 E1
          </PlayClientButton>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            {series.rating && (
              <span className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" /> {series.rating.toFixed(1)}
              </span>
            )}
             <span className="flex items-center">
              <Users className="mr-1 h-4 w-4" /> ({reviewCount})
            </span>
            <span className="flex items-center">
               <EyeIcon className="mr-1 h-4 w-4" /> {viewCount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" /> Rate & Review
            </Button>
             <WishlistButton contentItem={series} variant="outline" />
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>

          <p className="text-foreground/80 mb-8">{series.description}</p>
        </div>
      </div>

       {/* Details Section */}
       <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {series.releaseDate && <p><span className="font-semibold text-muted-foreground">First Aired • </span> {series.releaseDate}</p>}
            {series.genre && series.genre.length > 0 && <p><span className="font-semibold text-muted-foreground">Genre • </span> {series.genre.join(', ')}</p>}
            {series.language && <p><span className="font-semibold text-muted-foreground">Languages • </span> {series.language}</p>}
            {series.seasons && <p><span className="font-semibold text-muted-foreground">Seasons • </span> {series.seasons.length}</p>}
            {totalEpisodes > 0 && <p><span className="font-semibold text-muted-foreground">Total Episodes • </span> {totalEpisodes}</p>}
             {series.tags && series.tags.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-muted-foreground">Tags • </span>
                    {series.tags.map(tag => <Badge key={tag} variant="secondary" className="mr-1 mb-1">{tag}</Badge>)}
                </div>
              )}
          </div>
        </div>


      {/* Episodes Section */}
      {series.seasons && series.seasons.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue={`season-${series.seasons[0].seasonNumber}`}>
              {series.seasons.map((season) => (
                <AccordionItem value={`season-${season.seasonNumber}`} key={season.seasonNumber}>
                  <AccordionTrigger className="text-xl font-semibold hover:no-underline">Season {season.seasonNumber} ({season.episodes.length} episodes)</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 pt-2">
                      {season.episodes.map((episode) => (
                        <li key={episode.episodeNumber} className="p-4 border rounded-md hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-lg">E{episode.episodeNumber}: {episode.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{episode.description}</p>
                            </div>
                            <PlayClientButton videoUrl={episode.videoUrl} buttonText="Play Episode" variant="outline" size="sm" className="mt-1 ml-4 shrink-0" />
                          </div>
                          {episode.duration && <p className="text-xs text-muted-foreground mt-2">Duration: {episode.duration}</p>}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Creators Section */}
      {seriesCreators.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {seriesCreators.map((creator) => creator && (
                <Link key={creator.id} href={`/creator/${creator.id}`} className="group text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-2 shadow-md group-hover:ring-2 group-hover:ring-primary transition-all">
                    <AvatarImage src={`https://picsum.photos/seed/${creator.id}/100/100`} alt={creator.name} data-ai-hint="person face"/>
                    <AvatarFallback>{creator.name ? creator.name.substring(0, 2).toUpperCase() : "N/A"}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium group-hover:text-primary">{creator.name}</p>
                  {creator.role && (
                    <p className="text-xs text-muted-foreground">{creator.role}</p>
                  )}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <ReviewSection contentId={series.id} contentType="series" />

      {/* More Like This Section */}
      {relatedSeries.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {relatedSeries.slice(0, 6).map(relatedItem => (
              <WishlistContentCard key={relatedItem.id} item={relatedItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

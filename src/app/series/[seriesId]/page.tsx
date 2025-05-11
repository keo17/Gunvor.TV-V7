import { getContentById, getRelatedContent, getCreators } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tv, CalendarDays, Users, Star, PlayCircle, Heart, Clapperboard, Info } from "lucide-react";
import ContentRow from "@/components/content/content-row";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WishlistButton from "@/components/content/wishlist-button";
import PlayClientButton from "@/components/content/play-client-button";
import ReviewSection from "@/components/content/review-section";

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
    description: series.description.substring(0, 160),
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const series = await getContentById(params.seriesId);

  if (!series || series.type !== 'series') {
    notFound();
  }

  const relatedSeries = await getRelatedContent(series.id, 'series', series.genre);
  const allCreators = await getCreators();
  const seriesCreators = series.creators?.map(sc => allCreators.find(ac => ac.id === sc.id)).filter(Boolean) || [];
  const totalEpisodes = series.seasons?.reduce((acc, season) => acc + season.episodes.length, 0) || 0;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="relative mb-8 md:mb-12 rounded-lg overflow-hidden shadow-xl min-h-[60vh] md:min-h-[70vh] flex items-end p-6 md:p-10 bg-background">
        <div className="absolute inset-0 z-0">
          <Image
            src={series.imageUrl || `https://picsum.photos/seed/${series.id}/1200/800`}
            alt={series.title}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint="series background"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-end">
          <div className="md:col-span-1 hidden md:block">
            <Image
              src={series.imageUrl || `https://picsum.photos/seed/${series.id}/400/600`}
              alt={`${series.title} Poster`}
              width={400}
              height={600}
              className="rounded-lg shadow-2xl object-cover aspect-[2/3]"
              data-ai-hint="series poster"
            />
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">{series.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {series.genre?.map((g) => (
                <Badge key={g} variant="outline" className="text-sm bg-background/70 backdrop-blur-sm">{g}</Badge>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
              {series.releaseDate && (
                <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> {new Date(series.releaseDate).getFullYear()}</span>
              )}
              {series.seasons && (
                <span className="flex items-center"><Tv className="mr-1.5 h-4 w-4" /> {series.seasons.length} Season{series.seasons.length === 1 ? '' : 's'}</span>
              )}
              {totalEpisodes > 0 && (
                 <span className="flex items-center"><Clapperboard className="mr-1.5 h-4 w-4" /> {totalEpisodes} Episode{totalEpisodes === 1 ? '' : 's'}</span>
              )}
              {series.rating && (
                <span className="flex items-center"><Star className="mr-1.5 h-4 w-4 text-yellow-400" /> {series.rating.toFixed(1)}/10</span>
              )}
            </div>
            <p className="text-base md:text-lg text-muted-foreground mb-6 line-clamp-4">{series.description}</p>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Play button might link to first episode or season page */}
              <PlayClientButton videoUrl={series.seasons?.[0]?.episodes?.[0]?.videoUrl || series.videoUrl} />
              <WishlistButton contentItem={series} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {/* Synopsis Card */}
          <Card>
            <CardHeader>
              <CardTitle>Synopsis</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>{series.description}</p>
            </CardContent>
          </Card>

          {/* Episodes Section */}
          {series.seasons && series.seasons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Episodes</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {series.seasons.map((season, seasonIndex) => (
                    <AccordionItem value={`season-${season.seasonNumber}`} key={season.seasonNumber}>
                      <AccordionTrigger className="text-xl font-semibold hover:no-underline">Season {season.seasonNumber} ({season.episodes.length} episodes)</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-4 pt-2">
                          {season.episodes.map((episode, episodeIndex) => (
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
            <Card>
              <CardHeader>
                <CardTitle>Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                   {seriesCreators.map((creator) => creator && (
                    <Link key={creator.id} href={`/creator/${creator.id}`} className="group text-center">
                      <Avatar className="h-24 w-24 mx-auto mb-2 shadow-md group-hover:ring-2 group-hover:ring-primary transition-all">
                        <AvatarImage src={creator.avatarUrl || `https://picsum.photos/seed/${creator.id}/100/100`} alt={creator.name} data-ai-hint="person face" />
                        <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium group-hover:text-primary">{creator.name}</p>
                       {series.creators?.find(sc => sc.id === creator.id)?.role && (
                        <p className="text-xs text-muted-foreground">{series.creators.find(sc => sc.id === creator.id)?.role}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section - Client Component */}
          <ReviewSection contentId={series.id} contentType="series" />

        </div>

        {/* Sidebar for Related Content */}
        <aside className="md:col-span-4 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Series Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Type:</span> <span className="font-medium">{series.type.charAt(0).toUpperCase() + series.type.slice(1)}</span></div>
              {series.releaseDate && <div className="flex justify-between"><span>First Aired:</span> <span className="font-medium">{series.releaseDate}</span></div>}
              {series.seasons && <div className="flex justify-between"><span>Seasons:</span> <span className="font-medium">{series.seasons.length}</span></div>}
              {totalEpisodes > 0 && <div className="flex justify-between"><span>Total Episodes:</span> <span className="font-medium">{totalEpisodes}</span></div>}
              {/* Add more details if available */}
            </CardContent>
          </Card>

          {relatedSeries.length > 0 && (
             <Card>
              <CardHeader>
                <CardTitle>More Like This</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                 {relatedSeries.slice(0,5).map(relatedItem => (
                    <Link key={relatedItem.id} href={`/${relatedItem.type}/${relatedItem.id}`} className="group flex gap-3 items-start p-2 -m-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Image src={relatedItem.imageUrl || `https://picsum.photos/seed/${relatedItem.id}/80/120`} alt={relatedItem.title} width={60} height={90} className="rounded aspect-[2/3] object-cover" data-ai-hint="series poster"/>
                        <div>
                            <h4 className="font-medium text-sm group-hover:text-primary line-clamp-2">{relatedItem.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{relatedItem.genre?.join(', ')}</p>
                        </div>
                    </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}


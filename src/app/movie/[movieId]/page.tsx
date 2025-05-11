import { getContentById, getRelatedContent, getCreators } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Film, Globe, CalendarDays, Users, Star } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WishlistButton from "@/components/content/wishlist-button"; 
import PlayClientButton from "@/components/content/play-client-button"; 
import ReviewSection from "@/components/content/review-section";

interface MoviePageProps {
  params: {
    movieId: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps) {
  const movie = await getContentById(params.movieId);
  if (!movie || movie.type !== 'movie') {
    return { title: "Movie Not Found" };
  }
  return {
    title: `${movie.title} - Gunvor.TV`,
    description: movie.description ? movie.description.substring(0, 160) : `Details for ${movie.title}`,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getContentById(params.movieId);

  if (!movie || movie.type !== 'movie') {
    notFound();
  }

  const relatedMovies = await getRelatedContent(movie.id, 'movie', movie.genre);
  // Creators are now populated directly in 'movie.creators' by getContentById
  const movieCreators = movie.creators || [];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="relative mb-8 md:mb-12 rounded-lg overflow-hidden shadow-xl min-h-[60vh] md:min-h-[70vh] flex items-end p-6 md:p-10 bg-background">
        <div className="absolute inset-0 z-0">
          <Image
            src={movie.imageUrl || `https://picsum.photos/seed/${movie.id}/1200/800`}
            alt={movie.title}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint="movie background"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-end">
          <div className="md:col-span-1 hidden md:block">
            <Image
              src={movie.imageUrl || `https://picsum.photos/seed/${movie.id}/400/600`}
              alt={`${movie.title} Poster`}
              width={400}
              height={600}
              className="rounded-lg shadow-2xl object-cover aspect-[2/3]"
              data-ai-hint="movie poster"
            />
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">{movie.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre?.map((g) => (
                <Badge key={g} variant="outline" className="text-sm bg-background/70 backdrop-blur-sm">{g}</Badge>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
              {movie.releaseDate && (
                <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> {new Date(movie.releaseDate).getFullYear()}</span>
              )}
              {movie.duration && (
                <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" /> {movie.duration}</span>
              )}
              {movie.language && (
                <span className="flex items-center"><Globe className="mr-1.5 h-4 w-4" /> {movie.language}</span>
              )}
              {movie.rating && (
                <span className="flex items-center"><Star className="mr-1.5 h-4 w-4 text-yellow-400" /> {movie.rating.toFixed(1)}/10</span>
              )}
            </div>
            <p className="text-base md:text-lg text-muted-foreground mb-6 line-clamp-4">{movie.description}</p>
            <div className="flex flex-wrap gap-3 items-center">
              <PlayClientButton videoUrl={movie.videoUrl} />
              <WishlistButton contentItem={movie} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {/* Synopsis Card */}
          {movie.description && (
            <Card>
              <CardHeader>
                <CardTitle>Synopsis</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>{movie.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Cast Section (from actors field) */}
          {movie.cast && movie.cast.length > 0 && (
             <Card>
              <CardHeader>
                <CardTitle>Cast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  {movie.cast.map((actor) => (
                    <div key={actor.name} className="text-sm">
                      <span className="font-medium">{actor.name}</span>
                       {/* <span className="text-muted-foreground"> as {actor.role}</span> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}


          {/* Creators Section */}
          {movieCreators.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movieCreators.map((creator) => creator && (
                    <Link key={creator.id} href={`/creator/${creator.id}`} className="group text-center">
                      <Avatar className="h-24 w-24 mx-auto mb-2 shadow-md group-hover:ring-2 group-hover:ring-primary transition-all">
                        {/* Avatar URL might not be available for all creators in content item */}
                        <AvatarImage src={`https://picsum.photos/seed/${creator.id}/100/100`} alt={creator.name} data-ai-hint="person face" />
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
          
          {/* Reviews Section - Client Component */}
          <ReviewSection contentId={movie.id} contentType="movie" />

        </div>

        {/* Sidebar for Related Content */}
        <aside className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Type:</span> <span className="font-medium">{movie.type.charAt(0).toUpperCase() + movie.type.slice(1)}</span></div>
              {movie.releaseDate && <div className="flex justify-between"><span>Released:</span> <span className="font-medium">{movie.releaseDate}</span></div>}
              {movie.language && <div className="flex justify-between"><span>Language:</span> <span className="font-medium">{movie.language}</span></div>}
              {movie.duration && <div className="flex justify-between"><span>Duration:</span> <span className="font-medium">{movie.duration}</span></div>}
              {movie.tags && movie.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-1 mt-2">Tags:</h4>
                  <div className="flex flex-wrap gap-1">
                    {movie.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {relatedMovies.length > 0 && (
             <Card>
              <CardHeader>
                <CardTitle>More Like This</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                {relatedMovies.slice(0,5).map(relatedItem => (
                    <Link key={relatedItem.id} href={`/${relatedItem.type}/${relatedItem.id}`} className="group flex gap-3 items-start p-2 -m-2 rounded-md hover:bg-muted/50 transition-colors">
                        <Image src={relatedItem.imageUrl || `https://picsum.photos/seed/${relatedItem.id}/80/120`} alt={relatedItem.title} width={60} height={90} className="rounded aspect-[2/3] object-cover" data-ai-hint="movie poster"/>
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

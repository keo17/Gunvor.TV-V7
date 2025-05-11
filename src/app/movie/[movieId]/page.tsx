
import { getContentById, getRelatedContent } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Share2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WishlistButton from "@/components/content/wishlist-button";
import PlayClientButton from "@/components/content/play-client-button";
import { Button } from "@/components/ui/button";
import WishlistContentCard from "@/components/content/wishlist-content-card";

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

// Dummy data for behind the scenes, as it's not in current data model
const behindTheScenesImages = [
  "https://picsum.photos/seed/bts1/300/200",
  "https://picsum.photos/seed/bts2/300/200",
  "https://picsum.photos/seed/bts3/300/200",
  "https://picsum.photos/seed/bts4/300/200",
  "https://picsum.photos/seed/bts5/300/200",
  "https://picsum.photos/seed/bts6/300/200",
];


export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getContentById(params.movieId);

  if (!movie || movie.type !== 'movie') {
    notFound();
  }

  const relatedMovies = await getRelatedContent(movie.id, 'movie', movie.genre);
  const movieCreators = movie.creators || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Left Column: Poster */}
        <div className="md:col-span-1">
          <Image
            src={movie.imageUrl || `https://picsum.photos/seed/${movie.id}/400/600`}
            alt={`${movie.title} Poster`}
            width={400}
            height={600}
            className="rounded-lg shadow-xl object-cover aspect-[2/3] w-full"
            priority
            data-ai-hint="movie poster"
          />
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-1">{movie.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-2 mb-4">
            {movie.duration && <span>{movie.duration}</span>}
            {movie.genre?.[0] && <span>• {movie.genre[0]}</span>}
            {movie.language && <span>• {movie.language}</span>}
          </div>

          <PlayClientButton videoUrl={movie.videoUrl} className="w-full md:w-auto mb-4 bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
             Play
          </PlayClientButton>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            {movie.rating && (
              <span className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" /> {movie.rating.toFixed(1)}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <WishlistButton contentItem={movie} variant="outline" />
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>

          <p className="text-foreground/80 mb-8">{movie.description}</p>

        </div>
      </div>

      {/* Behind the Scenes - Placeholder */}
      {movie.behindTheScenesImages && movie.behindTheScenesImages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Behind the Scenes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {movie.behindTheScenesImages.map((src, index) => (
              <Image key={index} src={src} alt={`Behind the scenes ${index + 1}`} width={300} height={200} className="rounded-md object-cover aspect-video" data-ai-hint="movie scene still"/>
            ))}
          </div>
        </div>
      )}
      
      {/* Details Section */}
       <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {movie.releaseDate && <p><span className="font-semibold text-muted-foreground">Year • </span> {new Date(movie.releaseDate).getFullYear()}</p>}
            {movie.genre && movie.genre.length > 0 && <p><span className="font-semibold text-muted-foreground">Genre • </span> {movie.genre.join(', ')}</p>}
            {movie.language && <p><span className="font-semibold text-muted-foreground">Languages • </span> {movie.language}</p>}
            {movie.duration && <p><span className="font-semibold text-muted-foreground">Duration • </span> {movie.duration}</p>}
             {movie.tags && movie.tags.length > 0 && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-muted-foreground">Tags • </span>
                    {movie.tags.map(tag => <Badge key={tag} variant="secondary" className="mr-1 mb-1">{tag}</Badge>)}
                </div>
              )}
          </div>
        </div>


      {/* Creators Section */}
      {movieCreators.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {movieCreators.map((creator) => creator && (
                <Link key={creator.id} href={`/creator/${creator.id}`} className="group text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-2 shadow-md group-hover:ring-2 group-hover:ring-primary transition-all">
                    <AvatarImage src={creator.avatarUrl || `https://picsum.photos/seed/${creator.id}/100/100`} alt={creator.name} data-ai-hint="person face"/>
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

      {/* More Like This Section */}
      {relatedMovies.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {relatedMovies.slice(0, 6).map(relatedItem => (
               <WishlistContentCard key={relatedItem.id} item={relatedItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

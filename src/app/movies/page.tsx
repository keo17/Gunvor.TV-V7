import { getContentItems } from "@/lib/data";
import WishlistContentCard from "@/components/content/wishlist-content-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Film } from "lucide-react";
// This will be a server component for initial load, interactivity can be added with client components.

export default async function AllMoviesPage() {
  const allContent = await getContentItems();
  const movies = allContent.filter(item => item.type === 'movie');

  // Placeholder for search and sort state if we make this page interactive later
  // const [searchTerm, setSearchTerm] = useState("");
  // const [sortBy, setSortBy] = useState("releaseDate_desc");

  // const filteredAndSortedMovies = movies; // Apply filtering and sorting logic here

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Film className="h-8 w-8 mr-3 text-primary" />
            <CardTitle className="text-3xl md:text-4xl font-bold">All Movies</CardTitle>
          </div>
          <CardDescription>Browse our extensive collection of movies.</CardDescription>
        </CardHeader>
        {/* Add Search and Sort controls here if making interactive */}
        {/* 
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input placeholder="Search movies..." className="max-w-sm" />
            <Select defaultValue="releaseDate_desc">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                <SelectItem value="releaseDate_desc">Newest First</SelectItem>
                <SelectItem value="releaseDate_asc">Oldest First</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        */}
      </Card>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((item) => (
            <WishlistContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No movies found.</p>
        </div>
      )}
    </div>
  );
}

import { getContentItems } from "@/lib/data";
import WishlistContentCard from "@/components/content/wishlist-content-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tv } from "lucide-react";
// This will be a server component for initial load, interactivity can be added with client components.

export default async function AllSeriesPage() {
  const allContent = await getContentItems();
  const series = allContent.filter(item => item.type === 'series');

  // Placeholder for search and sort state
  // const [searchTerm, setSearchTerm] = useState("");
  // const [sortBy, setSortBy] = useState("releaseDate_desc");
  // const filteredAndSortedSeries = series;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Tv className="h-8 w-8 mr-3 text-primary" />
            <CardTitle className="text-3xl md:text-4xl font-bold">All Series</CardTitle>
          </div>
          <CardDescription>Explore all available TV series.</CardDescription>
        </CardHeader>
        {/* Add Search and Sort controls here */}
      </Card>

      {series.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {series.map((item) => (
            <WishlistContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No series found.</p>
        </div>
      )}
    </div>
  );
}

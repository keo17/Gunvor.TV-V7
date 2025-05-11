import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Mimics the general page structure with a header and content area
  return (
    <div className="flex flex-col min-h-screen">
        {/* Header Skeleton (already handled by FirebaseAuthProvider's loading, but good as a fallback) */}
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      
      {/* Page Content Skeleton */}
      <div className="container mx-auto py-8 px-4 flex-1">
        {/* Hero Section Skeleton */}
        <Skeleton className="h-64 md:h-96 w-full mb-8 md:mb-12 rounded-lg" />

        {/* Content Row Skeletons */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="mb-8 md:mb-12">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="aspect-[2/3] rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
        {/* Footer Skeleton (already handled by FirebaseAuthProvider's loading) */}
        <div className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
             <Skeleton className="h-6 w-48" />
          </div>
        </div>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center py-12 px-4"> {/* Adjust min-h based on header/footer */}
      <AlertOctagon className="h-24 w-24 text-destructive mb-8" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}

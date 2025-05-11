import Link from "next/link";
import { Film } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center text-sm text-muted-foreground">
          <Film className="h-5 w-5 mr-2 text-primary" />
          <p>&copy; {currentYear} Content Compass. All rights reserved.</p>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
          <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">
            Disclaimer
          </Link>
          {/* Add more links as needed */}
        </nav>
      </div>
    </footer>
  );
}

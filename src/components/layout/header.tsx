"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, UserCircle, LogIn, LogOut, Sun, Moon, Menu, ChevronDown, Tv, Video, Clapperboard, Layers, ShieldQuestion, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/firebase-auth-context";
import { signOutUser } from "@/lib/firebase/auth";
import { useTheme } from "next-themes";
import React, { useState, useEffect, useRef } from "react";
import { searchContent } from "@/lib/data";
import type { ContentItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

const DropdownNavLink = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="transition-colors hover:text-foreground/80 text-foreground/60 px-3 py-1.5 h-auto text-sm font-medium">
        {label} <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);


export default function Header() {
  const { user, isDemoMode } = useAuth();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await searchContent(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchFocus = () => setIsSearchFocused(true);
  
  const handleResultClick = (item: ContentItem) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    router.push(`/${item.type}/${item.id}`);
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);
  

  const somaliNavItems = (
    <>
      <DropdownMenuItem asChild><Link href="/collection/somali-films">Somali Films</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/somali-series">Somali Musalsal</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/somali-short-films">Somali Short Films</Link></DropdownMenuItem>
    </>
  );

  const hindiNavItems = (
    <>
      <DropdownMenuItem asChild><Link href="/collection/hindi-films">Hindi Films</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/hindi-series">Hindi Musalsal</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/hindi-short-films">Hindi Short Films</Link></DropdownMenuItem>
    </>
  );

  const moreNavItems = (
    <>
      <DropdownMenuItem asChild><Link href="/movies">All Movies</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/series">All Series</Link></DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild><Link href="/collection/recap-kdrama">Recap Kdrama</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/hollywood">Hollywood</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/cartoon">Cartoon</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/recaps">Recaps</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/documentary">Documentary</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/collection/others">Others</Link></DropdownMenuItem>
    </>
  );
  
  const MobileNavLink = ({ href, children, icon }: { href: string; children: React.ReactNode, icon?: React.ReactNode }) => (
    <Link
      href={href}
      className="flex items-center px-2 py-2 text-lg transition-colors hover:text-foreground/80 text-foreground/60"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
  
  const MobileDropdownTrigger = ({ label, children, icon }: {label: string; children: React.ReactNode, icon?: React.ReactNode}) => (
     <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-2 py-2 text-lg text-left text-foreground/60 hover:text-foreground/80 justify-between w-full">
          <span className="flex items-center">
           {icon && <span className="mr-2">{icon}</span>}
           {label}
          </span>
          <ChevronDown className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center justify-between">
 <Link href="/" className="flex items-center mr-auto pr-4 pl-4">
          <span className="font-bold sm:inline-block text-4xl font-serif">Gunvor.TV</span> {/* Increased font size and changed font */}
        </Link>

        {/* Desktop Navigation Center */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          <DropdownNavLink label={<span className="font-serif">Somali</span>}>{somaliNavItems}</DropdownNavLink> {/* Changed font */}
          <DropdownNavLink label={<span className="font-serif">Hindi</span>}>{hindiNavItems}</DropdownNavLink> {/* Changed font */}
          <DropdownNavLink label={<span className="font-serif">More</span>}>{moreNavItems}</DropdownNavLink> {/* Changed font */}
        </nav>

 <div className="flex flex-1 items-center justify-between space-x-2 md:space-x-4">
          {/* Search Bar */}
 <div className="relative flex-1 max-w-xs lg:max-w-sm mx-auto" ref={searchContainerRef}>
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-10 pr-4 py-2.5 rounded-full bg-muted/50 backdrop-blur-sm border-transparent focus:border-primary focus:ring-1 focus:ring-primary shadow-sm hover:shadow-md transition-all duration-200 text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
            />
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            {isSearchFocused && searchQuery.length > 0 && (
              <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-lg z-[60] max-h-72 overflow-y-auto py-1">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      className="block w-full text-left px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => handleResultClick(item)}
                    >
                      {item.title}
                       {item.releaseDate && <span className="text-xs text-muted-foreground ml-2">({new Date(item.releaseDate).getFullYear()})</span>}
                    </button>
                  ))
                ) : (
                  searchQuery.length > 2 && (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No results found for "{searchQuery}".
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            
             
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="hover:bg-accent/20"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User Auth Section */}
          {isDemoMode || !user ? (
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2.5 text-sm font-medium">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent/20">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback className="text-base">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <nav className="flex flex-col space-y-1 mt-8">
                  <MobileDropdownTrigger label="Somali" icon={<Video className="h-5 w-5" />}>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/somali-films"); setIsMobileMenuOpen(false);}}>Somali Films</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/somali-series"); setIsMobileMenuOpen(false);}}>Somali Musalsal</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/somali-short-films"); setIsMobileMenuOpen(false);}}>Somali Short Films</DropdownMenuItem>
                  </MobileDropdownTrigger>
                   <MobileDropdownTrigger label="Hindi" icon={<Film className="h-5 w-5" />}>
                       <DropdownMenuItem onSelect={() => {router.push("/collection/hindi-films"); setIsMobileMenuOpen(false);}}>Hindi Films</DropdownMenuItem>
                       <DropdownMenuItem onSelect={() => {router.push("/collection/hindi-series"); setIsMobileMenuOpen(false);}}>Hindi Musalsal</DropdownMenuItem>
                       <DropdownMenuItem onSelect={() => {router.push("/collection/hindi-short-films"); setIsMobileMenuOpen(false);}}>Hindi Short Films</DropdownMenuItem>
                    </MobileDropdownTrigger>
                   <MobileDropdownTrigger label="More" icon={<Layers className="h-5 w-5" />}>
                      <DropdownMenuItem onSelect={() => {router.push("/movies"); setIsMobileMenuOpen(false);}}>All Movies</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/series"); setIsMobileMenuOpen(false);}}>All Series</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => {router.push("/collection/recap-kdrama"); setIsMobileMenuOpen(false);}}>Recap Kdrama</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/hollywood"); setIsMobileMenuOpen(false);}}>Hollywood</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/cartoon"); setIsMobileMenuOpen(false);}}>Cartoon</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/recaps"); setIsMobileMenuOpen(false);}}>Recaps</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/documentary"); setIsMobileMenuOpen(false);}}>Documentary</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/others"); setIsMobileMenuOpen(false);}}>Others</DropdownMenuItem>
                    </MobileDropdownTrigger>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

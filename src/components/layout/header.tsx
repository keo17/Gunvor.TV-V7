"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Search, UserCircle, LogIn, LogOut, Sun, Moon, Menu, Shuffle, ChevronDown } from "lucide-react";
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/firebase-auth-context";
import { signOutUser } from "@/lib/firebase/auth";
import { useTheme } from "next-themes";
import React, { useState, useEffect, useRef } from "react";
import { getRandomContentItem, searchContent } from "@/lib/data";
import type { ContentItem } from "@/types";

const NavLinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="block px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground rounded-md">
    {children}
  </Link>
);

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
  
  const handleRandomShuffle = async () => {
    const randomItem = await getRandomContentItem();
    if (randomItem) {
      router.push(`/${randomItem.type}/${randomItem.id}`);
    }
    setIsMobileMenuOpen(false);
  };

  const baseNavLinks = [
    { href: "/", label: "Home" },
  ];

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
      {/* Add other general collection links here if any */}
       <DropdownMenuItem asChild><Link href="/disclaimer">Disclaimer</Link></DropdownMenuItem>
    </>
  );
  
  const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="block px-2 py-2 text-lg transition-colors hover:text-foreground/80 text-foreground/60"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">Gunvor.TV</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {baseNavLinks.map((link) => (
            <Button key={link.label} variant="ghost" asChild className="transition-colors hover:text-foreground/80 text-foreground/60 px-3 py-1.5 h-auto text-sm font-medium">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <DropdownNavLink label="Somali">{somaliNavItems}</DropdownNavLink>
          <DropdownNavLink label="Hindi">{hindiNavItems}</DropdownNavLink>
          <DropdownNavLink label="More">{moreNavItems}</DropdownNavLink>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-xs lg:max-w-sm" ref={searchContainerRef}>
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            {isSearchFocused && searchQuery.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-md border bg-popover shadow-lg z-[60] max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleResultClick(item)}
                    >
                      {item.title}
                    </button>
                  ))
                ) : (
                  searchQuery.length > 2 && (
                    <div className="p-4 text-sm text-muted-foreground">
                      No results found for "{searchQuery}".
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleRandomShuffle} aria-label="Random Shuffle">
            <Shuffle className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User Auth Section */}
          {isDemoMode || !user ? (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback>
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
                <nav className="flex flex-col space-y-2 mt-8">
                  {baseNavLinks.map((link) => (
                    <MobileNavLink key={link.label} href={link.href}>{link.label}</MobileNavLink>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-2 py-2 text-lg text-left text-foreground/60 hover:text-foreground/80 flex items-center justify-between w-full">
                      Somali <ChevronDown className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/somali-films"); setIsMobileMenuOpen(false);}}>Somali Films</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/somali-series"); setIsMobileMenuOpen(false);}}>Somali Musalsal</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/collection/somali-short-films"); setIsMobileMenuOpen(false);}}>Somali Short Films</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                   <DropdownMenu>
                    <DropdownMenuTrigger className="px-2 py-2 text-lg text-left text-foreground/60 hover:text-foreground/80 flex items-center justify-between w-full">
                      Hindi <ChevronDown className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                       <DropdownMenuItem onSelect={() => {router.push("/collection/hindi-films"); setIsMobileMenuOpen(false);}}>Hindi Films</DropdownMenuItem>
                       <DropdownMenuItem onSelect={() => {router.push("/collection/hindi-series"); setIsMobileMenuOpen(false);}}>Hindi Musalsal</DropdownMenuItem>
                       <DropdownMenuItem onSelect={() => {router.push("/collection/hindi-short-films"); setIsMobileMenuOpen(false);}}>Hindi Short Films</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                   <DropdownMenu>
                    <DropdownMenuTrigger className="px-2 py-2 text-lg text-left text-foreground/60 hover:text-foreground/80 flex items-center justify-between w-full">
                      More <ChevronDown className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => {router.push("/movies"); setIsMobileMenuOpen(false);}}>All Movies</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/series"); setIsMobileMenuOpen(false);}}>All Series</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {router.push("/disclaimer"); setIsMobileMenuOpen(false);}}>Disclaimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

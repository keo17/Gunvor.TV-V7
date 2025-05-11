"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Search, UserCircle, LogIn, LogOut, Sun, Moon, Menu, Shuffle } from "lucide-react";
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
import React, { useState } from "react";
import { getRandomContentItem, searchContent } from "@/lib/data"; // Assuming searchContent exists
import type { ContentItem } from "@/types";

export default function Header() {
  const { user, isDemoMode } = useAuth();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      const results = await searchContent(e.target.value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleSearchBlur = () => {
    // Delay blur to allow click on search results
    setTimeout(() => setIsSearchFocused(false), 100);
  };
  
  const handleRandomShuffle = async () => {
    const randomItem = await getRandomContentItem();
    if (randomItem) {
      router.push(`/${randomItem.type}/${randomItem.id}`);
    }
  };


  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/series", label: "Series" },
    { href: "/collections", label: "Collections" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">ContentCompass</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-xs lg:max-w-sm">
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-md border bg-popover shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${item.type}/${item.id}`}
                    className="block px-4 py-2 hover:bg-accent"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
             {isSearchFocused && searchQuery.length > 2 && searchResults.length === 0 && (
              <div className="absolute top-full mt-1 w-full rounded-md border bg-popover shadow-lg z-50 p-4 text-sm text-muted-foreground">
                No results found for "{searchQuery}".
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block px-2 py-1 text-lg transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                      href="/disclaimer"
                      className="block px-2 py-1 text-lg transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                    Disclaimer
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

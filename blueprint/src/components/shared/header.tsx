"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  const MobileNavItem = ({ item }: { item: typeof navigationItems[0] }) => (
    <div>
      <Link
        href={item.href}
        className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.title}
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="rounded-lg bg-primary p-2 group-hover:bg-primary/90 transition-colors">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground sm:text-2xl">
                My App
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Auth Buttons / User Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8",
                        userButtonPopoverCard: "shadow-lg border border-border",
                        userButtonPopoverActionButton: "hover:bg-accent",
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="text-sm">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" className="text-sm">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            {isLoaded && isSignedIn && (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-7 h-7",
                    userButtonPopoverCard: "shadow-lg border border-border",
                    userButtonPopoverActionButton: "hover:bg-accent",
                  },
                }}
              />
            )}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-lg font-semibold">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Mobile Navigation */}
                  <nav className="space-y-4">
                    {navigationItems.map((item) => (
                      <MobileNavItem key={item.href} item={item} />
                    ))}
                  </nav>

                  {/* Mobile Auth Buttons */}
                  {isLoaded && !isSignedIn && (
                    <div className="pt-6 border-t border-border space-y-3">
                      <SignInButton mode="modal">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button
                          className="w-full"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
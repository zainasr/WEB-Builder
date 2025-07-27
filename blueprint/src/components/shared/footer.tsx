//src/components/shared/footer.tsx
import Link from "next/link";
import { ShoppingBag, Facebook, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  // Navigation links
  const navigationLinks = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: "Contact", href: "/contact" },
  ];

  // Social media links
  const socialLinks = [
    {
      title: "Facebook",
      href: "https://facebook.com",
      icon: <Facebook className="h-5 w-5" />,
    },
    {
      title: "LinkedIn", 
      href: "https://linkedin.com",
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      title: "Twitter",
      href: "https://x.com",
      icon: <Twitter className="h-5 w-5" />,
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Company Logo & Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="rounded-lg bg-primary p-2 group-hover:bg-primary/90 transition-colors">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                My App
              </span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground max-w-sm">
              Your trusted online store for quality products, exceptional service, 
              and fast delivery worldwide.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.title}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.title}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Email: support@myapp.com
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} My App. All rights reserved.
            </p>
            
            <div className="flex space-x-4">
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
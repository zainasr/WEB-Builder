import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-background to-muted/30 px-4 py-16 md:py-24 lg:py-32">
      {/* Background Image Usage (Optional) */}
      {/* 
        To add background image, replace the gradient above with:
        <div className="absolute inset-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Hero Background" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" /> // Overlay for text readability
        </div>
      */}
      
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        {/* Main Headline */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="h-4 w-4" />
            New Collection Available
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Discover Your Perfect
            <span className="block text-primary">Style Today</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Shop the latest trends with unbeatable quality. From fashion to tech, 
            find everything you need to express your unique style.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          <Link href="/products">
            <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Explore Products
            </Button>
          </Link>
          
          <Link href="/products?featured=true">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base px-8 py-6 w-full sm:w-auto"
            >
              <Star className="mr-2 h-5 w-5" />
              Best Sellers
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Free Shipping Over $50
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            30-Day Returns
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Secure Checkout
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 
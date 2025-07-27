//src/components/HomePage/best-sellers.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Eye, Package } from "lucide-react";
import { Product, ProductsResponse } from "@/lib/types";

// Dummy data for fallback when API returns empty or fails
const dummyProducts: Product[] = [
  {
    id: "prod-1",
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description: "Premium quality wireless headphones with noise cancellation",
    basePrice: 9999, // $99.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Electronics", slug: "electronics" },
    isFeatured: true,
    stockQuantity: 15,
  },
  {
    id: "prod-2",
    name: "Stylish Cotton T-Shirt",
    slug: "stylish-cotton-t-shirt",
    description: "Comfortable and trendy cotton t-shirt for everyday wear",
    basePrice: 2499, // $24.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Fashion", slug: "fashion" },
    isFeatured: true,
    stockQuantity: 32,
  },
  {
    id: "prod-3",
    name: "Smart Home Security Camera",
    slug: "smart-home-security-camera",
    description: "1080p HD security camera with night vision and mobile app",
    basePrice: 12999, // $129.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Electronics", slug: "electronics" },
    isFeatured: true,
    stockQuantity: 8,
  },
  {
    id: "prod-4",
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    description: "Comfortable office chair with lumbar support and adjustable height",
    basePrice: 24999, // $249.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Home & Garden", slug: "home-garden" },
    isFeatured: true,
    stockQuantity: 12,
  },
  {
    id: "prod-5",
    name: "Professional Camera Lens",
    slug: "professional-camera-lens",
    description: "50mm f/1.8 lens for professional photography",
    basePrice: 34999, // $349.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Photography", slug: "photography" },
    isFeatured: true,
    stockQuantity: 6,
  },
  {
    id: "prod-6",
    name: "Gaming Mechanical Keyboard",
    slug: "gaming-mechanical-keyboard",
    description: "RGB backlit mechanical keyboard for gaming enthusiasts",
    basePrice: 8999, // $89.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Gaming", slug: "gaming" },
    isFeatured: true,
    stockQuantity: 18,
  },
  {
    id: "prod-7",
    name: "Fitness Yoga Mat",
    slug: "fitness-yoga-mat",
    description: "Non-slip eco-friendly yoga mat for fitness and meditation",
    basePrice: 3999, // $39.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Sports & Fitness", slug: "sports-fitness" },
    isFeatured: true,
    stockQuantity: 25,
  },
  {
    id: "prod-8",
    name: "Stainless Steel Water Bottle",
    slug: "stainless-steel-water-bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours",
    basePrice: 1999, // $19.99 in cents
    images: ["/api/placeholder/400/400"],
    category: { name: "Sports & Fitness", slug: "sports-fitness" },
    isFeatured: true,
    stockQuantity: 40,
  },
];

// Utility function to format price from cents to dollars
const formatPrice = (priceInCents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100);
};

// Fetch best sellers from API
async function fetchBestSellers(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/best-sellers`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch best sellers');
    }
    
    const result: ProductsResponse = await response.json();
    
    // If API returns empty data or fails, return dummy data
    if (!result.success || !result.data || result.data.length === 0) {
      console.log('Using dummy best sellers data');
      return dummyProducts;
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    // Return dummy data on error
    return dummyProducts;
  }
}

const BestSellers = async () => {
  const products = await fetchBestSellers();

  return (
    <section className="py-16 md:py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4" />
            Trending Now
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Best Sellers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular products loved by thousands of customers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group h-full border border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                  <Image
                    src={product.images[0] || "/api/placeholder/400/400"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground">
                      {formatPrice(product.basePrice)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full">
                  <Link href={`/products/${product.slug}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  
                  <Button size="sm" className="w-full text-sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Products Link */}
        <div className="text-center mt-12">
          <Link 
            href="/products?featured=true"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-lg transition-colors"
          >
            View All Best Sellers
            <Package className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers; 
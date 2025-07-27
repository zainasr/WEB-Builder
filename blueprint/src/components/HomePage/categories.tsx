//src/components/HomePage/categories.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Shirt, Home, Gamepad2, Camera, Headphones } from "lucide-react";
import { Category } from "@/lib/types";

// Type definition for category data


// API response type
type CategoriesResponse = {
  success: boolean;
  data: Category[];
  error?: string;
};

// Dummy data for fallback when API returns empty or fails
const dummyCategories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and tech accessories",
    image: null,
    productCount: 24,
  },
  {
    id: "cat-2", 
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    image: null,
    productCount: 18,
  },
  {
    id: "cat-3",
    name: "Home & Garden",
    slug: "home-garden", 
    description: "Everything for your home and garden",
    image: null,
    productCount: 32,
  },
  {
    id: "cat-4",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Sports equipment and fitness gear",
    image: null,
    productCount: 15,
  },
  {
    id: "cat-5",
    name: "Gaming",
    slug: "gaming",
    description: "Gaming gear and accessories",
    image: null,
    productCount: 21,
  },
  {
    id: "cat-6",
    name: "Photography",
    slug: "photography",
    description: "Cameras and photography equipment",
    image: null,
    productCount: 12,
  },
];

// Icon mapping for categories
const getCategoryIcon = (slug: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    electronics: <Headphones className="h-8 w-8" />,
    fashion: <Shirt className="h-8 w-8" />,
    "home-garden": <Home className="h-8 w-8" />,
    "sports-fitness": <Package className="h-8 w-8" />,
    gaming: <Gamepad2 className="h-8 w-8" />,
    photography: <Camera className="h-8 w-8" />,
  };
  return iconMap[slug] || <Package className="h-8 w-8" />;
};

// Fetch categories from API
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const result: CategoriesResponse = await response.json();
    
    // If API returns empty data or fails, return dummy data
    if (!result.success || !result.data || result.data.length === 0) {
      console.log('Using dummy categories data');
      return dummyCategories;
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return dummy data on error
    return dummyCategories;
  }
}

const Categories = async () => {
  const categories = await fetchCategories();

  return (
    <section className="py-16 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collection across different categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border bg-card">
                <CardContent className="p-6 text-center space-y-4">
                  {/* Category Icon */}
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {getCategoryIcon(category.slug)}
                    </div>
                  </div>
                  
                  {/* Category Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex justify-center">
                      <Badge variant="secondary" className="text-xs">
                        {category.productCount} Products
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-12">
          <Link 
            href="/products"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-lg transition-colors"
          >
            View All Products
            <Package className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories; 
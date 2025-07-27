//src/app/products/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Package,
  SlidersHorizontal
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/stores/cartStore';

// API Response type for products
type ProductsResponse = {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    filters: {
      search: string;
      category: string;
      minPrice: number | null;
      maxPrice: number | null;
      sortBy: string;
      isFeatured: boolean;
      inStock: boolean;
    };
  };
  error?: string;
};

const ProductsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10, // Updated to 10 products per page
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Available categories for filter
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports-fitness', label: 'Sports & Fitness' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'photography', label: 'Photography' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
  ];

  // Format price utility
  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100);
  };

  // Create query string function following Next.js best practices
  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Update or remove parameters
      Object.entries(updates).forEach(([name, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });
      
      return params.toString();
    },
    [searchParams]
  );

  // Update URL and fetch products
  const updateFilters = useCallback((updates: Record<string, string | null>, page: number = 1) => {
    // Always include page parameter: set it if > 1, remove it if = 1
    const allUpdates = { 
      ...updates, 
      page: page > 1 ? page.toString() : null 
    };
    
    const queryString = createQueryString(allUpdates);
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [createQueryString, pathname, router]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const currentParams = searchParams.toString();
      const response = await fetch(`/api/products?${currentParams}&limit=10`); // Updated to 10
      const result: ProductsResponse = await response.json();
      
      if (result.success || result.data) {
        setProducts(result.data.products);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Initialize filters from URL params and fetch products
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
    setShowFeaturedOnly(searchParams.get('isFeatured') === 'true');
    setShowInStockOnly(searchParams.get('inStock') === 'true');
    
    fetchProducts();
  }, [searchParams, fetchProducts]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters({ category });
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateFilters({ sortBy: sort });
  };

  // Handle price change (on blur)
  const handlePriceChange = () => {
    updateFilters({ 
      minPrice: minPrice || null, 
      maxPrice: maxPrice || null 
    });
  };

  // Handle featured toggle
  const handleFeaturedToggle = (checked: boolean) => {
    setShowFeaturedOnly(checked);
    updateFilters({ isFeatured: checked ? 'true' : null });
  };

  // Handle in stock toggle
  const handleInStockToggle = (checked: boolean) => {
    setShowInStockOnly(checked);
    updateFilters({ inStock: checked ? 'true' : null });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateFilters({}, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setShowFeaturedOnly(false);
    setShowInStockOnly(false);
    router.push(pathname);
  };

  return (
    <main className="min-h-screen py-8 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Products
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover our complete collection of quality products
              </p>
            </div>
            
            {/* Mobile Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </form>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}>
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Category</h3>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Price Range</h3>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onBlur={handlePriceChange}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={handlePriceChange}
                      />
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={showFeaturedOnly}
                        onCheckedChange={handleFeaturedToggle}
                      />
                      <label htmlFor="featured" className="text-sm text-foreground">
                        Featured Products Only
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instock"
                        checked={showInStockOnly}
                        onCheckedChange={handleInStockToggle}
                      />
                      <label htmlFor="instock" className="text-sm text-foreground">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            
            {/* Results Header & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  "Loading products..."
                ) : (
                  `Showing ${products.length} of ${pagination.totalCount} products`
                )}
              </div>
              
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {product.isFeatured && (
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Badge variant="secondary" className="text-xs">
                            {product.category.name}
                          </Badge>
                          
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
                          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Only {product.stockQuantity} left
                            </Badge>
                          )}
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
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage; 
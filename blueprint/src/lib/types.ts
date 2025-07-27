//src/lib/types.ts

// Category type definition
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
};

// Product type definition for best sellers
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  isFeatured: boolean;
  stockQuantity: number;
};

// Product variant type definition
export type ProductVariant = {
  id: string;
  name: string;
  stock: number;
  isActive: boolean;
  attributes: Record<string, any> | null;
};

// Detailed product type for product detail page
export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  isFeatured: boolean;
  stockQuantity: number;
  variants: ProductVariant[];
};

// API response types
export type CategoriesResponse = {
  success: boolean;
  data: Category[];
  error?: string;
};

export type ProductsResponse = {
  success: boolean;
  data: Product[];
  error?: string;
};

export type ProductDetailResponse = {
  success: boolean;
  data: {
    product: ProductDetail;
    relatedProducts: Product[];
  };
  error?: string;
}; 
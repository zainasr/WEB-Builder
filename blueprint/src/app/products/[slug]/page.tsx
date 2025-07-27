// src/app/product/[slug]/page.tsx
// Product detail page displaying comprehensive product information

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Heart, Share2, Plus, Minus } from 'lucide-react';
import { ProductDetail, Product, ProductDetailResponse } from '@/lib/types';
import { useCartStore } from '@/lib/stores/cartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Cart store
  const { addItem, isLoading: isAddingToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${slug}`);
        const data: ProductDetailResponse = await response.json();
        
        if (data.success) {
          setProduct(data.data.product);
          setRelatedProducts(data.data.relatedProducts);
          // Set first variant as default if available
          if (data.data.product.variants.length > 0) {
            setSelectedVariant(data.data.product.variants[0].id);
          }
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const selectedVariantData = product?.variants.find(v => v.id === selectedVariant);
  const maxStock = selectedVariantData ? selectedVariantData.stock : product?.stockQuantity || 0;
  const isInStock = maxStock > 0;

  const incrementQuantity = () => {
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = async () => {
    if (!product || !isInStock) return;
    
    try {
      await addItem({
        productId: product.id,
        variantId: selectedVariant || undefined,
        quantity,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          basePrice: product.basePrice,
          images: product.images,
          stockQuantity: product.stockQuantity,
        },
        variant: selectedVariantData ? {
          id: selectedVariantData.id,
          name: selectedVariantData.name,
          stock: selectedVariantData.stock,
          attributes: selectedVariantData.attributes,
        } : undefined,
      });
      
      // Show success message
      alert(`Added ${quantity}x ${product.name}${selectedVariantData ? ` (${selectedVariantData.name})` : ''} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products?category=${product.category.slug}`}>
                {product.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category Badge */}
            <Badge variant="secondary" className="w-fit">
              {product.category.name}
            </Badge>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.basePrice)}
              </span>
              {product.isFeatured && (
                <Badge className="bg-green-100 text-green-800">Featured</Badge>
              )}
            </div>

            {/* Rating Stars (Static for now) */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.0) • 24 reviews</span>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variant Selection */}
            {product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Options</h3>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem 
                        key={variant.id} 
                        value={variant.id}
                        disabled={variant.stock === 0}
                      >
                        {variant.name} 
                        {variant.stock === 0 ? ' (Out of Stock)' : ` (${variant.stock} in stock)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                {isInStock ? `${maxStock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            {isInStock && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= maxStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={addToCart}
                    disabled={isAddingToCart || !isInStock}
                    className="flex-1 h-12"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Total Price */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-bold">
                      {formatPrice(product.basePrice * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons for Out of Stock */}
            {!isInStock && (
              <div className="space-y-3">
                <Button disabled className="w-full h-12" size="lg">
                  Out of Stock
                </Button>
                <Button variant="outline" className="w-full">
                  Notify When Available
                </Button>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-16" />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Related Products</h2>
              <p className="text-gray-600">You might also like these products</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/product/${relatedProduct.slug}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">
                        {formatPrice(relatedProduct.basePrice)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {relatedProduct.category.name}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
            
        
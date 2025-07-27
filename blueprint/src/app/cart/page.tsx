// src/app/cart/page.tsx
// Shopping cart page with item management and checkout

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';

export default function CartPage() {
  const {
    items,
    isLoading,
    error,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
  } = useCartStore();

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100);
  };

  const handleQuantityUpdate = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      removeItem(itemId);
    }
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-1">
              {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Cart Items</h2>
                {items.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                )}
              </div>

              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link 
                              href={`/product/${item.product.slug}`}
                              className="font-semibold text-lg hover:text-blue-600 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            {item.variant && (
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {item.variant.name}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityUpdate(item.id, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityUpdate(item.id, item.quantity, 1)}
                              disabled={item.quantity >= (item.variant?.stock || item.product.stockQuantity)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {formatPrice(item.product.basePrice * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatPrice(item.product.basePrice)} each
                            </div>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.variant && item.variant.stock <= 5 && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              Only {item.variant.stock} left in stock
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Items ({totalItems})</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  {/* Checkout Button */}
                  <div className="space-y-3 pt-4">
                    <Link href="/checkout" className="w-full">
                      <Button size="lg" className="w-full h-12">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </Link>
                    
                    <Link href="/products" className="w-full">
                      <Button variant="outline" size="lg" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  {/* Security Badge */}
                  <div className="pt-4 text-center">
                    <div className="text-xs text-gray-500 mb-2">Secure Checkout</div>
                    <div className="flex justify-center gap-2">
                      <Badge variant="outline" className="text-xs">SSL Encrypted</Badge>
                      <Badge variant="outline" className="text-xs">256-bit Security</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {items.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="text-center py-8 text-gray-500">
              <p>Recommended products will be displayed here</p>
              <Link href="/products" className="text-blue-600 hover:underline">
                Browse all products →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
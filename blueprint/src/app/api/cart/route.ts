// src/app/api/cart/route.ts
// API routes for cart operations

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/cart - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    // TODO: Get actual user ID from Clerk authentication
    // For now, using a dummy user ID for testing
    const userId = 'dummy_user_id';

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            basePrice: true,
            images: true,
            stockQuantity: true,
          }
        },
        variant: {
          select: {
            id: true,
            name: true,
            stock: true,
            attributes: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // If no cart items found in database, return dummy data for testing
    if (cartItems.length === 0) {
      const dummyCartItems = getDummyCartItems();
      return NextResponse.json({
        success: true,
        data: dummyCartItems
      });
    }

    return NextResponse.json({
      success: true,
      data: cartItems
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { productId, variantId, quantity } = await request.json();

    // Validation
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Product ID and valid quantity are required' },
        { status: 400 }
      );
    }

    // TODO: Get actual user ID from Clerk authentication
    const userId = 'dummy_user_id';

    // For demo purposes, return success with dummy data
    // In real implementation, this would:
    // 1. Check if product/variant exists and has stock
    // 2. Check if item already exists in cart
    // 3. Update quantity or create new cart item
    // 4. Return the updated cart item

    const dummyCartItem = {
      id: `cart_${Date.now()}`,
      productId,
      variantId: variantId || null,
      quantity,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: dummyCartItem,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    // TODO: Get actual user ID from Clerk authentication
    const userId = 'dummy_user_id';

    // For demo purposes, return success
    // In real implementation, this would delete all cart items for the user
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Dummy cart data for testing
function getDummyCartItems() {
  return [
    {
      id: 'cart_1',
      productId: '1',
      variantId: '1',
      quantity: 2,
      userId: 'dummy_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
      product: {
        id: '1',
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        basePrice: 29999,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
        stockQuantity: 50,
      },
      variant: {
        id: '1',
        name: 'Black',
        stock: 20,
        attributes: { color: 'Black' },
      }
    },
    {
      id: 'cart_2',
      productId: '2',
      variantId: '5',
      quantity: 1,
      userId: 'dummy_user_id',
      createdAt: new Date(),
      updatedAt: new Date(),
      product: {
        id: '2',
        name: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-t-shirt',
        basePrice: 2499,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
        stockQuantity: 100,
      },
      variant: {
        id: '5',
        name: 'Medium - Black',
        stock: 15,
        attributes: { size: 'M', color: 'Black' },
      }
    }
  ];
} 
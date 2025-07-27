// src/app/api/cart/[id]/route.ts
// API routes for individual cart item operations

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// PATCH /api/cart/[id] - Update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { quantity } = await request.json();

    // Validation
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    // TODO: Get actual user ID from Clerk authentication
    const userId = 'dummy_user_id';

    // For demo purposes, return success with dummy data
    // In real implementation, this would:
    // 1. Verify the cart item belongs to the user
    // 2. Check if the product/variant has enough stock
    // 3. Update the cart item quantity
    // 4. Return the updated cart item

    const dummyUpdatedItem = {
      id,
      quantity,
      userId,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: dummyUpdatedItem,
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Get actual user ID from Clerk authentication
    const userId = 'dummy_user_id';

    // For demo purposes, return success
    // In real implementation, this would:
    // 1. Verify the cart item belongs to the user
    // 2. Delete the cart item from database
    // 3. Return confirmation

    return NextResponse.json({
      success: true,
      message: 'Cart item removed successfully'
    });

  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
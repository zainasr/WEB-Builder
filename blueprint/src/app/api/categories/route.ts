//src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';



const prisma = new PrismaClient();

export async function GET() {
  try {
    // Prisma Query Explanation:
    // 1. findMany() - Gets all categories from database
    // 2. where: { isActive: true } - Only fetch active categories (business logic)
    // 3. include: { _count: { select: { products: true } } } - Count related products for each category
    // 4. orderBy: { name: 'asc' } - Sort categories alphabetically for consistent UI
    // 5. This is efficient because it uses Prisma's built-in counting without loading actual product data
    
    const categories = await prisma.category.findMany({
      where: {
        isActive: true, // Only show active categories
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true, // Only count active products
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc', // Alphabetical order
      },
    });

    // Transform data for frontend consumption
    const formattedCategories = categories.map((category:any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        data: [] 
      },
      { status: 500 }
    );
  }
} 
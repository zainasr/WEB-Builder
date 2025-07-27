//src/app/api/best-sellers/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Prisma Query Explanation:
    // 1. findMany() - Gets products from database
    // 2. where: { isActive: true, isFeatured: true } - Only fetch active and featured products (best sellers)
    // 3. include: { category: true } - Include category information for each product
    // 4. orderBy: { createdAt: 'desc' } - Show newest featured products first
    // 5. take: 8 - Limit to 8 products for homepage display (performance optimization)
    // 6. This is efficient because it filters at database level and only loads needed data
    
    const bestSellers = await prisma.product.findMany({
      where: {
        isActive: true,    // Only active products
        isFeatured: true,  // Only featured products (best sellers)
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc', // Newest featured products first
      },
      take: 8, // Limit to 8 products for homepage
    });

    // Transform data for frontend consumption
    const formattedProducts = bestSellers.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      images: product.images,
      category: product.category,
      isFeatured: product.isFeatured,
      stockQuantity: product.stockQuantity,
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
    });

  } catch (error) {
    console.error('Error fetching best sellers:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch best sellers',
        data: [] 
      },
      { status: 500 }
    );
  }
} 
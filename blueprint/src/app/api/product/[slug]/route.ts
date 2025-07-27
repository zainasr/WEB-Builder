// src/app/api/product/[slug]/route.ts
// API route to fetch individual product details by slug

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get product with related data using Prisma
    const [product, relatedProducts] = await Promise.all([
      // Fetch main product with all related data
      prisma.product.findFirst({
        where: { 
          slug,
          isActive: true 
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          variants: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      
      // Fetch related products from same category
      prisma.product.findMany({
        where: {
          slug: { not: slug },
          isActive: true,
          category: {
            slug: await prisma.product.findFirst({
              where: { slug },
              select: { category: { select: { slug: true } } }
            }).then((p: any) => p?.category.slug || '')
          }
        },
        take: 4,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // If no product found in database, return dummy data for testing
    if (!product) {
      const dummyProduct = getDummyProduct(slug);
      if (!dummyProduct) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      
      const dummyRelated = getDummyRelatedProducts(dummyProduct.category.slug, slug);
      
      return NextResponse.json({
        success: true,
        data: {
          product: dummyProduct,
          relatedProducts: dummyRelated
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Dummy data for testing when database is empty
function getDummyProduct(slug: string) {
  const dummyProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, professionals, and travelers.',
      basePrice: 29999, // $299.99
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
        'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
      ],
      category: {
        id: '1',
        name: 'Electronics',
        slug: 'electronics'
      },
      isFeatured: true,
      stockQuantity: 50,
      variants: [
        {
          id: '1',
          name: 'Black',
          stock: 20,
          isActive: true,
          attributes: { color: 'Black' }
        },
        {
          id: '2', 
          name: 'White',
          stock: 15,
          isActive: true,
          attributes: { color: 'White' }
        },
        {
          id: '3',
          name: 'Silver',
          stock: 15,
          isActive: true,
          attributes: { color: 'Silver' }
        }
      ]
    },
    {
      id: '2',
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-t-shirt',
      description: 'A timeless classic made from 100% organic cotton. Soft, breathable, and durable. Available in multiple colors and sizes. Perfect for everyday wear, layering, or as a wardrobe staple.',
      basePrice: 2499, // $24.99
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80'
      ],
      category: {
        id: '2',
        name: 'Clothing',
        slug: 'clothing'
      },
      isFeatured: false,
      stockQuantity: 100,
      variants: [
        {
          id: '4',
          name: 'Small - Black',
          stock: 10,
          isActive: true,
          attributes: { size: 'S', color: 'Black' }
        },
        {
          id: '5',
          name: 'Medium - Black', 
          stock: 15,
          isActive: true,
          attributes: { size: 'M', color: 'Black' }
        },
        {
          id: '6',
          name: 'Large - Black',
          stock: 12,
          isActive: true,
          attributes: { size: 'L', color: 'Black' }
        },
        {
          id: '7',
          name: 'Small - White',
          stock: 8,
          isActive: true,
          attributes: { size: 'S', color: 'White' }
        },
        {
          id: '8',
          name: 'Medium - White',
          stock: 20,
          isActive: true,
          attributes: { size: 'M', color: 'White' }
        },
        {
          id: '9',
          name: 'Large - White',
          stock: 15,
          isActive: true,
          attributes: { size: 'L', color: 'White' }
        }
      ]
    },
    {
      id: '3',
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      description: 'Track your fitness goals with our advanced smart watch. Features heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Water-resistant design perfect for swimming and outdoor activities.',
      basePrice: 19999, // $199.99
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
      ],
      category: {
        id: '1',
        name: 'Electronics',
        slug: 'electronics'
      },
      isFeatured: true,
      stockQuantity: 30,
      variants: [
        {
          id: '10',
          name: '42mm - Black',
          stock: 10,
          isActive: true,
          attributes: { size: '42mm', color: 'Black' }
        },
        {
          id: '11',
          name: '42mm - Silver',
          stock: 8,
          isActive: true,
          attributes: { size: '42mm', color: 'Silver' }
        },
        {
          id: '12',
          name: '46mm - Black',
          stock: 7,
          isActive: true,
          attributes: { size: '46mm', color: 'Black' }
        },
        {
          id: '13',
          name: '46mm - Silver',
          stock: 5,
          isActive: true,
          attributes: { size: '46mm', color: 'Silver' }
        }
      ]
    }
  ];

  return dummyProducts.find(p => p.slug === slug) || null;
}

function getDummyRelatedProducts(categorySlug: string, excludeSlug: string) {
  const allDummyProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      description: 'Experience crystal-clear audio with our premium wireless headphones.',
      basePrice: 29999,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
      category: { name: 'Electronics', slug: 'electronics' },
      isFeatured: true,
      stockQuantity: 50
    },
    {
      id: '3',
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      description: 'Track your fitness goals with our advanced smart watch.',
      basePrice: 19999,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
      category: { name: 'Electronics', slug: 'electronics' },
      isFeatured: true,
      stockQuantity: 30
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      slug: 'bluetooth-speaker',
      description: 'Portable wireless speaker with amazing sound quality.',
      basePrice: 7999,
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
      category: { name: 'Electronics', slug: 'electronics' },
      isFeatured: false,
      stockQuantity: 25
    },
    {
      id: '2',
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-t-shirt', 
      description: 'A timeless classic made from 100% organic cotton.',
      basePrice: 2499,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      category: { name: 'Clothing', slug: 'clothing' },
      isFeatured: false,
      stockQuantity: 100
    }
  ];

  return allDummyProducts
    .filter(p => p.category.slug === categorySlug && p.slug !== excludeSlug)
    .slice(0, 4);
} 
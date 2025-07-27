//src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null;
    const sortBy = searchParams.get('sortBy') || 'newest';
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const inStock = searchParams.get('inStock') === 'true';

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Prisma Query Explanation:
    // 1. where clause - Filters products based on query parameters
    // 2. search - Uses 'contains' for name and description (case insensitive)
    // 3. category - Filters by category slug if provided
    // 4. price range - Filters by basePrice between min and max
    // 5. isFeatured - Filters featured products when true
    // 6. inStock - Filters products with stockQuantity > 0
    // 7. include - Gets category info and counts total for pagination
    // 8. orderBy - Sorts by different criteria (newest, price, name)
    // 9. skip/take - Implements pagination efficiently at database level

    // Build where clause dynamically
    const whereClause: any = {
      isActive: true, // Always filter active products
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      whereClause.category = {
        slug: category
      };
    }

    if (minPrice !== null || maxPrice !== null) {
      whereClause.basePrice = {};
      if (minPrice !== null) whereClause.basePrice.gte = minPrice * 100; // Convert to cents
      if (maxPrice !== null) whereClause.basePrice.lte = maxPrice * 100; // Convert to cents
    }

    if (isFeatured) {
      whereClause.isFeatured = true;
    }

    if (inStock) {
      whereClause.stockQuantity = { gt: 0 };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }; // Default: newest first
    
    switch (sortBy) {
      case 'price-low':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price-high':
        orderBy = { basePrice: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'popular':
        orderBy = { isFeatured: 'desc' }; // Featured products first
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Execute queries in parallel for efficiency
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.product.count({
        where: whereClause,
      })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // If no products found in database, return dummy data for development/testing
    if (products.length === 0 && totalCount === 0) {
      console.log('No products found in database, returning dummy data');
      const dummyData = generateDummyProductsData(request);
      
      return NextResponse.json({
        success: true,
        data: dummyData,
        isDummyData: true, // Flag to indicate this is dummy data
      });
    }

    // Transform data for frontend
    const formattedProducts = products.map((product: any) => ({
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
      data: {
        products: formattedProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit,
        },
        filters: {
          search,
          category,
          minPrice,
          maxPrice,
          sortBy,
          isFeatured,
          inStock,
        }
      },
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return dummy data on error with same structure
    const dummyData = generateDummyProductsData(request);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      data: dummyData
    });
  }
}

// Generate comprehensive dummy data for testing
function generateDummyProductsData(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const isFeatured = searchParams.get('isFeatured') === 'true';

  // Comprehensive dummy products
  const allDummyProducts = [
    {
      id: "prod-1", name: "Wireless Bluetooth Headphones", slug: "wireless-bluetooth-headphones",
      description: "Premium quality wireless headphones with noise cancellation", basePrice: 9999,
      images: ["/api/placeholder/400/400"], category: { name: "Electronics", slug: "electronics" },
      isFeatured: true, stockQuantity: 15,
    },
    {
      id: "prod-2", name: "Stylish Cotton T-Shirt", slug: "stylish-cotton-t-shirt",
      description: "Comfortable and trendy cotton t-shirt for everyday wear", basePrice: 2499,
      images: ["/api/placeholder/400/400"], category: { name: "Fashion", slug: "fashion" },
      isFeatured: true, stockQuantity: 32,
    },
    {
      id: "prod-3", name: "Smart Home Security Camera", slug: "smart-home-security-camera",
      description: "1080p HD security camera with night vision and mobile app", basePrice: 12999,
      images: ["/api/placeholder/400/400"], category: { name: "Electronics", slug: "electronics" },
      isFeatured: false, stockQuantity: 8,
    },
    {
      id: "prod-4", name: "Ergonomic Office Chair", slug: "ergonomic-office-chair",
      description: "Comfortable office chair with lumbar support and adjustable height", basePrice: 24999,
      images: ["/api/placeholder/400/400"], category: { name: "Home & Garden", slug: "home-garden" },
      isFeatured: true, stockQuantity: 12,
    },
    {
      id: "prod-5", name: "Gaming Mechanical Keyboard", slug: "gaming-mechanical-keyboard",
      description: "RGB backlit mechanical keyboard for gaming enthusiasts", basePrice: 8999,
      images: ["/api/placeholder/400/400"], category: { name: "Gaming", slug: "gaming" },
      isFeatured: false, stockQuantity: 18,
    },
    {
      id: "prod-6", name: "Fitness Yoga Mat", slug: "fitness-yoga-mat",
      description: "Non-slip eco-friendly yoga mat for fitness and meditation", basePrice: 3999,
      images: ["/api/placeholder/400/400"], category: { name: "Sports & Fitness", slug: "sports-fitness" },
      isFeatured: true, stockQuantity: 25,
    },
    {
      id: "prod-7", name: "Professional Camera Lens", slug: "professional-camera-lens",
      description: "50mm f/1.8 lens for professional photography", basePrice: 34999,
      images: ["/api/placeholder/400/400"], category: { name: "Photography", slug: "photography" },
      isFeatured: false, stockQuantity: 6,
    },
    {
      id: "prod-8", name: "Stainless Steel Water Bottle", slug: "stainless-steel-water-bottle",
      description: "Insulated water bottle that keeps drinks cold for 24 hours", basePrice: 1999,
      images: ["/api/placeholder/400/400"], category: { name: "Sports & Fitness", slug: "sports-fitness" },
      isFeatured: false, stockQuantity: 40,
    },
    {
      id: "prod-9", name: "Wireless Charging Pad", slug: "wireless-charging-pad",
      description: "Fast wireless charging pad compatible with all Qi-enabled devices", basePrice: 4999,
      images: ["/api/placeholder/400/400"], category: { name: "Electronics", slug: "electronics" },
      isFeatured: true, stockQuantity: 22,
    },
    {
      id: "prod-10", name: "Leather Laptop Bag", slug: "leather-laptop-bag",
      description: "Premium leather laptop bag with multiple compartments", basePrice: 7999,
      images: ["/api/placeholder/400/400"], category: { name: "Fashion", slug: "fashion" },
      isFeatured: false, stockQuantity: 14,
    },
    {
      id: "prod-11", name: "Smart Watch Series 5", slug: "smart-watch-series-5",
      description: "Advanced smartwatch with health monitoring and GPS", basePrice: 29999,
      images: ["/api/placeholder/400/400"], category: { name: "Electronics", slug: "electronics" },
      isFeatured: true, stockQuantity: 9,
    },
    {
      id: "prod-12", name: "Ceramic Coffee Mug Set", slug: "ceramic-coffee-mug-set",
      description: "Set of 4 elegant ceramic coffee mugs perfect for daily use", basePrice: 2999,
      images: ["/api/placeholder/400/400"], category: { name: "Home & Garden", slug: "home-garden" },
      isFeatured: false, stockQuantity: 30,
    }
  ];

  // Filter dummy data based on query params
  let filteredProducts = [...allDummyProducts];
  
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : null;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null;
  const inStock = searchParams.get('inStock') === 'true';
  
  // Apply search filter
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply category filter
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category.slug === category);
  }
  
  // Apply price range filter
  if (minPrice !== null) {
    filteredProducts = filteredProducts.filter(p => p.basePrice >= minPrice * 100);
  }
  if (maxPrice !== null) {
    filteredProducts = filteredProducts.filter(p => p.basePrice <= maxPrice * 100);
  }
  
  // Apply featured filter
  if (isFeatured) {
    filteredProducts = filteredProducts.filter(p => p.isFeatured);
  }
  
  // Apply in stock filter
  if (inStock) {
    filteredProducts = filteredProducts.filter(p => p.stockQuantity > 0);
  }
  
  // Apply sorting
  const sortBy = searchParams.get('sortBy') || 'newest';
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'popular':
      filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
    case 'newest':
    default:
      // Keep original order (newest first)
      break;
  }

  // Apply pagination to dummy data
  const totalCount = filteredProducts.length;
  const offset = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(offset, offset + limit);
  
  const totalPages = Math.ceil(totalCount / limit);

  return {
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit,
    },
    filters: {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      isFeatured,
      inStock,
    }
  };
} 
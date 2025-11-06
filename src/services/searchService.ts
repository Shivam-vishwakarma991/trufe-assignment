import { prisma } from '../lib/prisma';
import { SearchParams, SearchResult, Product } from '../types';
import { validateSearchParams, sanitizeSearchQuery, SearchError, DatabaseError } from '../lib/validations';

/**
 * Core search service for marketplace catalog
 * Handles keyword matching, filtering, pagination, and facet counting
 */
export class SearchService {
  private static instance: SearchService;

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  /**
   * Perform comprehensive search with filters, pagination, and facets
   */
  async search(params: SearchParams): Promise<SearchResult> {
    try {
      // Validate and sanitize input parameters
      const validatedParams = validateSearchParams(params);
      const sanitizedQuery = validatedParams.q ? sanitizeSearchQuery(validatedParams.q) : '';

      // Build where clause for filtering
      const whereClause = this.buildWhereClause(validatedParams, sanitizedQuery);

      // Calculate pagination
      const page = validatedParams.page || 1;
      const limit = validatedParams.limit || 20;
      const skip = (page - 1) * limit;

      // Execute search query with pagination
      const [products, totalCount] = await Promise.all([
        this.executeProductSearch(whereClause, skip, limit),
        this.getProductCount(whereClause)
      ]);

      // Generate facets for filter options
      const facets = await this.generateFacets(validatedParams, sanitizedQuery);

      return {
        products,
        totalCount,
        facets
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new SearchError(`Search operation failed: ${error.message}`);
      }
      throw new SearchError('Unknown search error occurred');
    }
  }

  /**
   * Build Prisma where clause based on search parameters
   */
  private buildWhereClause(params: SearchParams, sanitizedQuery: string) {
    const where: any = {};

    // Keyword search - search in title and description
    if (sanitizedQuery) {
      where.OR = [
        {
          title: {
            contains: sanitizedQuery,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: sanitizedQuery,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Category filter
    if (params.category) {
      where.category = {
        equals: params.category,
        mode: 'insensitive'
      };
    }

    // Location filter
    if (params.location) {
      where.location = {
        equals: params.location,
        mode: 'insensitive'
      };
    }

    // Price range filter
    if (params.min !== undefined || params.max !== undefined) {
      where.price = {};
      if (params.min !== undefined) {
        where.price.gte = params.min;
      }
      if (params.max !== undefined) {
        where.price.lte = params.max;
      }
    }

    return where;
  }

  /**
   * Execute product search with pagination
   */
  private async executeProductSearch(whereClause: any, skip: number, limit: number): Promise<Product[]> {
    try {
      const rawProducts = await prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: [
          { createdAt: 'desc' },
          { id: 'asc' } // Secondary sort for consistent pagination
        ]
      });

      // Transform raw products to match our Product type
      return rawProducts.map(product => ({
        ...product,
        images: JSON?.parse(product?.images) // Parse JSON string to array
      }));
    } catch (error) {
      throw new DatabaseError(`Failed to execute product search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get total count of products matching search criteria
   */
  private async getProductCount(whereClause: any): Promise<number> {
    try {
      return await prisma.product.count({
        where: whereClause
      });
    } catch (error) {
      throw new DatabaseError(`Failed to get product count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate facets for filter options display
   */
  private async generateFacets(params: SearchParams, sanitizedQuery: string) {
    try {
      // Build base where clause without current filters for facet counting
      const baseWhere = sanitizedQuery ? {
        OR: [
          {
            title: {
              contains: sanitizedQuery,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: sanitizedQuery,
              mode: 'insensitive'
            }
          }
        ]
      } : {};

      // Get category facets (excluding current category filter)
      const categoryFacets = await this.getCategoryFacets({
        ...baseWhere,
        ...(params.location && { location: { equals: params.location, mode: 'insensitive' } }),
        ...(this.buildPriceFilter(params.min, params.max))
      });

      // Get location facets (excluding current location filter)
      const locationFacets = await this.getLocationFacets({
        ...baseWhere,
        ...(params.category && { category: { equals: params.category, mode: 'insensitive' } }),
        ...(this.buildPriceFilter(params.min, params.max))
      });

      // Get price range for all matching products
      const priceRange = await this.getPriceRange({
        ...baseWhere,
        ...(params.category && { category: { equals: params.category, mode: 'insensitive' } }),
        ...(params.location && { location: { equals: params.location, mode: 'insensitive' } })
      });

      return {
        categories: categoryFacets,
        locations: locationFacets,
        priceRange
      };
    } catch (error) {
      throw new DatabaseError(`Failed to generate facets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get category facets with counts
   */
  private async getCategoryFacets(whereClause: any) {
    const categoryGroups = await prisma.product.groupBy({
      by: ['category'],
      where: whereClause,
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    return categoryGroups.map(group => ({
      name: group.category,
      count: group._count.category
    }));
  }

  /**
   * Get location facets with counts
   */
  private async getLocationFacets(whereClause: any) {
    const locationGroups = await prisma.product.groupBy({
      by: ['location'],
      where: whereClause,
      _count: {
        location: true
      },
      orderBy: {
        _count: {
          location: 'desc'
        }
      }
    });

    return locationGroups.map(group => ({
      name: group.location,
      count: group._count.location
    }));
  }

  /**
   * Get price range for matching products
   */
  private async getPriceRange(whereClause: any) {
    const priceStats = await prisma.product.aggregate({
      where: whereClause,
      _min: {
        price: true
      },
      _max: {
        price: true
      }
    });

    return {
      min: priceStats._min.price || 0,
      max: priceStats._max.price || 0
    };
  }

  /**
   * Helper to build price filter object
   */
  private buildPriceFilter(min?: number, max?: number) {
    if (min === undefined && max === undefined) {
      return {};
    }

    const priceFilter: any = {};
    if (min !== undefined) {
      priceFilter.gte = min;
    }
    if (max !== undefined) {
      priceFilter.lte = max;
    }

    return { price: priceFilter };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        return null;
      }

      return {
        ...product,
        images: JSON?.parse(product?.images)
      };
    } catch (error) {
      throw new DatabaseError(`Failed to get product by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { slug }
      });

      if (!product) {
        return null;
      }

      return {
        ...product,
        images: JSON?.parse(product?.images)
      };
    } catch (error) {
      throw new DatabaseError(`Failed to get product by slug: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all categories
   */
  async getCategories() {
    try {
      return await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      throw new DatabaseError(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all locations
   */
  async getLocations() {
    try {
      return await prisma.location.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      throw new DatabaseError(`Failed to get locations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const searchService = SearchService.getInstance();
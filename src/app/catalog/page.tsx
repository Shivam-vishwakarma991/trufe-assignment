import { Metadata } from 'next';
import { Suspense } from 'react';
import { searchService } from '@/services';
import { processSearchParams, buildCanonicalUrl } from '@/lib/validations';
import { CatalogPageProps } from '@/types';
import ProductGrid from '@/components/catalog/ProductGrid';
import FilterContainer from '@/components/catalog/FilterContainer';
import FilterPills from '@/components/catalog/FilterPills';
import SearchBar from '@/components/catalog/SearchBar';
import Pagination from '@/components/catalog/Pagination';
import { 
  LoadingSpinner, 
  EmptyState, 
  ErrorBoundary,
  ProductGridSkeleton,
  FilterSidebarSkeleton,
  SearchBarSkeleton,
  FilterPillsSkeleton,
  PaginationSkeleton
} from '@/components/ui';

/**
 * Generate SEO metadata for catalog pages
 */
export async function generateMetadata({ searchParams }: CatalogPageProps): Promise<Metadata> {
  try {
    const validatedParams = processSearchParams(searchParams);
    
    // Generate dynamic title based on filters
    let title = 'Marketplace Catalog';
    const titleParts: string[] = [];
    
    if (validatedParams.q) {
      titleParts.push(`"${validatedParams.q}"`);
    }
    
    if (validatedParams.category) {
      titleParts.push(`in ${validatedParams.category}`);
    }
    
    if (validatedParams.location) {
      titleParts.push(`near ${validatedParams.location}`);
    }
    
    if (validatedParams.min || validatedParams.max) {
      const priceRange = [];
      if (validatedParams.min) priceRange.push(`$${validatedParams.min}+`);
      if (validatedParams.max) priceRange.push(`up to $${validatedParams.max}`);
      titleParts.push(`priced ${priceRange.join(' ')}`);
    }
    
    if (titleParts.length > 0) {
      title = `${titleParts.join(' ')} - Marketplace Catalog`;
    }
    
    // Generate description
    let description = 'Browse our marketplace catalog with thousands of products.';
    if (titleParts.length > 0) {
      description = `Find products ${titleParts.join(' ')} in our marketplace catalog.`;
    }
    
    // Generate canonical URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const canonicalUrl = buildCanonicalUrl(baseUrl, validatedParams);
    
    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    // Fallback metadata if validation fails
    return {
      title: 'Marketplace Catalog',
      description: 'Browse our marketplace catalog with thousands of products.',
    };
  }
}

/**
 * Main catalog page component with server-side rendering
 */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  try {
    // Validate and process search parameters
    const validatedParams = processSearchParams(searchParams);
    
    // Fetch search results and filter options
    const [searchResult, categories, locations] = await Promise.all([
      searchService.search(validatedParams),
      searchService.getCategories(),
      searchService.getLocations(),
    ]);
    
    const { products, totalCount, facets } = searchResult;
    const currentPage = validatedParams.page || 1;
    const pageSize = validatedParams.limit || 20;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Convert search params to filter state for UI components
    const currentFilters = {
      query: validatedParams.q || '',
      category: validatedParams.category || '',
      location: validatedParams.location || '',
      priceRange: {
        min: validatedParams.min || 0,
        max: validatedParams.max || 0,
      },
    };
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Marketplace Catalog
            </h1>
            
            {/* Search Bar */}
            <div className="mb-6">
              <ErrorBoundary>
                <Suspense fallback={<SearchBarSkeleton />}>
                  <SearchBar 
                    query={currentFilters.query}
                    placeholder="Search products..."
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Filter Pills */}
            {(currentFilters.query || currentFilters.category || currentFilters.location || 
              currentFilters.priceRange.min > 0 || currentFilters.priceRange.max > 0) && (
              <div className="mb-6">
                <ErrorBoundary>
                  <Suspense fallback={<FilterPillsSkeleton />}>
                    <FilterPills filters={currentFilters} />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )}
            
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {totalCount === 0 ? (
                  'No products found'
                ) : totalCount === 1 ? (
                  '1 product found'
                ) : (
                  `${totalCount.toLocaleString()} products found`
                )}
                {currentPage > 1 && ` (page ${currentPage} of ${totalPages})`}
              </p>
            </div>
          </div>
          
          {/* Mobile Filter Button - Show above content on mobile */}
          <div className="mb-6 lg:hidden">
            <ErrorBoundary>
              <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
                <FilterContainer
                  currentFilters={currentFilters}
                  categories={categories}
                  locations={locations}
                  priceRange={facets.priceRange}
                />
              </Suspense>
            </ErrorBoundary>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
              <ErrorBoundary>
                <Suspense fallback={<FilterSidebarSkeleton />}>
                  <FilterContainer
                    currentFilters={currentFilters}
                    categories={categories}
                    locations={locations}
                    priceRange={facets.priceRange}
                  />
                </Suspense>
              </ErrorBoundary>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1">
              {products.length === 0 ? (
                <EmptyState
                  title="No products found"
                  description={
                    currentFilters.query || currentFilters.category || currentFilters.location ||
                    currentFilters.priceRange.min > 0 || currentFilters.priceRange.max > 0
                      ? "Try adjusting your filters to see more results."
                      : "There are no products available at the moment."
                  }
                />
              ) : (
                <>
                  {/* Product Grid */}
                  <ErrorBoundary>
                    <Suspense fallback={<ProductGridSkeleton count={pageSize} />}>
                      <ProductGrid
                        products={products}
                        totalCount={totalCount}
                        currentPage={currentPage}
                        pageSize={pageSize}
                      />
                    </Suspense>
                  </ErrorBoundary>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <ErrorBoundary>
                        <Suspense fallback={<PaginationSkeleton />}>
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                          />
                        </Suspense>
                      </ErrorBoundary>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Catalog page error:', error);
    
    // Return error state
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We&apos;re having trouble loading the catalog. Please try again later.
          </p>
          <a
            href="/catalog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }
}
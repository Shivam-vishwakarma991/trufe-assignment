import { redirect } from 'next/navigation';
import { handleSearchRedirect, processSearchParams } from '@/lib/validations';

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    min?: string;
    max?: string;
    location?: string;
    page?: string;
    limit?: string;
  };
}

/**
 * Search page that redirects to catalog with proper parameter handling
 * This route exists for SEO purposes and provides a clean /search URL
 */
export default function SearchPage({ searchParams }: SearchPageProps) {
  // Handle the redirect with proper error handling
  const redirectPath = handleSearchRedirect(searchParams);
  redirect(redirectPath);
}

/**
 * Generate metadata for search pages (for SEO)
 */
export function generateMetadata({ searchParams }: SearchPageProps) {
  try {
    const validatedParams = processSearchParams(searchParams);
    
    // Generate title based on search parameters
    let title = 'Search - Marketplace';
    if (validatedParams.q) {
      title = `Search for "${validatedParams.q}" - Marketplace`;
    }
    
    // Generate description
    let description = 'Search our marketplace for products.';
    if (validatedParams.q) {
      description = `Search results for "${validatedParams.q}" in our marketplace.`;
    }
    
    return {
      title,
      description,
      robots: {
        index: false, // Don't index search pages to avoid duplicate content
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Search - Marketplace',
      description: 'Search our marketplace for products.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}
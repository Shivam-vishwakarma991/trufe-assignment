'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { PaginationProps } from '@/types';
import { paginationService } from '@/services/paginationService';

/**
 * Enhanced pagination component with URL-based page state management,
 * accessibility support, and comprehensive edge case handling
 */
export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // Validate props and handle edge cases
  const validatedCurrentPage = Math.max(1, Math.min(currentPage || 1, totalPages || 1));
  const validatedTotalPages = Math.max(1, totalPages || 1);

  // Enhanced navigation function with validation and loading state
  const goToPage = useCallback((page: number) => {
    // Validate page number
    const validPage = paginationService.validatePageNumber(page, validatedTotalPages);
    
    // Don't navigate if already on the target page
    if (validPage === validatedCurrentPage) {
      return;
    }

    setIsNavigating(true);
    
    const params = new URLSearchParams(searchParams);
    
    if (validPage > 1) {
      params.set('page', validPage.toString());
    } else {
      params.delete('page');
    }
    
    const queryString = params.toString();
    const url = queryString ? `/catalog?${queryString}` : '/catalog';
    
    // Use replace for better UX on rapid navigation
    router.push(url);
    
    // Reset loading state after a short delay
    setTimeout(() => setIsNavigating(false), 100);
  }, [validatedCurrentPage, validatedTotalPages, searchParams, router]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent, page: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToPage(page);
    }
  }, [goToPage]);

  // Reset navigation state when page changes
  useEffect(() => {
    setIsNavigating(false);
  }, [validatedCurrentPage]);

  // Don't render if only one page or invalid data
  if (validatedTotalPages <= 1 || validatedCurrentPage > validatedTotalPages) {
    return null;
  }

  // Calculate pagination metadata using the service
  const paginationMeta = paginationService.calculatePagination(
    validatedTotalPages * 20, // Assuming 20 items per page for metadata
    validatedCurrentPage,
    20
  );

  // Generate page numbers with ellipsis handling
  const visiblePages = paginationService.generatePageNumbers(
    validatedCurrentPage,
    validatedTotalPages,
    7 // Show up to 7 page numbers
  );

  return (
    <nav 
      className="flex items-center justify-between" 
      aria-label="Pagination Navigation"
      role="navigation"
    >
      {/* Mobile pagination */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => goToPage(validatedCurrentPage - 1)}
          onKeyDown={(e) => handleKeyDown(e, validatedCurrentPage - 1)}
          disabled={paginationMeta.isFirstPage || isNavigating}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
            isNavigating ? 'opacity-75' : ''
          }`}
          aria-label={`Go to previous page, page ${validatedCurrentPage - 1}`}
          aria-disabled={paginationMeta.isFirstPage}
        >
          {isNavigating ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          Previous
        </button>
        
        <div className="flex items-center">
          <span 
            className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700"
            aria-live="polite"
            aria-atomic="true"
          >
            Page {validatedCurrentPage} of {validatedTotalPages}
          </span>
        </div>
        
        <button
          onClick={() => goToPage(validatedCurrentPage + 1)}
          onKeyDown={(e) => handleKeyDown(e, validatedCurrentPage + 1)}
          disabled={paginationMeta.isLastPage || isNavigating}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
            isNavigating ? 'opacity-75' : ''
          }`}
          aria-label={`Go to next page, page ${validatedCurrentPage + 1}`}
          aria-disabled={paginationMeta.isLastPage}
        >
          Next
          {isNavigating ? (
            <svg className="animate-spin ml-2 -mr-1 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
        <div>
          <nav 
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" 
            aria-label="Pagination"
            role="group"
          >
            {/* Previous button */}
            <button
              onClick={() => goToPage(validatedCurrentPage - 1)}
              onKeyDown={(e) => handleKeyDown(e, validatedCurrentPage - 1)}
              disabled={paginationMeta.isFirstPage || isNavigating}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                isNavigating ? 'opacity-75' : ''
              }`}
              aria-label={`Go to previous page, page ${validatedCurrentPage - 1}`}
              aria-disabled={paginationMeta.isFirstPage}
            >
              <span className="sr-only">Previous</span>
              {isNavigating ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Page numbers */}
            {visiblePages.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    aria-hidden="true"
                  >
                    <span className="sr-only">More pages</span>
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isCurrentPage = pageNumber === validatedCurrentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  onKeyDown={(e) => handleKeyDown(e, pageNumber)}
                  disabled={isNavigating}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isCurrentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 cursor-default'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  } ${isNavigating ? 'opacity-75' : ''}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                  aria-label={isCurrentPage ? `Current page, page ${pageNumber}` : `Go to page ${pageNumber}`}
                  tabIndex={isCurrentPage ? -1 : 0}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next button */}
            <button
              onClick={() => goToPage(validatedCurrentPage + 1)}
              onKeyDown={(e) => handleKeyDown(e, validatedCurrentPage + 1)}
              disabled={paginationMeta.isLastPage || isNavigating}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                isNavigating ? 'opacity-75' : ''
              }`}
              aria-label={`Go to next page, page ${validatedCurrentPage + 1}`}
              aria-disabled={paginationMeta.isLastPage}
            >
              <span className="sr-only">Next</span>
              {isNavigating ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Screen reader summary */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isNavigating 
          ? 'Loading page...' 
          : `Page ${validatedCurrentPage} of ${validatedTotalPages}`
        }
      </div>
    </nav>
  );
}
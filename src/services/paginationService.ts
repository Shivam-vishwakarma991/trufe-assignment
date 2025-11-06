/**
 * Pagination service for handling large result sets
 * Provides utilities for calculating pagination metadata and generating page links
 */
export class PaginationService {
  private static instance: PaginationService;

  public static getInstance(): PaginationService {
    if (!PaginationService.instance) {
      PaginationService.instance = new PaginationService();
    }
    return PaginationService.instance;
  }

  /**
   * Calculate pagination metadata
   */
  calculatePagination(totalCount: number, currentPage: number, pageSize: number) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalCount);

    return {
      totalCount,
      totalPages,
      currentPage,
      pageSize,
      hasNextPage,
      hasPreviousPage,
      startIndex,
      endIndex,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
      nextPage: hasNextPage ? currentPage + 1 : null,
      previousPage: hasPreviousPage ? currentPage - 1 : null
    };
  }

  /**
   * Generate page numbers for pagination UI
   * Returns array of page numbers with ellipsis handling
   */
  generatePageNumbers(currentPage: number, totalPages: number, maxVisible: number = 7): Array<number | 'ellipsis'> {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: Array<number | 'ellipsis'> = [];
    const halfVisible = Math.floor(maxVisible / 2);

    // Always show first page
    pages.push(1);

    if (currentPage <= halfVisible + 2) {
      // Show pages from start
      for (let i = 2; i <= Math.min(maxVisible - 1, totalPages - 1); i++) {
        pages.push(i);
      }
      if (totalPages > maxVisible - 1) {
        pages.push('ellipsis');
      }
    } else if (currentPage >= totalPages - halfVisible - 1) {
      // Show pages from end
      if (totalPages > maxVisible - 1) {
        pages.push('ellipsis');
      }
      for (let i = Math.max(totalPages - maxVisible + 2, 2); i <= totalPages - 1; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current
      pages.push('ellipsis');
      for (let i = currentPage - halfVisible + 1; i <= currentPage + halfVisible - 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  /**
   * Validate page number
   */
  validatePageNumber(page: number, totalPages: number): number {
    if (page < 1) return 1;
    if (page > totalPages && totalPages > 0) return totalPages;
    return page;
  }

  /**
   * Calculate offset for database queries
   */
  calculateOffset(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  /**
   * Generate pagination summary text
   */
  generateSummaryText(startIndex: number, endIndex: number, totalCount: number): string {
    if (totalCount === 0) {
      return 'No results found';
    }

    if (totalCount === 1) {
      return '1 result';
    }

    if (startIndex === endIndex) {
      return `${startIndex} of ${totalCount} results`;
    }

    return `${startIndex}-${endIndex} of ${totalCount} results`;
  }

  /**
   * Check if pagination is needed
   */
  isPaginationNeeded(totalCount: number, pageSize: number): boolean {
    return totalCount > pageSize;
  }

  /**
   * Get page size options for UI
   */
  getPageSizeOptions(): Array<{ value: number; label: string }> {
    return [
      { value: 10, label: '10 per page' },
      { value: 20, label: '20 per page' },
      { value: 50, label: '50 per page' },
      { value: 100, label: '100 per page' }
    ];
  }

  /**
   * Validate and sanitize page size
   */
  validatePageSize(pageSize: number): number {
    const validSizes = [10, 20, 50, 100];
    if (validSizes.includes(pageSize)) {
      return pageSize;
    }
    return 20; // Default page size
  }

  /**
   * Generate URL for specific page
   */
  generatePageUrl(baseUrl: string, page: number, searchParams?: URLSearchParams): string {
    const params = new URLSearchParams(searchParams);
    
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  /**
   * Generate pagination metadata for SEO
   */
  generateSEOPagination(currentPage: number, totalPages: number, baseUrl: string, searchParams?: URLSearchParams) {
    const pagination: {
      prev?: string;
      next?: string;
      canonical: string;
    } = {
      canonical: this.generatePageUrl(baseUrl, currentPage, searchParams)
    };

    if (currentPage > 1) {
      pagination.prev = this.generatePageUrl(baseUrl, currentPage - 1, searchParams);
    }

    if (currentPage < totalPages) {
      pagination.next = this.generatePageUrl(baseUrl, currentPage + 1, searchParams);
    }

    return pagination;
  }

  /**
   * Calculate performance metrics for pagination
   */
  calculatePerformanceMetrics(totalCount: number, pageSize: number, currentPage: number) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const loadedItems = Math.min(currentPage * pageSize, totalCount);
    const loadedPercentage = totalCount > 0 ? (loadedItems / totalCount) * 100 : 0;

    return {
      totalPages,
      loadedItems,
      loadedPercentage: Math.round(loadedPercentage * 100) / 100,
      remainingItems: Math.max(0, totalCount - loadedItems),
      estimatedLoadTime: this.estimateLoadTime(pageSize)
    };
  }

  /**
   * Estimate load time based on page size (for UX feedback)
   */
  private estimateLoadTime(pageSize: number): number {
    // Simple estimation: ~10ms per item (adjust based on actual performance)
    return Math.max(100, pageSize * 10);
  }

  /**
   * Generate pagination breadcrumbs for accessibility
   */
  generateBreadcrumbs(currentPage: number, totalPages: number): Array<{
    page: number;
    label: string;
    isCurrent: boolean;
  }> {
    const breadcrumbs: Array<{
      page: number;
      label: string;
      isCurrent: boolean;
    }> = [];

    const pageNumbers = this.generatePageNumbers(currentPage, totalPages);

    pageNumbers.forEach((pageNum) => {
      if (pageNum !== 'ellipsis') {
        breadcrumbs.push({
          page: pageNum,
          label: `Page ${pageNum}`,
          isCurrent: pageNum === currentPage
        });
      }
    });

    return breadcrumbs;
  }
}

// Export singleton instance
export const paginationService = PaginationService.getInstance();
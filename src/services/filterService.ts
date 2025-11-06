import { SearchParams, FilterState } from '../types';
import { sanitizeString, sanitizeNumber } from '../lib/validations';

/**
 * Filter service for managing search filters and URL state
 * Handles filter state transformations, URL encoding/decoding, and filter utilities
 */
export class FilterService {
  private static instance: FilterService;

  public static getInstance(): FilterService {
    if (!FilterService.instance) {
      FilterService.instance = new FilterService();
    }
    return FilterService.instance;
  }

  /**
   * Convert URL search parameters to FilterState
   */
  urlParamsToFilterState(searchParams: Record<string, string | string[] | undefined>): FilterState {
    const getFirstValue = (value: string | string[] | undefined): string => {
      if (Array.isArray(value)) {
        return value[0] || '';
      }
      return value || '';
    };

    const query = sanitizeString(getFirstValue(searchParams.q), 200);
    const category = sanitizeString(getFirstValue(searchParams.category), 100);
    const location = sanitizeString(getFirstValue(searchParams.location), 100);

    // Parse price range
    let minPrice = 0;
    let maxPrice = 0;

    try {
      const minParam = getFirstValue(searchParams.min);
      const maxParam = getFirstValue(searchParams.max);
      
      if (minParam) {
        minPrice = sanitizeNumber(parseFloat(minParam), 0, 1000000);
      }
      if (maxParam) {
        maxPrice = sanitizeNumber(parseFloat(maxParam), 0, 1000000);
      }
    } catch (error) {
      // Invalid price values, use defaults
      minPrice = 0;
      maxPrice = 0;
    }

    return {
      query,
      category,
      location,
      priceRange: {
        min: minPrice,
        max: maxPrice
      }
    };
  }

  /**
   * Convert FilterState to URL search parameters
   */
  filterStateToUrlParams(filters: FilterState): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.query.trim()) {
      params.q = filters.query.trim();
    }

    if (filters.category.trim()) {
      params.category = filters.category.trim();
    }

    if (filters.location.trim()) {
      params.location = filters.location.trim();
    }

    if (filters.priceRange.min > 0) {
      params.min = filters.priceRange.min.toString();
    }

    if (filters.priceRange.max > 0) {
      params.max = filters.priceRange.max.toString();
    }

    return params;
  }

  /**
   * Convert FilterState to SearchParams for API calls
   */
  filterStateToSearchParams(filters: FilterState, page: number = 1, limit: number = 20): SearchParams {
    return {
      q: filters.query.trim() || undefined,
      category: filters.category.trim() || undefined,
      location: filters.location.trim() || undefined,
      min: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
      max: filters.priceRange.max > 0 ? filters.priceRange.max : undefined,
      page,
      limit
    };
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(filters: FilterState): boolean {
    return !!(
      filters.query.trim() ||
      filters.category.trim() ||
      filters.location.trim() ||
      filters.priceRange.min > 0 ||
      filters.priceRange.max > 0
    );
  }

  /**
   * Get count of active filters
   */
  getActiveFilterCount(filters: FilterState): number {
    let count = 0;

    if (filters.query.trim()) count++;
    if (filters.category.trim()) count++;
    if (filters.location.trim()) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max > 0) count++;

    return count;
  }

  /**
   * Clear all filters
   */
  clearAllFilters(): FilterState {
    return {
      query: '',
      category: '',
      location: '',
      priceRange: {
        min: 0,
        max: 0
      }
    };
  }

  /**
   * Remove specific filter from FilterState
   */
  removeFilter(filters: FilterState, filterType: keyof FilterState): FilterState {
    const newFilters = { ...filters };

    switch (filterType) {
      case 'query':
        newFilters.query = '';
        break;
      case 'category':
        newFilters.category = '';
        break;
      case 'location':
        newFilters.location = '';
        break;
      case 'priceRange':
        newFilters.priceRange = { min: 0, max: 0 };
        break;
    }

    return newFilters;
  }

  /**
   * Update specific filter in FilterState
   */
  updateFilter(filters: FilterState, filterType: keyof FilterState, value: any): FilterState {
    const newFilters = { ...filters };

    switch (filterType) {
      case 'query':
        newFilters.query = sanitizeString(value, 200);
        break;
      case 'category':
        newFilters.category = sanitizeString(value, 100);
        break;
      case 'location':
        newFilters.location = sanitizeString(value, 100);
        break;
      case 'priceRange':
        if (value && typeof value === 'object') {
          newFilters.priceRange = {
            min: value.min !== undefined ? sanitizeNumber(value.min, 0, 1000000) : filters.priceRange.min,
            max: value.max !== undefined ? sanitizeNumber(value.max, 0, 1000000) : filters.priceRange.max
          };
        }
        break;
    }

    return newFilters;
  }

  /**
   * Validate price range
   */
  validatePriceRange(min: number, max: number): { isValid: boolean; error?: string } {
    if (min < 0 || max < 0) {
      return { isValid: false, error: 'Price values must be non-negative' };
    }

    if (min > max && max > 0) {
      return { isValid: false, error: 'Minimum price must be less than or equal to maximum price' };
    }

    if (min > 1000000 || max > 1000000) {
      return { isValid: false, error: 'Price values are too large' };
    }

    return { isValid: true };
  }

  /**
   * Format price for display
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  }

  /**
   * Format price range for display
   */
  formatPriceRange(min: number, max: number): string {
    if (min > 0 && max > 0) {
      return `${this.formatPrice(min)} - ${this.formatPrice(max)}`;
    } else if (min > 0) {
      return `${this.formatPrice(min)}+`;
    } else if (max > 0) {
      return `Up to ${this.formatPrice(max)}`;
    }
    return 'Any price';
  }

  /**
   * Generate filter description for SEO and accessibility
   */
  generateFilterDescription(filters: FilterState): string {
    const parts: string[] = [];

    if (filters.query.trim()) {
      parts.push(`"${filters.query.trim()}"`);
    }

    if (filters.category.trim()) {
      parts.push(`in ${filters.category}`);
    }

    if (filters.location.trim()) {
      parts.push(`near ${filters.location}`);
    }

    if (filters.priceRange.min > 0 || filters.priceRange.max > 0) {
      parts.push(`priced ${this.formatPriceRange(filters.priceRange.min, filters.priceRange.max)}`);
    }

    if (parts.length === 0) {
      return 'All products';
    }

    return `Products ${parts.join(' ')}`;
  }

  /**
   * Generate canonical URL for SEO
   */
  generateCanonicalUrl(baseUrl: string, filters: FilterState): string {
    const params = this.filterStateToUrlParams(filters);
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  /**
   * Check if two filter states are equal
   */
  areFiltersEqual(filters1: FilterState, filters2: FilterState): boolean {
    return (
      filters1.query === filters2.query &&
      filters1.category === filters2.category &&
      filters1.location === filters2.location &&
      filters1.priceRange.min === filters2.priceRange.min &&
      filters1.priceRange.max === filters2.priceRange.max
    );
  }

  /**
   * Create filter pills data for UI display
   */
  createFilterPills(filters: FilterState): Array<{
    type: keyof FilterState;
    label: string;
    value: string;
  }> {
    const pills: Array<{
      type: keyof FilterState;
      label: string;
      value: string;
    }> = [];

    if (filters.query.trim()) {
      pills.push({
        type: 'query',
        label: 'Search',
        value: filters.query.trim()
      });
    }

    if (filters.category.trim()) {
      pills.push({
        type: 'category',
        label: 'Category',
        value: filters.category.trim()
      });
    }

    if (filters.location.trim()) {
      pills.push({
        type: 'location',
        label: 'Location',
        value: filters.location.trim()
      });
    }

    if (filters.priceRange.min > 0 || filters.priceRange.max > 0) {
      pills.push({
        type: 'priceRange',
        label: 'Price',
        value: this.formatPriceRange(filters.priceRange.min, filters.priceRange.max)
      });
    }

    return pills;
  }
}

// Export singleton instance
export const filterService = FilterService.getInstance();
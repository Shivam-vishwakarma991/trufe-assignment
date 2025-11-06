// Export all services for easy importing
export { SearchService, searchService } from './searchService';
export { FilterService, filterService } from './filterService';
export { PaginationService, paginationService } from './paginationService';

// Re-export types for convenience
export type { SearchParams, SearchResult, Product, FilterState } from '../types';
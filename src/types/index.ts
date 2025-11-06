// Import and re-export types from validations for consistency
import type {
  SearchParams,
  Product,
  ProductInput,
  Category,
  Location,
  SearchResult,
  FilterState,
  ValidationErrorDetail,
  ApiError,
} from '../lib/validations';

export type {
  SearchParams,
  Product,
  ProductInput,
  Category,
  Location,
  SearchResult,
  FilterState,
  ValidationErrorDetail,
  ApiError,
};

// Additional UI-specific types

export interface ProductCardProps {
  product: Product;
  prefetchOnHover?: boolean;
}

export interface ProductGridProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface FilterSidebarProps {
  currentFilters: FilterState;
  categories: Category[];
  locations: Location[];
  priceRange: { min: number; max: number };
}

export interface MobileFilterButtonProps {
  filters: FilterState;
  onClick: () => void;
  className?: string;
}

export interface FilterPillsProps {
  filters: FilterState;
}

export interface SearchBarProps {
  query: string;
  placeholder?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

// Component state types
export interface CatalogPageState {
  products: Product[];
  totalCount: number;
  currentPage: number;
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

export interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export interface CatalogPageProps {
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

// Error handling types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface EmptyState {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
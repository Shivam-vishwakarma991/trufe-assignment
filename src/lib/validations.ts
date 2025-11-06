import { z } from 'zod'

// Search Parameters Validation Schema
export const SearchParamsSchema = z.object({
  q: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
  min: z.coerce.number().min(0).max(1000000).optional(),
  max: z.coerce.number().min(0).max(1000000).optional(),
  location: z.string().trim().max(100).optional(),
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
}).refine((data) => {
  if (data.min !== undefined && data.max !== undefined) {
    return data.min <= data.max;
  }
  return true;
}, {
  message: "Minimum price must be less than or equal to maximum price",
  path: ["min", "max"]
});

// Product Schema for database operations
export const ProductSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  price: z.number().min(0, "Price must be non-negative").max(1000000, "Price must be reasonable"),
  category: z.string().min(1, "Category is required").max(100, "Category name too long"),
  location: z.string().min(1, "Location is required").max(100, "Location name too long"),
  images: z.string().min(1, "Images data is required"), // JSON string for SQLite
  slug: z.string().min(1, "Slug is required").max(250, "Slug too long").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Product Input Schema for creating/updating products
export const ProductInputSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
});

// Category Schema
export const CategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Category name is required").max(100, "Category name too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

// Location Schema
export const LocationSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Location name is required").max(100, "Location name too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

// Search Result Schema
export const SearchResultSchema = z.object({
  products: z.array(ProductSchema),
  totalCount: z.number().min(0),
  facets: z.object({
    categories: z.array(z.object({
      name: z.string(),
      count: z.number().min(0),
    })),
    locations: z.array(z.object({
      name: z.string(),
      count: z.number().min(0),
    })),
    priceRange: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
    }),
  }),
});

// Filter State Schema
export const FilterStateSchema = z.object({
  query: z.string().default(""),
  category: z.string().default(""),
  priceRange: z.object({
    min: z.number().min(0).default(0),
    max: z.number().min(0).default(0),
  }),
  location: z.string().default(""),
});

// Error Schemas
export const ValidationErrorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: z.array(ValidationErrorDetailSchema).optional(),
});

// Type exports
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Location = z.infer<typeof LocationSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type FilterState = z.infer<typeof FilterStateSchema>;
export type ValidationErrorDetail = z.infer<typeof ValidationErrorDetailSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

// Validation Utilities

/**
 * Safely parse and validate search parameters
 * Returns validated params or throws validation error
 */
export function validateSearchParams(params: unknown): SearchParams {
  try {
    return SearchParamsSchema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Invalid search parameters", error.errors);
    }
    throw error;
  }
}

/**
 * Safely parse and validate product data
 * Returns validated product or throws validation error
 */
export function validateProduct(data: unknown): Product {
  try {
    return ProductSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Invalid product data", error.errors);
    }
    throw error;
  }
}

/**
 * Safely parse and validate product input data
 * Returns validated product input or throws validation error
 */
export function validateProductInput(data: unknown): ProductInput {
  try {
    return ProductInputSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Invalid product input data", error.errors);
    }
    throw error;
  }
}

/**
 * Sanitize string input by trimming whitespace and limiting length
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input.trim().slice(0, maxLength);
}

/**
 * Sanitize and validate numeric input
 */
export function sanitizeNumber(input: unknown, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
  const num = Number(input);
  if (isNaN(num)) {
    throw new Error("Invalid number format");
  }
  return Math.max(min, Math.min(max, num));
}

/**
 * Sanitize search query by removing potentially harmful characters
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially harmful characters
    .slice(0, 200); // Limit length
}

/**
 * Convert Zod errors to API error format
 */
export function formatValidationErrors(zodError: z.ZodError): ValidationErrorDetail[] {
  return zodError.errors.map(error => ({
    field: error.path.join('.'),
    message: error.message,
    code: error.code,
  }));
}

/**
 * Create standardized API error response
 */
export function createApiError(message: string, code: string, details?: ValidationErrorDetail[]): ApiError {
  return {
    message,
    code,
    details,
  };
}

// Custom Error Classes

export class ValidationError extends Error {
  public readonly code: string = 'VALIDATION_ERROR';
  public readonly details: ValidationErrorDetail[];

  constructor(message: string, zodErrors?: z.ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
    this.details = zodErrors ? formatValidationErrors({ errors: zodErrors } as z.ZodError) : [];
  }
}

export class SearchError extends Error {
  public readonly code: string = 'SEARCH_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'SearchError';
  }
}

export class DatabaseError extends Error {
  public readonly code: string = 'DATABASE_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Input Sanitization Middleware

/**
 * Sanitize all string values in an object recursively
 */
export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Safely decode URL component with fallback
 */
export function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.warn('Failed to decode URI component:', str, error);
    return str; // Return original string if decoding fails
  }
}

/**
 * Safely encode URL component for special characters
 */
export function safeEncodeURIComponent(str: string): string {
  try {
    return encodeURIComponent(str);
  } catch (error) {
    console.warn('Failed to encode URI component:', str, error);
    return str; // Return original string if encoding fails
  }
}

/**
 * Build catalog URL with search parameters and proper encoding
 */
export function buildCatalogUrl(baseUrl: string, searchParams: SearchParams, includePage: boolean = false): string {
  try {
    const url = new URL('/catalog', baseUrl);
    
    // Add parameters in a consistent order
    const orderedParams = ['q', 'category', 'location', 'min', 'max'] as const;
    
    orderedParams.forEach(key => {
      const value = searchParams[key];
      if (value !== undefined && value !== null && value !== '' && value !== 0) {
        if (key === 'q' || key === 'category' || key === 'location') {
          // Properly encode text parameters
          url.searchParams.set(key, safeEncodeURIComponent(String(value)));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });
    
    // Include page parameter if requested (for pagination)
    if (includePage && searchParams.page && searchParams.page > 1) {
      url.searchParams.set('page', String(searchParams.page));
    }
    
    return url.toString();
  } catch (error) {
    console.error('Failed to build catalog URL:', error);
    return `${baseUrl}/catalog`; // Fallback to base catalog URL
  }
}

/**
 * Build canonical URL for catalog pages with proper encoding (excludes pagination)
 */
export function buildCanonicalUrl(baseUrl: string, searchParams: SearchParams): string {
  return buildCatalogUrl(baseUrl, searchParams, false);
}

/**
 * Handle search redirect with proper error handling and logging
 */
export function handleSearchRedirect(searchParams: URLSearchParams | Record<string, string | string[]>): string {
  try {
    // Process and validate search parameters
    const validatedParams = processSearchParams(searchParams);
    
    // Build catalog URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const catalogUrl = buildCatalogUrl(baseUrl, validatedParams, true);
    
    // Extract path and search for redirect
    const url = new URL(catalogUrl);
    return url.pathname + url.search;
  } catch (error) {
    console.error('Search redirect error:', error);
    
    // Fallback to basic catalog page
    return '/catalog';
  }
}

/**
 * Validate and sanitize search parameters from URL with enhanced error handling
 */
export function processSearchParams(searchParams: URLSearchParams | Record<string, string | string[]>): SearchParams {
  const params: Record<string, unknown> = {};
  
  try {
    if (searchParams instanceof URLSearchParams) {
      // Convert URLSearchParams to array and iterate
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        try {
          // Decode URL-encoded values safely
          const decodedValue = safeDecodeURIComponent(value);
          params[key] = sanitizeString(decodedValue);
        } catch (error) {
          console.warn(`Failed to process parameter ${key}:`, error);
          // Skip malformed parameters
        }
      });
    } else {
      for (const [key, value] of Object.entries(searchParams)) {
        try {
          if (Array.isArray(value)) {
            const firstValue = value[0];
            if (firstValue) {
              const decodedValue = safeDecodeURIComponent(firstValue);
              params[key] = sanitizeString(decodedValue);
            }
          } else if (value) {
            const decodedValue = safeDecodeURIComponent(value);
            params[key] = sanitizeString(decodedValue);
          }
        } catch (error) {
          console.warn(`Failed to process parameter ${key}:`, error);
          // Skip malformed parameters
        }
      }
    }
    
    // Validate parameters with Zod schema
    const result = SearchParamsSchema.safeParse(params);
    
    if (result.success) {
      return result.data;
    } else {
      console.warn('Search parameter validation failed:', result.error.errors);
      
      // Try to salvage valid parameters
      const salvaged: Record<string, unknown> = {};
      
      // Keep valid string parameters
      if (params.q && typeof params.q === 'string') {
        salvaged.q = params.q;
      }
      if (params.category && typeof params.category === 'string') {
        salvaged.category = params.category;
      }
      if (params.location && typeof params.location === 'string') {
        salvaged.location = params.location;
      }
      
      // Keep valid numeric parameters
      if (params.min && !isNaN(Number(params.min))) {
        const min = Number(params.min);
        if (min >= 0 && min <= 1000000) {
          salvaged.min = min;
        }
      }
      if (params.max && !isNaN(Number(params.max))) {
        const max = Number(params.max);
        if (max >= 0 && max <= 1000000) {
          salvaged.max = max;
        }
      }
      if (params.page && !isNaN(Number(params.page))) {
        const page = Number(params.page);
        if (page >= 1 && page <= 1000) {
          salvaged.page = page;
        }
      }
      
      // Validate salvaged parameters
      const salvageResult = SearchParamsSchema.safeParse(salvaged);
      if (salvageResult.success) {
        return salvageResult.data;
      }
      
      // Final fallback
      return { page: 1, limit: 20 };
    }
  } catch (error) {
    console.error('Error processing search parameters:', error);
    
    // Graceful fallback: return default parameters
    return {
      page: 1,
      limit: 20,
    };
  }
}

// Type Guards

export function isValidSearchParams(data: unknown): data is SearchParams {
  return SearchParamsSchema.safeParse(data).success;
}

export function isValidProduct(data: unknown): data is Product {
  return ProductSchema.safeParse(data).success;
}

export function isValidCategory(data: unknown): data is Category {
  return CategorySchema.safeParse(data).success;
}

export function isValidLocation(data: unknown): data is Location {
  return LocationSchema.safeParse(data).success;
}
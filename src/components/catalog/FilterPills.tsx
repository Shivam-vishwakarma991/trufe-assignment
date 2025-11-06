'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterPillsProps } from '@/types';

/**
 * Filter pills component showing active filters with removal capability
 * Provides visual feedback for applied filters with individual and bulk removal options
 */
export default function FilterPills({ filters }: FilterPillsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPriceRange = (min: number, max: number) => {
    if (min > 0 && max > 0) {
      return `${formatPrice(min)} - ${formatPrice(max)}`;
    } else if (min > 0) {
      return `${formatPrice(min)}+`;
    } else if (max > 0) {
      return `Up to ${formatPrice(max)}`;
    }
    return '';
  };

  const removeFilter = (filterType: string) => {
    try {
      const params = new URLSearchParams(searchParams);
      
      switch (filterType) {
        case 'query':
          params.delete('q');
          break;
        case 'category':
          params.delete('category');
          break;
        case 'location':
          params.delete('location');
          break;
        case 'priceRange':
          params.delete('min');
          params.delete('max');
          break;
        default:
          console.warn(`Unknown filter type: ${filterType}`);
          return;
      }
      
      // Reset to first page when removing filters
      params.delete('page');
      
      const queryString = params.toString();
      const url = queryString ? `/catalog?${queryString}` : '/catalog';
      router.push(url);
    } catch (error) {
      console.error('Error removing filter:', error);
      // Fallback to clearing all filters if URL manipulation fails
      router.push('/catalog');
    }
  };

  const clearAllFilters = () => {
    try {
      router.push('/catalog');
    } catch (error) {
      console.error('Error clearing filters:', error);
      // Force page reload as fallback
      window.location.href = '/catalog';
    }
  };

  // Create filter pills data
  const pills = [];

  // Add search query pill
  if (filters.query && filters.query.trim()) {
    pills.push({
      type: 'query',
      label: 'Search',
      value: filters.query.trim(),
    });
  }

  // Add category pill
  if (filters.category && filters.category.trim()) {
    pills.push({
      type: 'category',
      label: 'Category',
      value: filters.category.trim(),
    });
  }

  // Add location pill
  if (filters.location && filters.location.trim()) {
    pills.push({
      type: 'location',
      label: 'Location',
      value: filters.location.trim(),
    });
  }

  // Add price range pill
  if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max > 0)) {
    const priceRangeText = formatPriceRange(filters.priceRange.min, filters.priceRange.max);
    if (priceRangeText) {
      pills.push({
        type: 'priceRange',
        label: 'Price',
        value: priceRangeText,
      });
    }
  }

  if (pills.length === 0) {
    return null;
  }

  return (
    <div 
      className="flex flex-wrap items-center gap-2"
      role="region"
      aria-label="Active search filters"
    >
      <span className="text-sm text-gray-600 mr-2" id="filter-pills-label">
        Active filters:
      </span>
      
      <div 
        className="flex flex-wrap items-center gap-2"
        role="list"
        aria-labelledby="filter-pills-label"
      >
        {pills.map((pill) => (
          <div
            key={pill.type}
            role="listitem"
            className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full transition-all duration-200 ease-in-out hover:bg-blue-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1"
          >
            <span className="font-medium mr-1" aria-hidden="true">
              {pill.label}:
            </span>
            <span className="mr-2">{pill.value}</span>
            <button
              onClick={() => removeFilter(pill.type)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  removeFilter(pill.type);
                }
              }}
              className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-150"
              aria-label={`Remove ${pill.label} filter: ${pill.value}`}
              title={`Remove ${pill.label} filter`}
              tabIndex={0}
            >
              <svg 
                className="h-3 w-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {pills.length > 1 && (
        <button
          onClick={clearAllFilters}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              clearAllFilters();
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-700 underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded px-1 transition-colors duration-150"
          aria-label={`Clear all ${pills.length} active filters`}
          title="Clear all filters"
          tabIndex={0}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
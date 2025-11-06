'use client';

import { FilterState } from '@/types';
import { filterService } from '@/services/filterService';

interface MobileFilterButtonProps {
  filters: FilterState;
  onClick: () => void;
  className?: string;
}

/**
 * Mobile filter button component that shows filter count and opens the mobile drawer
 */
export default function MobileFilterButton({ 
  filters, 
  onClick, 
  className = '' 
}: MobileFilterButtonProps) {
  const activeFilterCount = filterService.getActiveFilterCount(filters);
  const hasActiveFilters = filterService.hasActiveFilters(filters);

  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
        ${hasActiveFilters ? 'border-blue-300 bg-blue-50 text-blue-700' : ''}
        ${className}
      `}
      aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
    >
      {/* Filter Icon */}
      <svg
        className={`h-5 w-5 mr-2 ${hasActiveFilters ? 'text-blue-600' : 'text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
        />
      </svg>
      
      <span>Filters</span>
      
      {/* Active Filter Count Badge */}
      {activeFilterCount > 0 && (
        <span 
          className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full min-w-[1.25rem] h-5"
          aria-hidden="true"
        >
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}
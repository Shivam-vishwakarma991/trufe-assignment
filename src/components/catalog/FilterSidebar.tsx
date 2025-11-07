'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterSidebarProps } from '@/types';
import SearchBar from './SearchBar';

interface ExtendedFilterSidebarProps extends FilterSidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Filter sidebar component for desktop and mobile drawer
 * Supports sticky positioning on desktop and drawer functionality on mobile
 */
export default function FilterSidebar({ 
  currentFilters, 
  categories, 
  locations, 
  priceRange,
  isMobile = false,
  isOpen = true,
  onClose
}: ExtendedFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [localMinPrice, setLocalMinPrice] = useState(
    currentFilters.priceRange.min > 0 ? currentFilters.priceRange.min.toString() : ''
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    currentFilters.priceRange.max > 0 ? currentFilters.priceRange.max.toString() : ''
  );

  // Update local price state when currentFilters change
  useEffect(() => {
    setLocalMinPrice(
      currentFilters.priceRange.min > 0 ? currentFilters.priceRange.min.toString() : ''
    );
    setLocalMaxPrice(
      currentFilters.priceRange.max > 0 ? currentFilters.priceRange.max.toString() : ''
    );
  }, [currentFilters.priceRange]);

  // Handle escape key for mobile drawer
  useEffect(() => {
    if (isMobile && isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobile, isOpen, onClose]);

  const updateFilter = (key: string, value: string) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      
      // Sanitize the value
      const sanitizedValue = value.trim().slice(0, 100);
      
      if (sanitizedValue) {
        params.set(key, sanitizedValue);
      } else {
        params.delete(key);
      }
      
      // Reset to first page when changing filters
      params.delete('page');
      
      const queryString = params.toString();
      const url = queryString ? `/catalog?${queryString}` : '/catalog';
      
      router.push(url);
    } catch (error) {
      console.error('FilterSidebar: Error updating filter:', error);
    }
  };

  const updatePriceRange = () => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      
      const minPrice = parseFloat(localMinPrice);
      const maxPrice = parseFloat(localMaxPrice);
      
      // Validate price range
      if (!isNaN(minPrice) && minPrice >= 0 && minPrice <= 1000000) {
        params.set('min', minPrice.toString());
      } else {
        params.delete('min');
      }
      
      if (!isNaN(maxPrice) && maxPrice >= 0 && maxPrice <= 1000000) {
        params.set('max', maxPrice.toString());
      } else {
        params.delete('max');
      }
      
      // Validate that min <= max
      if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
        console.warn('Minimum price cannot be greater than maximum price');
        return;
      }
      
      // Reset to first page when changing filters
      params.delete('page');
      
      const queryString = params.toString();
      const url = queryString ? `/catalog?${queryString}` : '/catalog';
      
      router.push(url);
    } catch (error) {
      console.error('FilterSidebar: Error updating price range:', error);
    }
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePriceRange();
  };

  const clearPriceRange = () => {
    try {
      setLocalMinPrice('');
      setLocalMaxPrice('');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('min');
      params.delete('max');
      params.delete('page');
      
      const queryString = params.toString();
      const url = queryString ? `/catalog?${queryString}` : '/catalog';
      
      router.push(url);
    } catch (error) {
      console.error('FilterSidebar: Error clearing price range:', error);
    }
  };

  // Mobile drawer overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        
        {/* Mobile Drawer */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-drawer-title"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 id="filter-drawer-title" className="text-lg font-semibold text-gray-900">
                Filters
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                aria-label="Close filters"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent 
                currentFilters={currentFilters}
                categories={categories}
                locations={locations}
                priceRange={priceRange}
                localMinPrice={localMinPrice}
                localMaxPrice={localMaxPrice}
                setLocalMinPrice={setLocalMinPrice}
                setLocalMaxPrice={setLocalMaxPrice}
                updateFilter={updateFilter}
                handlePriceSubmit={handlePriceSubmit}
                clearPriceRange={clearPriceRange}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="sticky top-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
      <FilterContent 
        currentFilters={currentFilters}
        categories={categories}
        locations={locations}
        priceRange={priceRange}
        localMinPrice={localMinPrice}
        localMaxPrice={localMaxPrice}
        setLocalMinPrice={setLocalMinPrice}
        setLocalMaxPrice={setLocalMaxPrice}
        updateFilter={updateFilter}
        handlePriceSubmit={handlePriceSubmit}
        clearPriceRange={clearPriceRange}
        isMobile={false}
      />
    </div>
  );
}

/**
 * Filter content component - shared between desktop and mobile layouts
 */
function FilterContent({
  currentFilters,
  categories,
  locations,
  priceRange,
  localMinPrice,
  localMaxPrice,
  setLocalMinPrice,
  setLocalMaxPrice,
  updateFilter,
  handlePriceSubmit,
  clearPriceRange,
  isMobile
}: {
  currentFilters: FilterSidebarProps['currentFilters'];
  categories: FilterSidebarProps['categories'];
  locations: FilterSidebarProps['locations'];
  priceRange: FilterSidebarProps['priceRange'];
  localMinPrice: string;
  localMaxPrice: string;
  setLocalMinPrice: (value: string) => void;
  setLocalMaxPrice: (value: string) => void;
  updateFilter: (key: string, value: string) => void;
  handlePriceSubmit: (e: React.FormEvent) => void;
  clearPriceRange: () => void;
  isMobile: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Search Bar - Mobile Only */}
      {isMobile && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Search</h3>
          <SearchBar 
            query={currentFilters.query} 
            placeholder="Search products..."
          />
        </div>
      )}
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name={`category-${isMobile ? 'mobile' : 'desktop'}`}
              value=""
              checked={!currentFilters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name={`category-${isMobile ? 'mobile' : 'desktop'}`}
                value={category.name}
                checked={currentFilters.category === category.name}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Location</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name={`location-${isMobile ? 'mobile' : 'desktop'}`}
              value=""
              checked={!currentFilters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">All Locations</span>
          </label>
          {locations.map((location) => (
            <label key={location.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name={`location-${isMobile ? 'mobile' : 'desktop'}`}
                value={location.name}
                checked={currentFilters.location === location.name}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{location.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
          {(currentFilters.priceRange.min > 0 || currentFilters.priceRange.max > 0) && (
            <button
              onClick={clearPriceRange}
              className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              aria-label="Clear price range filter"
            >
              Clear
            </button>
          )}
        </div>
        
        {priceRange.min < priceRange.max && (
          <p className="text-xs text-gray-500 mb-3">
            Available range: ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
          </p>
        )}
        
        <form onSubmit={handlePriceSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor={`min-price-${isMobile ? 'mobile' : 'desktop'}`} className="sr-only">
                Minimum price
              </label>
              <input
                type="number"
                id={`min-price-${isMobile ? 'mobile' : 'desktop'}`}
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                min="0"
                step="0.01"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby={priceRange.min < priceRange.max ? `price-range-${isMobile ? 'mobile' : 'desktop'}` : undefined}
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`max-price-${isMobile ? 'mobile' : 'desktop'}`} className="sr-only">
                Maximum price
              </label>
              <input
                type="number"
                id={`max-price-${isMobile ? 'mobile' : 'desktop'}`}
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                min="0"
                step="0.01"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby={priceRange.min < priceRange.max ? `price-range-${isMobile ? 'mobile' : 'desktop'}` : undefined}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-sm py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!localMinPrice && !localMaxPrice}
          >
            Apply Price Filter
          </button>
        </form>
      </div>
    </div>
  );
}
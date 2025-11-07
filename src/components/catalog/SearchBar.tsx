'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBarProps } from '@/types';

/**
 * Search bar component with debounced search functionality
 */
export default function SearchBar({ query, placeholder = "Search products..." }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(query);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((newQuery: string) => {
    if (isSearching) {
      return; // Prevent multiple simultaneous searches
    }
    
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      
      // Sanitize the query
      const sanitizedQuery = newQuery.trim().slice(0, 200);
      
      if (sanitizedQuery) {
        params.set('q', sanitizedQuery);
      } else {
        params.delete('q');
      }
      
      // Reset to first page when searching
      params.delete('page');
      
      const queryString = params.toString();
      const url = queryString ? `/catalog?${queryString}` : '/catalog';
      
      router.push(url);
    } catch (error) {
      console.error('SearchBar: Error during search:', error);
    } finally {
      // Reset searching state after a short delay
      setTimeout(() => setIsSearching(false), 500);
    }
  }, [router, searchParams, isSearching]);

  // Debounce search input with improved logic
  useEffect(() => {
    // Don't trigger search if the query hasn't actually changed
    if (searchQuery === query) {
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        handleSearch(searchQuery);
      } catch (error) {
        console.error('Search debounce error:', error);
      }
    }, 500); // Increased debounce time to reduce rapid calls

    return () => clearTimeout(timeoutId);
  }, [searchQuery, query, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    handleSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          aria-label="Search products"
        />

        {/* Clear Button and Loading Indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isSearching && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
          )}
          
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 focus:ring-2 focus:ring-blue-500 rounded p-1"
              aria-label="Clear search"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
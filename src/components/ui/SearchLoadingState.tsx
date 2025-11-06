interface SearchLoadingStateProps {
  searchQuery?: string;
  filterCount?: number;
}

/**
 * Specialized loading component for search operations with context
 */
export default function SearchLoadingState({ 
  searchQuery, 
  filterCount = 0 
}: SearchLoadingStateProps) {
  const getMessage = () => {
    if (searchQuery && filterCount > 0) {
      return `Searching for "${searchQuery}" with ${filterCount} filter${filterCount > 1 ? 's' : ''}...`;
    }
    
    if (searchQuery) {
      return `Searching for "${searchQuery}"...`;
    }
    
    if (filterCount > 0) {
      return `Applying ${filterCount} filter${filterCount > 1 ? 's' : ''}...`;
    }
    
    return 'Loading products...';
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex flex-col items-center max-w-md text-center">
        {/* Loading spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        
        {/* Dynamic message */}
        <p className="text-gray-600 mb-2" aria-live="polite">
          {getMessage()}
        </p>
        
        {/* Additional context */}
        <p className="text-sm text-gray-500">
          This should only take a moment
        </p>
      </div>
    </div>
  );
}
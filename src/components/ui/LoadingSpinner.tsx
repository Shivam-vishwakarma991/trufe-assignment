interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Loading spinner component for search operations
 */
export default function LoadingSpinner({ 
  message = "Loading products...", 
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerClasses = {
    sm: 'py-6',
    md: 'py-12',
    lg: 'py-16'
  };

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className="flex flex-col items-center">
        <div 
          className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
          role="status"
          aria-label="Loading"
        />
        {message && (
          <p className="mt-4 text-sm text-gray-600" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
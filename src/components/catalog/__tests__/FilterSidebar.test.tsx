import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar from '../FilterSidebar';
import { FilterState, Category, Location } from '@/types';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
  (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  mockPush.mockClear();
});

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Clothing', slug: 'clothing' },
];

const mockLocations: Location[] = [
  { id: '1', name: 'New York', slug: 'new-york' },
  { id: '2', name: 'Los Angeles', slug: 'los-angeles' },
];

const mockCurrentFilters: FilterState = {
  query: '',
  category: '',
  location: '',
  priceRange: { min: 0, max: 0 },
};

const mockPriceRange = { min: 10, max: 1000 };

describe('FilterSidebar', () => {
  it('renders desktop sidebar correctly', () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={false}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
  });

  it('renders mobile drawer when open', () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={true}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Close filters')).toBeInTheDocument();
  });

  it('does not render mobile drawer when closed', () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={true}
        isOpen={false}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles category filter selection', async () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={false}
      />
    );

    const electronicsRadio = screen.getByDisplayValue('Electronics');
    fireEvent.click(electronicsRadio);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/catalog?category=Electronics');
    });
  });

  it('handles location filter selection', async () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={false}
      />
    );

    const newYorkRadio = screen.getByDisplayValue('New York');
    fireEvent.click(newYorkRadio);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/catalog?location=New+York');
    });
  });

  it('handles price range submission', async () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={false}
      />
    );

    const minPriceInput = screen.getByPlaceholderText('Min');
    const maxPriceInput = screen.getByPlaceholderText('Max');
    const submitButton = screen.getByText('Apply Price Filter');

    fireEvent.change(minPriceInput, { target: { value: '100' } });
    fireEvent.change(maxPriceInput, { target: { value: '500' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/catalog?min=100&max=500');
    });
  });

  it('clears price range when clear button is clicked', async () => {
    const filtersWithPrice: FilterState = {
      ...mockCurrentFilters,
      priceRange: { min: 100, max: 500 },
    };

    render(
      <FilterSidebar
        currentFilters={filtersWithPrice}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={false}
      />
    );

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/catalog');
    });
  });

  it('calls onClose when escape key is pressed in mobile mode', () => {
    const mockOnClose = jest.fn();
    
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={true}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('includes search bar in mobile mode', () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={true}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('does not include search bar in desktop mode', () => {
    render(
      <FilterSidebar
        currentFilters={mockCurrentFilters}
        categories={mockCategories}
        locations={mockLocations}
        priceRange={mockPriceRange}
        isMobile={false}
      />
    );

    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });
});
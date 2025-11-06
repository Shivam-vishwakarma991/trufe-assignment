import { render, screen, fireEvent } from '@testing-library/react';
import MobileFilterButton from '../MobileFilterButton';
import { FilterState } from '@/types';

describe('MobileFilterButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with no active filters', () => {
    const filters: FilterState = {
      query: '',
      category: '',
      location: '',
      priceRange: { min: 0, max: 0 },
    };

    render(<MobileFilterButton filters={filters} onClick={mockOnClick} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Open filters')).toBeInTheDocument();
  });

  it('shows active filter count badge', () => {
    const filters: FilterState = {
      query: 'laptop',
      category: 'Electronics',
      location: '',
      priceRange: { min: 100, max: 500 },
    };

    render(<MobileFilterButton filters={filters} onClick={mockOnClick} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('Open filters (3 active)')).toBeInTheDocument();
  });

  it('applies active styles when filters are present', () => {
    const filters: FilterState = {
      query: 'laptop',
      category: '',
      location: '',
      priceRange: { min: 0, max: 0 },
    };

    render(<MobileFilterButton filters={filters} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-blue-300', 'bg-blue-50', 'text-blue-700');
  });

  it('calls onClick when clicked', () => {
    const filters: FilterState = {
      query: '',
      category: '',
      location: '',
      priceRange: { min: 0, max: 0 },
    };

    render(<MobileFilterButton filters={filters} onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const filters: FilterState = {
      query: '',
      category: '',
      location: '',
      priceRange: { min: 0, max: 0 },
    };

    render(
      <MobileFilterButton 
        filters={filters} 
        onClick={mockOnClick} 
        className="custom-class" 
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('counts price range as single filter', () => {
    const filters: FilterState = {
      query: '',
      category: '',
      location: '',
      priceRange: { min: 100, max: 500 },
    };

    render(<MobileFilterButton filters={filters} onClick={mockOnClick} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('counts only min price as single filter', () => {
    const filters: FilterState = {
      query: '',
      category: '',
      location: '',
      priceRange: { min: 100, max: 0 },
    };

    render(<MobileFilterButton filters={filters} onClick={mockOnClick} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
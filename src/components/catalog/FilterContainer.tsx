'use client';

import { useState } from 'react';
import { FilterSidebarProps } from '@/types';
import FilterSidebar from './FilterSidebar';
import MobileFilterButton from './MobileFilterButton';

/**
 * Container component that manages both desktop sidebar and mobile drawer filter functionality
 */
export default function FilterContainer(props: FilterSidebarProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const openMobileDrawer = () => setIsMobileDrawerOpen(true);
  const closeMobileDrawer = () => setIsMobileDrawerOpen(false);

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <FilterSidebar 
          {...props}
          isMobile={false}
          isOpen={true}
        />
      </div>

      {/* Mobile Filter Button - Hidden on desktop */}
      <div className="lg:hidden">
        <MobileFilterButton
          filters={props.currentFilters}
          onClick={openMobileDrawer}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Mobile Drawer - Only rendered when needed */}
      {isMobileDrawerOpen && (
        <FilterSidebar
          {...props}
          isMobile={true}
          isOpen={isMobileDrawerOpen}
          onClose={closeMobileDrawer}
        />
      )}
    </>
  );
}
import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { LAB_TEST_TYPES, EXPERIMENT_TYPES } from '@/types';

interface Props {
  /** Callback when search term changes */
  onSearch: (term: string) => void;
  /** Callback when filters are updated */
  onFilterChange: (filters: Filters) => void;
}

/**
 * Filter options for lab tests
 * All fields are optional and can be null to indicate no filter
 */
export interface Filters {
  /** Filter by schedule type */
  scheduleType?: 'oneTime' | 'recurring' | null;
  /** Filter by test type */
  testType?: string | null;
  /** Filter by experiment type */
  experimentType?: number | null;
}

/**
 * SearchBar component provides search and filtering functionality
 * Features:
 * - Text search with instant results
 * - Filter by schedule type (one-time/recurring)
 * - Filter by test type
 * - Filter by experiment type
 * - Sticky positioning at bottom of screen
 * - Filter state indicators
 */
export function SearchBar({ onSearch, onFilterChange }: Props) {
  // State for filter panel visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Current search term
  const [searchTerm, setSearchTerm] = useState('');
  // Active filters
  const [filters, setFilters] = useState<Filters>({});

  /**
   * Handles changes to the search input
   * Updates both local state and parent component
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  /**
   * Updates filter state and notifies parent component
   * Merges new filters with existing ones
   */
  const handleFilterChange = (newFilters: Filters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  /**
   * Clears all active filters
   */
  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  // Check if any filters are currently active
  const hasActiveFilters = Object.values(filters).some(value => value !== null && value !== undefined);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4"
            />
          </div>

          {/* Filter Button and Panel */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 ${hasActiveFilters ? 'border-blue-600 text-blue-600' : ''}`}
            >
              <Filter size={20} />
              {/* Active filter indicator */}
              {hasActiveFilters && (
                <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              )}
            </Button>

            {/* Filter Panel */}
            {isFilterOpen && (
              <>
                {/* Backdrop for closing filter panel */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Schedule Type Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Schedule Type
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFilterChange({ scheduleType: 'oneTime' })}
                          className={filters.scheduleType === 'oneTime' ? 'border-blue-600 text-blue-600 bg-blue-50' : ''}
                        >
                          One Time
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFilterChange({ scheduleType: 'recurring' })}
                          className={filters.scheduleType === 'recurring' ? 'border-blue-600 text-blue-600 bg-blue-50' : ''}
                        >
                          Recurring
                        </Button>
                      </div>
                    </div>

                    {/* Test Type Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Test Type
                      </label>
                      <select
                        value={filters.testType || ''}
                        onChange={(e) => handleFilterChange({ testType: e.target.value || null })}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
                      >
                        <option value="">All Test Types</option>
                        {LAB_TEST_TYPES.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Experiment Type Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Experiment Type
                      </label>
                      <select
                        value={filters.experimentType || ''}
                        onChange={(e) => handleFilterChange({ experimentType: e.target.value ? Number(e.target.value) : null })}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
                      >
                        <option value="">All Experiments</option>
                        {EXPERIMENT_TYPES.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
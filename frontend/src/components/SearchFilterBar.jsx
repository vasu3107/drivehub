import React from 'react';
import { Search, Filter, RotateCcw, DollarSign, Tag } from 'lucide-react';

export const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onResetFilters,
  categories,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 shadow-xl border border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Query Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by make, model, or category (e.g. Porsche, 911)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 pl-11 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3 relative">
          <Tag className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900/90 text-slate-200 pl-10 pr-8 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-sm appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Inputs */}
        <div className="md:col-span-3 flex items-center space-x-2">
          <div className="relative flex-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-200 placeholder-slate-500 pl-8 pr-2 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>
          <span className="text-slate-600 font-bold">-</span>
          <div className="relative flex-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-200 placeholder-slate-500 pl-8 pr-2 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            onClick={onResetFilters}
            title="Reset Filters"
            className="w-full md:w-auto flex items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-medium"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Crop, CropCategory } from '../types';
import { useCart } from '../context/CartContext';
import {
  Filter,
  CheckCircle2,
  Calendar,
  MapPin,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Package,
  Sparkles,
  ArrowUpDown,
  Star
} from 'lucide-react';

interface MarketplaceProps {
  crops: Crop[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectCrop: (crop: Crop) => void;
  onNegotiateCrop: (crop: Crop) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  crops,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectCrop,
  onNegotiateCrop
}) => {
  const { addToCart } = useCart();
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'freshness'>('featured');

  // Filter and sort
  const filteredCrops = useMemo(() => {
    return crops.filter(crop => {
      // Category filter
      if (selectedCategory !== 'all' && crop.category !== selectedCategory) {
        return false;
      }
      // Organic filter
      if (onlyOrganic && !crop.organic_certified) {
        return false;
      }
      // Max price
      if (crop.price_per_kg > maxPrice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = crop.crop_name.toLowerCase().includes(query);
        const matchFarmer = crop.farmer_name.toLowerCase().includes(query);
        const matchFarm = crop.farm_name.toLowerCase().includes(query);
        const matchLocation = crop.location.toLowerCase().includes(query);
        const matchCategory = crop.category.toLowerCase().includes(query);
        if (!matchName && !matchFarmer && !matchFarm && !matchLocation && !matchCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price_per_kg - b.price_per_kg;
      if (sortBy === 'price_high') return b.price_per_kg - a.price_per_kg;
      if (sortBy === 'freshness') {
        return new Date(b.harvest_date).getTime() - new Date(a.harvest_date).getTime();
      }
      return a.id - b.id;
    });
  }, [crops, selectedCategory, onlyOrganic, maxPrice, searchQuery, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header and Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">
            <span>Verified Fresh Harvests</span>
            <span aria-hidden="true">·</span>
            <span>Direct From Farmers</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Fresh Produce & Farm Grains
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Showing <span className="font-semibold text-stone-900 tabular-nums">{filteredCrops.length}</span> farm-direct listings with verified grower provenance.
          </p>
        </div>

        {/* Sort and Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-300 text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured / Default</option>
              <option value="freshness">Newest Harvest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <label className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-300 text-xs shadow-sm cursor-pointer hover:bg-stone-50 transition-colors">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={e => setOnlyOrganic(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 accent-emerald-600"
            />
            <span className="text-stone-700 font-medium">Certified Organic Only</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Refine Search
              </span>
              {(selectedCategory !== 'all' || onlyOrganic || maxPrice < 300 || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setOnlyOrganic(false);
                    setMaxPrice(300);
                    setSearchQuery('');
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Crop Category
              </label>
              <div className="space-y-1">
                {[
                  { id: 'all', name: 'All Categories' },
                  { id: 'Vegetables', name: 'Vegetables & Greens' },
                  { id: 'Grains', name: 'Grains, Wheat & Rice' },
                  { id: 'Fruits', name: 'Fresh Fruits' },
                  { id: 'Pulses', name: 'Pulses & Lentils' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    {selectedCategory === c.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-stone-700 uppercase tracking-wider">Max Price</span>
                <span className="font-bold text-emerald-700 tabular-nums">₹{maxPrice} / kg</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-stone-600 mt-1 tabular-nums">
                <span>₹20</span>
                <span>₹150</span>
                <span>₹300</span>
              </div>
            </div>

            {/* Direct Farmer Transparency Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3 text-xs text-emerald-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Zero Commission Policy
              </div>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                Farmers receive 100% of the listed price directly via verified escrow. Consumers save 20-30% compared to traditional retail middlemen.
              </p>
            </div>
          </div>
        </aside>

        {/* Crops Grid */}
        <main className="lg:col-span-9">
          {filteredCrops.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-900">No produce matches your filters</h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Try widening your price range or clearing category filters to view other fresh farm lots.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setOnlyOrganic(false);
                  setMaxPrice(300);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.map(crop => (
                <article
                  key={crop.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Visual Container (leads with 65-75% height ratio) */}
                  <div
                    onClick={() => onSelectCrop(crop)}
                    className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={crop.image_url}
                      alt={crop.crop_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={e => {
                        // Resilient fallback
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {/* Organic Tag - Clean unboxed text */}
                    {crop.organic_certified && (
                      <div className="absolute top-2.5 left-2.5 bg-emerald-900/90 backdrop-blur-xs text-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs">
                        Certified Organic
                      </div>
                    )}

                    {/* Stock level tag */}
                    <div className="absolute bottom-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded tabular-nums">
                      {crop.stock_quantity_kg} kg available
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Farmer & Location Metadata with Star Rating */}
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[90px]">{crop.location.split(',')[0]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate font-medium text-stone-700">{crop.farmer_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-800 shrink-0">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => onSelectCrop(crop)}
                        className="font-display text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                        title={crop.crop_name}
                      >
                        {crop.crop_name}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                        {crop.description}
                      </p>
                    </div>

                    {/* Pricing, Harvest Date & Action Buttons */}
                    <div className="pt-2 border-t border-stone-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xl font-bold text-stone-900 tabular-nums">
                            ₹{crop.price_per_kg}
                          </span>
                          <span className="text-xs text-stone-500 ml-1">/ kg</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 tabular-nums">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>Harvested {crop.harvest_date}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onNegotiateCrop(crop)}
                          className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors text-center cursor-pointer"
                        >
                          Wholesale Bid
                        </button>
                        <button
                          onClick={() => addToCart(crop)}
                          className="px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

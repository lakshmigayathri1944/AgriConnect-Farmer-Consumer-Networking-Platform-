import React, { useState } from 'react';
import { db } from '../db/sqlDatabase';
import { MarketPrice } from '../types';
import { TrendingUp, TrendingDown, Minus, Scale, MapPin, Search, ArrowUpRight } from 'lucide-react';

interface MandiRatesViewProps {
  onExploreCrops: () => void;
}

export const MandiRatesView: React.FC<MandiRatesViewProps> = ({ onExploreCrops }) => {
  const [rates, setRates] = useState<MarketPrice[]>(() => db.getMarketPrices());
  const [search, setSearch] = useState('');

  const filteredRates = rates.filter(r =>
    r.crop_name.toLowerCase().includes(search.toLowerCase()) ||
    r.mandi_name.toLowerCase().includes(search.toLowerCase()) ||
    r.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <span>Market Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>APMC Mandi Rates</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Wholesale Mandi Rates vs AgriConnect Direct Prices
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Official government benchmark data (stored in MySQL <code className="font-mono text-emerald-800">market_prices</code> table) helping farmers price fairly and consumers verify savings.
          </p>
        </div>

        <button
          onClick={onExploreCrops}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          Browse Verified Farm Harvests
        </button>
      </div>

      {/* Comparison Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Farmer Net Realization
          </div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums">
            +22% Higher
          </div>
          <p className="text-xs text-stone-600">
            Eliminating arthiyas (wholesale brokers) and commission agents passes value directly to the grower.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Consumer Grocery Savings
          </div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums">
            ~18% Lower
          </div>
          <p className="text-xs text-stone-600">
            Direct farmer supply bypasses supermarket distributor markups and multiple transit storage hops.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Harvest-to-Plate Freshness
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums">
            24 – 48 Hours
          </div>
          <p className="text-xs text-stone-600">
            Harvested in early dawn dew and dispatched in refrigerated direct farm logistics.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-300 max-w-md shadow-xs">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Filter Mandi benchmarks (e.g., Tomato, Wheat, Azadpur)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-xs text-stone-900 placeholder-stone-400 bg-transparent focus:outline-none"
        />
      </div>

      {/* Mandi Benchmark Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3 font-semibold">Commodity Crop</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Wholesale Mandi Rate</th>
                <th className="px-5 py-3 font-semibold">Min - Max Range</th>
                <th className="px-5 py-3 font-semibold">Market Trend</th>
                <th className="px-5 py-3 font-semibold">Reporting Mandi / State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredRates.map(m => (
                <tr key={m.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-stone-900">{m.crop_name}</td>
                  <td className="px-5 py-3.5 text-stone-600 font-medium">{m.category}</td>
                  <td className="px-5 py-3.5 tabular-nums font-bold text-emerald-800">
                    ₹{m.modal_price} / kg
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-stone-500">
                    ₹{m.min_price} – ₹{m.max_price}
                  </td>
                  <td className="px-5 py-3.5">
                    {m.trend === 'up' && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Upward
                      </span>
                    )}
                    {m.trend === 'down' && (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> Softening
                      </span>
                    )}
                    {m.trend === 'stable' && (
                      <span className="text-stone-500 font-medium flex items-center gap-1">
                        <Minus className="w-3.5 h-3.5" /> Stable
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{m.mandi_name}, {m.state}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

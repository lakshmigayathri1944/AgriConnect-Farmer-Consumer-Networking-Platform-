import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Database,
  Sprout,
  User as UserIcon,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Download,
  Github
} from 'lucide-react';
import { db } from '../db/sqlDatabase';

interface NavbarProps {
  activeTab: 'marketplace' | 'farmer' | 'mandi' | 'orders' | 'sql';
  setActiveTab: (tab: 'marketplace' | 'farmer' | 'mandi' | 'orders' | 'sql') => void;
  onOpenSqlConsole: () => void;
  onOpenAuthModal: () => void;
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSqlConsole,
  onOpenAuthModal,
  onOpenDownloadModal
}) => {
  const { currentUser, switchUserRole, isFarmer, isConsumer, isAdmin } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset MySQL database to initial demo state? This will repopulate fresh crops, reviews, and sample records.')) {
      db.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-white border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setActiveTab('marketplace')}
          className="flex items-center gap-2.5 text-left text-white group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-105">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Agri<span className="text-emerald-400">Connect</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (single-line, clean hover underlines) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'marketplace'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('farmer')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'farmer'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Farmer Hub
          </button>
          <button
            onClick={() => setActiveTab('mandi')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'mandi'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Mandi Benchmark
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'orders'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={onOpenSqlConsole}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
              activeTab === 'sql'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL Console</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Download & GitHub Button */}
          <button
            onClick={onOpenDownloadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
            title="Download full project ZIP & connect GitHub account"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Download App</span>
          </button>

          {/* Connected GitHub badge if linked */}
          {currentUser?.github_username && (
            <button
              onClick={onOpenDownloadModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-mono border border-stone-700 cursor-pointer"
              title="GitHub Connected"
            >
              <Github className="w-3.5 h-3.5 text-stone-300" />
              <span>@{currentUser.github_username}</span>
            </button>
          )}

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700/80 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
              title="Switch user perspective"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="truncate max-w-[100px]">
                {currentUser ? currentUser.full_name.split(' ')[0] : 'Guest'} ({currentUser?.role})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-stone-800 text-stone-400 font-medium">
                  Switch Active Role:
                </div>
                <button
                  onClick={() => {
                    switchUserRole('consumer');
                    setRoleMenuOpen(false);
                    setActiveTab('marketplace');
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center justify-between cursor-pointer ${
                    isConsumer ? 'text-emerald-400 font-semibold' : 'text-stone-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-stone-100">Gayathri Devi</div>
                    <div className="text-[11px] text-stone-400">Consumer / Direct Buyer</div>
                  </div>
                  {isConsumer && <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchUserRole('farmer');
                    setRoleMenuOpen(false);
                    setActiveTab('farmer');
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center justify-between cursor-pointer ${
                    isFarmer ? 'text-emerald-400 font-semibold' : 'text-stone-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-stone-100">Ramesh Patel</div>
                    <div className="text-[11px] text-stone-400">Farmer / GreenValley Org.</div>
                  </div>
                  {isFarmer && <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchUserRole('admin');
                    setRoleMenuOpen(false);
                    onOpenSqlConsole();
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center justify-between cursor-pointer ${
                    isAdmin ? 'text-emerald-400 font-semibold' : 'text-stone-300'
                  }`}
                >
                  <div>
                    <div className="font-medium text-stone-100">Priya Sharma</div>
                    <div className="text-[11px] text-stone-400">Database & Market Inspector</div>
                  </div>
                  {isAdmin && <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">Active</span>}
                </button>
                <div className="border-t border-stone-800 my-1 pt-1 px-3 space-y-1">
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      onOpenDownloadModal();
                    }}
                    className="w-full text-left text-emerald-400 hover:text-emerald-300 py-1 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download App (ZIP & SQL)</span>
                  </button>
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left text-stone-400 hover:text-white py-1 flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>New Account / Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      handleResetData();
                    }}
                    className="w-full text-left text-stone-500 hover:text-amber-400 py-1 flex items-center gap-1.5 cursor-pointer"
                    title="Reset to default database state"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Database Defaults</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer flex items-center justify-center shadow-sm"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

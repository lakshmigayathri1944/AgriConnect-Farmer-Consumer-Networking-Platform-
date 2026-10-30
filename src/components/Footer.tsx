import React from 'react';
import { Sprout, Database, ShieldCheck, Download, Github } from 'lucide-react';

interface FooterProps {
  onOpenSqlConsole: () => void;
  setActiveTab: (tab: 'marketplace' | 'farmer' | 'mandi' | 'orders' | 'sql') => void;
  onOpenDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSqlConsole,
  setActiveTab,
  onOpenDownloadModal
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                Agri<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Decentralized agricultural platform establishing direct links between local farm producers and conscious consumers, powered by structured relational MySQL databases.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Direct Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('farmer')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Farmer Producer Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('mandi')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  APMC Mandi Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Real-Time Order Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Database & Technology */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Technical Stack & Exports
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-mono">SQL & MySQL</span>
                <span>(Relational Schemas)</span>
              </li>
              <li>JavaScript ES2022 & TypeScript</li>
              <li>Bootstrap & Responsive HTML/CSS</li>
              <li>
                <button
                  onClick={onOpenSqlConsole}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Launch Live SQL Inspector</span>
                </button>
              </li>
              {onOpenDownloadModal && (
                <li>
                  <button
                    onClick={onOpenDownloadModal}
                    className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Complete Project (ZIP)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Trust & GitHub */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Developer & Repository
            </h4>
            {onOpenDownloadModal && (
              <button
                onClick={onOpenDownloadModal}
                className="w-full px-3 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Github className="w-4 h-4 text-emerald-400" />
                <span>Link GitHub Account</span>
              </button>
            )}
            <div className="flex items-start gap-2 text-stone-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Full escrow release only after buyer quality inspection</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © 2026 AgriConnect Platform. Built for direct farmer empowerment and transparent agricultural networks.
          </div>
          <div className="flex items-center gap-4">
            <span>MySQL 8.0 DDL</span>
            <span aria-hidden="true">·</span>
            <span>Zero Broker Commission</span>
            <span aria-hidden="true">·</span>
            <span>Protected Escrow Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

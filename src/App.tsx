/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { db } from './db/sqlDatabase';
import { Crop, Order, CropInquiry, Review } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { Marketplace } from './components/Marketplace';
import { FarmerDashboard } from './components/FarmerDashboard';
import { MandiRatesView } from './components/MandiRatesView';
import { OrdersView } from './components/OrdersView';
import { SqlConsoleModal } from './components/SqlConsoleModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CropDetailModal } from './components/CropDetailModal';
import { NegotiateModal } from './components/NegotiateModal';
import { ReviewModal } from './components/ReviewModal';
import { DownloadAndGithubModal } from './components/DownloadAndGithubModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

function MainApp() {
  const { currentUser, isFarmer } = useAuth();
  const { clearCart } = useCart();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'farmer' | 'mandi' | 'orders' | 'sql'>('marketplace');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<CropInquiry[]>([]);

  // Search and category state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [negotiateCrop, setNegotiateCrop] = useState<Crop | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewFarmerInfo, setReviewFarmerInfo] = useState<{ id: number; name: string } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshAllData = useCallback(() => {
    db.init();
    setCrops(db.getAllCrops());
    setOrders(db.getAllOrders());
    setInquiries(db.getAllInquiries());
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const handleOrderSuccess = (newOrder: Order) => {
    refreshAllData();
    showToast(`Order #${newOrder.order_number} confirmed! Escrow funds locked in vault.`);
  };

  const handleOpenSqlConsole = () => {
    setIsSqlModalOpen(true);
  };

  const handleOpenReviewForOrder = (order: Order) => {
    setReviewOrder(order);
    setReviewFarmerInfo({ id: order.farmer_id, name: order.farmer_name });
    setIsReviewModalOpen(true);
  };

  const handleOpenReviewForFarmer = (farmerId: number, farmerName: string) => {
    setReviewOrder(null);
    setReviewFarmerInfo({ id: farmerId, name: farmerName });
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = (review: Review) => {
    refreshAllData();
    showToast(`Thank you! Your ${review.rating}-star review for ${review.farmer_name} has been published.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-stone-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSqlConsole={handleOpenSqlConsole}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Content Router */}
      <div className="flex-1">
        {activeTab === 'marketplace' && (
          <>
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onExploreClick={() => {
                const el = document.getElementById('produce-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <div id="produce-catalog">
              <Marketplace
                crops={crops}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectCrop={crop => setSelectedCrop(crop)}
                onNegotiateCrop={crop => setNegotiateCrop(crop)}
              />
            </div>
          </>
        )}

        {activeTab === 'farmer' && (
          <FarmerDashboard
            crops={crops}
            orders={orders}
            inquiries={inquiries}
            onRefreshData={refreshAllData}
            onOpenSqlConsole={handleOpenSqlConsole}
          />
        )}

        {activeTab === 'mandi' && (
          <MandiRatesView
            onExploreCrops={() => setActiveTab('marketplace')}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
            onRefreshData={refreshAllData}
            onExploreProduce={() => setActiveTab('marketplace')}
            onOpenReview={handleOpenReviewForOrder}
          />
        )}

        {activeTab === 'sql' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Direct SQL Tab View */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
              <h2 className="font-display text-2xl font-bold text-stone-900">
                SQL Database Management & Console
              </h2>
              <p className="text-xs text-stone-600 max-w-lg mx-auto">
                Interact directly with tables <code className="font-mono text-emerald-800">users</code>, <code className="font-mono text-emerald-800">farmers</code>, <code className="font-mono text-emerald-800">crops</code>, <code className="font-mono text-emerald-800">orders</code>, <code className="font-mono text-emerald-800">reviews</code>, and <code className="font-mono text-emerald-800">payments</code> using real MySQL syntax.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsSqlModalOpen(true)}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Launch Fullscreen SQL Inspector & Query Terminal
                </button>
                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Download Source Code (ZIP) & Connect GitHub
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => setIsCheckoutModalOpen(true)} />

      {/* Checkout & Escrow Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Crop Detail Modal */}
      <CropDetailModal
        crop={selectedCrop}
        onClose={() => setSelectedCrop(null)}
        onOpenNegotiate={crop => {
          setSelectedCrop(null);
          setNegotiateCrop(crop);
        }}
        onOpenReview={(fId, fName) => handleOpenReviewForFarmer(fId, fName)}
      />

      {/* Wholesale Negotiation / Bid Modal */}
      <NegotiateModal
        crop={negotiateCrop}
        isOpen={Boolean(negotiateCrop)}
        onClose={() => setNegotiateCrop(null)}
        onSuccess={() => {
          refreshAllData();
          showToast('Wholesale bid recorded in MySQL database!');
        }}
      />

      {/* Review Modal */}
      <ReviewModal
        order={reviewOrder}
        farmerId={reviewFarmerInfo?.id}
        farmerName={reviewFarmerInfo?.name}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />

      {/* Download and GitHub Integration Modal */}
      <DownloadAndGithubModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Interactive SQL Console Modal */}
      <SqlConsoleModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        onDataModified={refreshAllData}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          refreshAllData();
          showToast(`Welcome! Logged in to AgriConnect.`);
        }}
      />

      {/* Footer */}
      <Footer
        onOpenSqlConsole={handleOpenSqlConsole}
        setActiveTab={setActiveTab}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

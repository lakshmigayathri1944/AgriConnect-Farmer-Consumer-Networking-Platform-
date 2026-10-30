import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../db/sqlDatabase';
import { Order, PaymentMethod, PaymentRecord } from '../types';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Printer,
  X
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { currentUser } = useAuth();
  const { items, clearCart, subtotalAmount, deliveryFee, grandTotal } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [shippingAddress, setShippingAddress] = useState(
    currentUser?.address
      ? `${currentUser.address}, ${currentUser.city}, ${currentUser.state} - ${currentUser.pincode}`
      : '402 Sunrise Heights, Indiranagar, Bengaluru, Karnataka - 560038'
  );
  const [recipientName, setRecipientName] = useState(currentUser?.full_name || 'Gayathri Devi');
  const [recipientPhone, setRecipientPhone] = useState(currentUser?.phone || '+91 99887 76655');

  // UPI state
  const [upiVpa, setUpiVpa] = useState('gayathri@okhdfcbank');

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 8920 1194 3829');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('834');
  const [cardName, setCardName] = useState(recipientName);

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || items.length === 0) return;

    setIsProcessing(true);
    setProcessingStage('Initiating secure encrypted session with AgriConnect Escrow Gateway...');

    setTimeout(() => {
      setProcessingStage('Validating farm crop reservations and holding funds in escrow vault...');
      setTimeout(() => {
        setProcessingStage('Payment Authorized · Writing structured order rows into MySQL database...');
        setTimeout(() => {
          // Identify primary farmer for this batch
          const primaryFarmerId = items[0].crop.farmer_id;

          // Call SQL DB transaction method
          const result = db.createOrder(
            currentUser,
            primaryFarmerId,
            items,
            paymentMethod,
            shippingAddress
          );

          // Trigger Confetti!
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });

          setCompletedOrder(result.order);
          setPaymentReceipt(result.payment);
          clearCart();
          setIsProcessing(false);
          onOrderSuccess(result.order);
        }, 600);
      }, 700);
    }, 600);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-stone-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
        {!completedOrder ? (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">
                  Direct Farm Checkout & Escrow Payment
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Secure checkout directly funding the farmer with escrow protection.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
                <h3 className="font-display text-base font-bold text-stone-900">
                  Processing Escrow Transaction
                </h3>
                <p className="text-xs text-stone-600 font-medium max-w-md animate-pulse">
                  {processingStage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-6 text-xs">
                {/* Delivery Information */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="font-semibold text-stone-900 text-xs flex items-center justify-between">
                    <span>1. Direct Delivery Destination</span>
                    <span className="text-[11px] text-emerald-700 font-medium">Refrigerated Transit</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={e => setRecipientName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Contact Phone</label>
                      <input
                        type="text"
                        required
                        value={recipientPhone}
                        onChange={e => setRecipientPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Delivery Address & Postal Code</label>
                    <textarea
                      rows={2}
                      required
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Gateway Options */}
                <div className="space-y-3">
                  <label className="block font-semibold text-stone-900">
                    2. Select Payment Method (Escrow Protected)
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      <span>Instant UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <span>Debit / Credit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'netbanking'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      <span>Net Banking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>

                  {/* Payment Details Form */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                    {paymentMethod === 'upi' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-800">UPI Virtual Payment Address (VPA)</span>
                          <span className="text-[11px] text-stone-500">Google Pay · PhonePe · Paytm · BHIM</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={upiVpa}
                          onChange={e => setUpiVpa(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                        />
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Simulated sandbox: instant verification with auto-clearing token</span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-stone-600 font-medium mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-600 font-medium mb-1">Expiry Date</label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-600 font-medium mb-1">CVV Security Code</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-2">
                        <label className="block text-stone-600 font-medium">Select Retail Bank</label>
                        <select
                          value={selectedBank}
                          onChange={e => setSelectedBank(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-medium text-xs"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                        </select>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="text-stone-700 leading-relaxed text-xs">
                        <p className="font-semibold text-stone-900">Escrow Cash On Delivery Guarantee</p>
                        <p className="text-stone-500 text-[11px] mt-1">
                          Inspect crop freshness upon farm courier arrival. Pay directly in cash or scan QR only after physical inspection.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Ledger Breakdown */}
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 text-xs">Total Payable (with escrow guarantee):</span>
                    <div className="text-xl font-bold text-stone-900 tabular-nums">
                      ₹{grandTotal}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Pay ₹{grandTotal}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Order Confirmation / Receipt View */
          <div className="space-y-6">
            <div className="text-center space-y-2 pb-4 border-b border-stone-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-stone-900">
                Payment Authorized & Order Confirmed!
              </h3>
              <p className="text-xs text-stone-600">
                Invoice Reference: <strong className="font-mono text-stone-900">{completedOrder.order_number}</strong>
              </p>
              <div className="inline-block bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-3 py-1 rounded-full border border-emerald-200">
                Funds safely locked in AgriConnect Escrow Vault
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Transaction ID:</span>
                <span className="font-mono text-stone-800 font-semibold">{paymentReceipt?.transaction_ref}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Payment Channel:</span>
                <span className="uppercase font-semibold text-stone-800">{completedOrder.payment_method}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Direct Farmer:</span>
                <span className="font-semibold text-stone-800">{completedOrder.farmer_name}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Shipping Destination:</span>
                <span className="font-medium text-stone-800 truncate max-w-[260px] text-right">
                  {completedOrder.shipping_address}
                </span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700 text-sm tabular-nums">₹{completedOrder.total_amount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Tax Invoice</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Track Live Delivery Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

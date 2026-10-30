import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, Sprout, ShoppingCart, Lock, Mail, User, Phone, MapPin } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState<UserRole>('consumer');

  // Form states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [address, setAddress] = useState('Flat 102, Green Park Avenue');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411001');

  // Farmer extra
  const [farmName, setFarmName] = useState('Ananda Organic Acres');
  const [farmLocation, setFarmLocation] = useState('Saswad Valley, Pune');
  const [totalAcres, setTotalAcres] = useState(10);
  const [organicCert, setOrganicCert] = useState(true);

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginMode) {
      const ok = login(email);
      if (ok) {
        onSuccess();
        onClose();
      } else {
        setError('No account found with this email. Please try a registered demo email or create an account.');
      }
    } else {
      if (!fullName.trim() || !email.trim()) {
        setError('Please fill out all required fields.');
        return;
      }

      register(
        {
          email: email.trim().toLowerCase(),
          full_name: fullName.trim(),
          role,
          phone,
          address,
          city,
          state,
          pincode
        },
        role === 'farmer'
          ? {
              farm_name: farmName,
              farm_location: farmLocation,
              total_acres: totalAcres,
              organic_certified: organicCert,
              phone
            }
          : undefined
      );

      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-stone-200 max-w-md w-full p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-stone-900">
            {isLoginMode ? 'Sign In to AgriConnect' : 'Join AgriConnect Platform'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isLoginMode
              ? 'Access your orders, farmer dashboard, or SQL registry'
              : 'Direct farmer-to-consumer trading with zero intermediaries'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoginMode && (
            <div>
              <label className="block text-stone-700 font-semibold mb-1.5">
                I want to register as a:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('consumer')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    role === 'consumer'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Consumer / Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    role === 'farmer'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>Farmer / Producer</span>
                </button>
              </div>
            </div>
          )}

          {!isLoginMode && (
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Anand Kulkarni"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. user@agriconnect.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {!isLoginMode && role === 'farmer' && (
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-3">
              <span className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider block">
                Farmer & Farm Profile
              </span>
              <div>
                <label className="block text-stone-600 mb-1">Farm / Cooperative Name</label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={e => setFarmName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 mb-1">Location / Village</label>
                  <input
                    type="text"
                    required
                    value={farmLocation}
                    onChange={e => setFarmLocation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Land (Acres)</label>
                  <input
                    type="number"
                    value={totalAcres}
                    onChange={e => setTotalAcres(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg tabular-nums"
                  />
                </div>
              </div>
            </div>
          )}

          {!isLoginMode && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-sm mt-2"
          >
            {isLoginMode ? 'Sign In' : 'Complete Registration & Save to DB'}
          </button>

          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              {isLoginMode
                ? "Don't have an account? Create one now"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

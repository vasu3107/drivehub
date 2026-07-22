import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehiclesAPI, inventoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingBag, Calendar, Tag, Shield } from 'lucide-react';

export function VehicleDetails({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await vehiclesAPI.getById(id);
        setVehicle(res.data);
      } catch (err) {
        console.error('Failed to load vehicle:', err);
        showToast('Vehicle not found.', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate, showToast]);

  const handlePurchase = async () => {
    if (!user) {
      showToast('Please log in to purchase.', 'error');
      navigate('/login');
      return;
    }
    setPurchasing(true);
    try {
      const res = await inventoryAPI.purchase(vehicle.id);
      showToast(res.data.message || `Successfully purchased ${vehicle.make} ${vehicle.model}!`);
      setVehicle({ ...vehicle, quantity: vehicle.quantity - 1 });
    } catch (err) {
      console.error('Purchase failed:', err);
      showToast(err.response?.data?.detail || 'Failed to complete purchase.', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 text-center animate-pulse space-y-4">
        <div className="bg-obsidian-800 h-96 rounded-2xl w-full" />
        <div className="bg-obsidian-800 h-8 w-1/2 rounded-lg mx-auto" />
      </div>
    );
  }

  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="w-full space-y-6">
      
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Showroom</span>
      </Link>

      {/* Main Details Panel */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Vehicle Image */}
        <div className="relative h-96 md:h-full bg-obsidian-950">
          <img
            src={vehicle.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-obsidian-950/90 text-amber-400 border border-amber-500/30">
              {vehicle.category}
            </span>
          </div>
        </div>

        {/* Specs & Actions */}
        <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{vehicle.year} Model Year</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white gold-gradient-text">
              {vehicle.make} {vehicle.model}
            </h1>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              {vehicle.description || "Designed for uncompromised luxury and thrill. Built with precision engineering and advanced automotive aesthetics."}
            </p>

            <div className="mt-8 pt-6 border-t border-obsidian-border grid grid-cols-2 gap-4">
              <div className="bg-obsidian-900/80 p-5 rounded-2xl border border-obsidian-border">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price</span>
                <span className="text-3xl font-black text-white gold-gradient-text">{formattedPrice}</span>
              </div>

              <div className="bg-obsidian-900/80 p-5 rounded-2xl border border-obsidian-border">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Stock Availability</span>
                <span className={`text-xl font-black ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Units Left`}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-3 pt-6 border-t border-obsidian-border">
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || purchasing}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${
                isOutOfStock
                  ? 'bg-obsidian-800 text-slate-500 cursor-not-allowed border border-obsidian-border'
                  : purchasing
                  ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                  : 'gold-button active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>
                {purchasing ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Purchase Vehicle Now'}
              </span>
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Manage in Admin Portal</span>
              </Link>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

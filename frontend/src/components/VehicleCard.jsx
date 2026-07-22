import React from 'react';
import { ShoppingBag, Edit3, RefreshCw, Trash2, Calendar, Tag, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VehicleCard = ({
  vehicle,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
  purchasingId,
}) => {
  const { user, isAdmin } = useAuth();
  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;
  const isPurchasing = purchasingId === vehicle.id;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 group">
      
      {/* Vehicle Image Header & Badges */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={vehicle.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-slate-900/80 backdrop-blur-md text-blue-400 border border-blue-500/30">
          {vehicle.category}
        </span>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-950/90 text-rose-400 border border-rose-500/40 shadow-lg">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-950/90 text-amber-300 border border-amber-500/40 shadow-lg animate-pulse">
              Only {vehicle.quantity} Left
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-lg">
              In Stock ({vehicle.quantity})
            </span>
          )}
        </div>

        {/* Year tag */}
        <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold">{vehicle.year}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
              {vehicle.make} <span className="text-slate-300 font-medium">{vehicle.model}</span>
            </h3>
          </div>
          
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed font-normal">
            {vehicle.description || "Premium automotive engineering with state-of-the-art performance."}
          </p>
        </div>

        {/* Price & Primary Action */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price</span>
              <span className="text-2xl font-black text-white tracking-tight">{formattedPrice}</span>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Quantity</span>
              <span className={`text-base font-extrabold ${isOutOfStock ? 'text-rose-400' : 'text-slate-200'}`}>
                {vehicle.quantity} units
              </span>
            </div>
          </div>

          {/* User Purchase Button - Mandated by kata PDF: disabled if quantity is zero */}
          <button
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${
              isOutOfStock
                ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                : isPurchasing
                ? 'bg-blue-700 text-white cursor-wait animate-pulse'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 active:scale-[0.98]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isPurchasing ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Purchase Vehicle'}
            </span>
          </button>

          {/* Admin Controls Toolbar (For Admin Users) */}
          {isAdmin && (
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between space-x-2">
              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-500/30 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restock</span>
              </button>

              <button
                onClick={() => onEdit(vehicle)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(vehicle)}
                className="p-1.5 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 rounded-lg text-xs border border-rose-500/30 transition-all"
                title="Delete Vehicle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Edit3, RefreshCw, Trash2, Calendar, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VehicleCard = ({
  vehicle,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
  purchasingId,
}) => {
  const { isAdmin } = useAuth();
  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;
  const isPurchasing = purchasingId === vehicle.id;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 group">
      
      {/* Header Image */}
      <div className="relative h-56 overflow-hidden bg-obsidian-950">
        <img
          src={vehicle.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-obsidian-950/90 backdrop-blur-md text-amber-400 border border-amber-500/30">
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

        {/* Year tag & Details link */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-obsidian-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-obsidian-border">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{vehicle.year}</span>
          </div>

          <Link
            to={`/vehicles/${vehicle.id}`}
            className="flex items-center space-x-1 text-xs font-semibold text-amber-400 bg-obsidian-950/80 hover:bg-amber-500/20 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/vehicles/${vehicle.id}`}>
            <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
              {vehicle.make} <span className="text-slate-300 font-medium">{vehicle.model}</span>
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {vehicle.description || "High-performance automotive engineering with luxury styling."}
          </p>
        </div>

        {/* Price & Primary Action */}
        <div className="mt-5 pt-4 border-t border-obsidian-border/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price</span>
              <span className="text-2xl font-black text-white tracking-tight gold-gradient-text">{formattedPrice}</span>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Quantity</span>
              <span className={`text-base font-extrabold ${isOutOfStock ? 'text-rose-400' : 'text-slate-200'}`}>
                {vehicle.quantity} units
              </span>
            </div>
          </div>

          {/* User Purchase Button: Disabled when quantity is 0 */}
          <button
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              isOutOfStock
                ? 'bg-obsidian-800 text-slate-500 cursor-not-allowed border border-obsidian-border'
                : isPurchasing
                ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                : 'gold-button active:scale-[0.98]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isPurchasing ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Purchase Vehicle'}
            </span>
          </button>

          {/* Admin Controls Toolbar (For Admin Users) */}
          {isAdmin && (
            <div className="mt-3 pt-3 border-t border-obsidian-border/60 flex items-center justify-between space-x-2">
              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/30 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restock</span>
              </button>

              <button
                onClick={() => onEdit(vehicle)}
                className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 rounded-lg text-xs font-semibold border border-obsidian-border transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
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

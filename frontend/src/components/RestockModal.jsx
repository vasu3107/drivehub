import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

export const RestockModal = ({ isOpen, onClose, onConfirm, vehicle, loading }) => {
  const [quantity, setQuantity] = useState(5);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(vehicle.id, parseInt(quantity, 10));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400">
            <RefreshCw className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">Restock Vehicle Inventory</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
            <p className="text-sm font-bold text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Stock: <span className="font-bold text-slate-200">{vehicle.quantity} units</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Add Quantity to Restock *
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 px-4 py-3 rounded-xl border border-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
            >
              {loading ? 'Restocking...' : `Restock (+${quantity} units)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

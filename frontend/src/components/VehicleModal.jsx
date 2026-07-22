import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Image, DollarSign, Layers } from 'lucide-react';

export const VehicleModal = ({ isOpen, onClose, onSave, vehicle, loading }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'Sports',
    price: '',
    quantity: 1,
    description: '',
    image_url: '',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || 2024,
        category: vehicle.category || 'Sports',
        price: vehicle.price || '',
        quantity: vehicle.quantity !== undefined ? vehicle.quantity : 1,
        description: vehicle.description || '',
        image_url: vehicle.image_url || '',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: 2024,
        category: 'Sports',
        price: '',
        quantity: 1,
        description: '',
        image_url: '',
      });
    }
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      year: parseInt(formData.year, 10),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            {vehicle ? <Edit className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-blue-400" />}
            <h2 className="text-lg font-bold text-white">
              {vehicle ? 'Update Vehicle Details' : 'Add New Vehicle to Inventory'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Make *</label>
              <input
                type="text"
                required
                placeholder="e.g. Porsche"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. 911 GT3"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year *</label>
              <input
                type="number"
                required
                min="1900"
                max="2027"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="Sports">Sports</option>
                <option value="Electric">Electric</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Price (USD $) *</label>
            <input
              type="number"
              required
              step="0.01"
              min="1"
              placeholder="e.g. 182900"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Brief description of car specifications and features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all"
            >
              {loading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

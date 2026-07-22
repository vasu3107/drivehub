import React, { useState, useEffect } from 'react';
import { vehiclesAPI, inventoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Plus, Edit3, Trash2, RefreshCw, Car, DollarSign, Layers, AlertTriangle } from 'lucide-react';
import { RestockModal } from '../components/RestockModal';

export function AdminDashboard({ showToast }) {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingVehicle, setEditingVehicle] = useState(null);
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

  const [restockModal, setRestockModal] = useState({ isOpen: false, vehicle: null });
  const [saving, setSaving] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehiclesAPI.getAll();
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to load admin inventory:', err);
      showToast('Failed to load admin inventory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      category: vehicle.category,
      price: vehicle.price,
      quantity: vehicle.quantity,
      description: vehicle.description || '',
      image_url: vehicle.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingVehicle(null);
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
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      year: parseInt(formData.year, 10),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      if (editingVehicle) {
        await vehiclesAPI.update(editingVehicle.id, payload);
        showToast(`Updated ${payload.make} ${payload.model} successfully!`);
      } else {
        await vehiclesAPI.create(payload);
        showToast(`Added new vehicle ${payload.make} ${payload.model} to database!`);
      }
      handleResetForm();
      fetchVehicles();
    } catch (err) {
      console.error('Save vehicle failed:', err);
      showToast(err.response?.data?.detail || 'Failed to save vehicle record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model} from inventory?`)) return;
    try {
      await vehiclesAPI.delete(vehicle.id);
      showToast(`Deleted ${vehicle.make} ${vehicle.model} successfully.`);
      fetchVehicles();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.response?.data?.detail || 'Failed to delete vehicle.', 'error');
    }
  };

  const handleRestockConfirm = async (vehicleId, quantity) => {
    try {
      const res = await inventoryAPI.restock(vehicleId, quantity);
      showToast(res.data.message || `Restocked ${quantity} units!`);
      setRestockModal({ isOpen: false, vehicle: null });
      fetchVehicles();
    } catch (err) {
      console.error('Restock failed:', err);
      showToast(err.response?.data?.detail || 'Failed to restock vehicle.', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center border border-rose-500/30 max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Admin Access Required</h2>
        <p className="text-xs text-slate-400">
          You must be logged in as an Admin to view and use the Admin Inventory Management Portal.
        </p>
      </div>
    );
  }

  const totalValue = vehicles.reduce((acc, v) => acc + v.price * v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity <= 0).length;

  return (
    <div className="space-y-8">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-panel p-6 rounded-3xl border border-amber-500/20">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Management Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white gold-gradient-text">
            Vehicle Inventory Control Center
          </h1>
        </div>

        {/* Analytics Summary */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-obsidian-900 border border-obsidian-border px-3.5 py-2 rounded-xl text-center">
            <span className="text-slate-400 block text-[10px]">Total Models</span>
            <span className="font-extrabold text-white text-sm">{vehicles.length}</span>
          </div>
          <div className="bg-obsidian-900 border border-obsidian-border px-3.5 py-2 rounded-xl text-center">
            <span className="text-slate-400 block text-[10px]">Total Value</span>
            <span className="font-extrabold text-amber-400 text-sm">
              ${(totalValue / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="bg-obsidian-900 border border-obsidian-border px-3.5 py-2 rounded-xl text-center">
            <span className="text-slate-400 block text-[10px]">Out of Stock</span>
            <span className="font-extrabold text-rose-400 text-sm">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form to Add / Edit Vehicles */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 sticky top-24">
            <div className="flex items-center space-x-2 pb-4 border-b border-obsidian-border mb-4">
              {editingVehicle ? (
                <Edit3 className="w-5 h-5 text-amber-400" />
              ) : (
                <Plus className="w-5 h-5 text-amber-400" />
              )}
              <h2 className="text-base font-extrabold text-white">
                {editingVehicle ? `Edit ${editingVehicle.make} ${editingVehicle.model}` : 'Add New Vehicle to Inventory'}
              </h2>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Porsche"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full bg-obsidian-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
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
                    className="w-full bg-obsidian-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max="2027"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-obsidian-950 text-slate-100 px-3 py-2.5 rounded-xl border border-obsidian-border text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-obsidian-950 text-slate-100 px-2 py-2.5 rounded-xl border border-obsidian-border text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Sports">Sports</option>
                    <option value="Electric">Electric</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-obsidian-950 text-slate-100 px-3 py-2.5 rounded-xl border border-obsidian-border text-xs focus:border-amber-500 focus:outline-none"
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
                  className="w-full bg-obsidian-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-obsidian-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Vehicle features and specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-obsidian-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-obsidian-border">
                {editingVehicle && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="gold-button w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  {saving ? 'Saving...' : editingVehicle ? 'Update Vehicle Record' : 'Add Vehicle to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Admin Inventory Management Table */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl overflow-hidden border border-obsidian-border shadow-2xl">
            <div className="p-5 border-b border-obsidian-border flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Live Inventory Records Table</h3>
              <span className="text-xs text-amber-400 font-semibold">{vehicles.length} Models Loaded</span>
            </div>

            {loading ? (
              <div className="p-8 text-center animate-pulse text-slate-400 text-xs">
                Loading admin inventory table...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-obsidian-950/80 border-b border-obsidian-border text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Vehicle</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-obsidian-border/60 text-xs">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-obsidian-900/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={v.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80"}
                              alt={v.make}
                              className="w-10 h-10 rounded-lg object-cover bg-obsidian-900 border border-obsidian-border shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white">{v.make} {v.model}</p>
                              <p className="text-[10px] text-slate-400">{v.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-obsidian-900 border border-amber-500/20 text-amber-400">
                            {v.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white">
                          ${v.price.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${v.quantity === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {v.quantity} units
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setRestockModal({ isOpen: true, vehicle: v })}
                              title="Restock Inventory"
                              className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 transition-all"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(v)}
                              title="Edit Details"
                              className="p-2 bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 rounded-lg border border-obsidian-border transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(v)}
                              title="Delete Record"
                              className="p-2 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 rounded-lg border border-rose-500/30 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      <RestockModal
        isOpen={restockModal.isOpen}
        vehicle={restockModal.vehicle}
        onClose={() => setRestockModal({ isOpen: false, vehicle: null })}
        onConfirm={handleRestockConfirm}
      />
    </div>
  );
}

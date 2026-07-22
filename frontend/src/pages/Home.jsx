import React, { useState, useEffect, useCallback } from 'react';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleModal } from '../components/VehicleModal';
import { RestockModal } from '../components/RestockModal';
import { useAuth } from '../context/AuthContext';
import { vehiclesAPI, inventoryAPI } from '../services/api';
import { Car, Zap, FilterX } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home({ showToast }) {
  const { user, token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [vehicleModal, setVehicleModal] = useState({ isOpen: false, vehicle: null });
  const [restockModal, setRestockModal] = useState({ isOpen: false, vehicle: null });
  const [modalLoading, setModalLoading] = useState(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      if (!token) {
        setVehicles([]);
        setLoading(false);
        return;
      }

      const params = {};
      if (searchTerm) params.q = searchTerm;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice) params.min_price = parseFloat(minPrice);
      if (maxPrice) params.max_price = parseFloat(maxPrice);

      const res = await vehiclesAPI.search(params);
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      showToast('Failed to load inventory. Please check backend status.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, selectedCategory, minPrice, maxPrice, showToast]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handlePurchase = async (vehicle) => {
    setPurchasingId(vehicle.id);
    try {
      const res = await inventoryAPI.purchase(vehicle.id);
      showToast(res.data.message || `Successfully purchased ${vehicle.year} ${vehicle.make} ${vehicle.model}!`);
      fetchVehicles();
    } catch (err) {
      console.error('Purchase failed:', err);
      showToast(err.response?.data?.detail || 'Failed to complete purchase.', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  const handleSaveVehicle = async (formData) => {
    setModalLoading(true);
    try {
      if (vehicleModal.vehicle) {
        await vehiclesAPI.update(vehicleModal.vehicle.id, formData);
        showToast(`Updated ${formData.make} ${formData.model} successfully!`);
      } else {
        await vehiclesAPI.create(formData);
        showToast(`Added ${formData.make} ${formData.model} to inventory!`);
      }
      setVehicleModal({ isOpen: false, vehicle: null });
      fetchVehicles();
    } catch (err) {
      console.error('Save vehicle failed:', err);
      showToast(err.response?.data?.detail || 'Failed to save vehicle.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleRestockConfirm = async (vehicleId, quantity) => {
    setModalLoading(true);
    try {
      const res = await inventoryAPI.restock(vehicleId, quantity);
      showToast(res.data.message || `Restocked ${quantity} units!`);
      setRestockModal({ isOpen: false, vehicle: null });
      fetchVehicles();
    } catch (err) {
      console.error('Restock failed:', err);
      showToast(err.response?.data?.detail || 'Failed to restock vehicle.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) return;
    try {
      await vehiclesAPI.delete(vehicle.id);
      showToast(`Deleted ${vehicle.make} ${vehicle.model} from database.`);
      fetchVehicles();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast(err.response?.data?.detail || 'Failed to delete vehicle.', 'error');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
  };

  const categories = ['Sports', 'Electric', 'SUV', 'Sedan', 'Luxury'];

  return (
    <div className="space-y-8">
      {/* Banner Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 glass-panel border border-amber-500/20 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Obsidian & Cyber Gold Luxury Showroom</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 gold-gradient-text">
            Exotic Car Dealership <br />
            <span className="text-white">Inventory Management</span>
          </h1>
          
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            A full-stack Car Dealership Inventory System built with Python (FastAPI), SQLite/SQLAlchemy, and React with Tailwind CSS.
          </p>

          {!user && (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="gold-button text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
              >
                Log In to Explore Inventory
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      {user && (
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onResetFilters={handleResetFilters}
          categories={categories}
        />
      )}

      {/* Unauthenticated State */}
      {!user ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-amber-500/20 max-w-xl mx-auto my-8">
          <Car className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-bounce-short" />
          <h3 className="text-xl font-bold text-white mb-2">Protected Showroom API</h3>
          <p className="text-sm text-slate-400 mb-6">
            Please log in or click one of the instant demo mode buttons in the header navbar to view vehicles, search inventory, and test purchase workflows.
          </p>
          <Link
            to="/login"
            className="gold-button text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl inline-block"
          >
            Sign In Now
          </Link>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-4 h-96 animate-pulse flex flex-col justify-between">
              <div className="bg-obsidian-800 rounded-xl h-48 w-full" />
              <div className="space-y-3 mt-4">
                <div className="bg-obsidian-800 h-6 w-3/4 rounded-lg" />
                <div className="bg-obsidian-800 h-4 w-1/2 rounded-lg" />
                <div className="bg-obsidian-800 h-10 w-full rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-obsidian-border my-8">
          <FilterX className="w-12 h-12 text-amber-500/50 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Vehicles Found</h3>
          <p className="text-xs text-slate-400 mb-4">
            Try adjusting your search criteria, category selection, or price range.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-obsidian-800 hover:bg-obsidian-700 text-xs font-semibold text-slate-200 rounded-xl border border-obsidian-border transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Showing <span className="text-amber-400 font-extrabold">{vehicles.length}</span> Available Vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
                onEdit={(v) => setVehicleModal({ isOpen: true, vehicle: v })}
                onRestock={(v) => setRestockModal({ isOpen: true, vehicle: v })}
                onDelete={handleDeleteVehicle}
                purchasingId={purchasingId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <VehicleModal
        isOpen={vehicleModal.isOpen}
        vehicle={vehicleModal.vehicle}
        onClose={() => setVehicleModal({ isOpen: false, vehicle: null })}
        onSave={handleSaveVehicle}
        loading={modalLoading}
      />

      <RestockModal
        isOpen={restockModal.isOpen}
        vehicle={restockModal.vehicle}
        onClose={() => setRestockModal({ isOpen: false, vehicle: null })}
        onConfirm={handleRestockConfirm}
        loading={modalLoading}
      />
    </div>
  );
}

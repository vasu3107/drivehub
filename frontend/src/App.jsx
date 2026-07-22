import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SearchFilterBar } from './components/SearchFilterBar';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { RestockModal } from './components/RestockModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { useAuth } from './context/AuthContext';
import { vehiclesAPI, inventoryAPI } from './services/api';
import { Car, ShieldCheck, Sparkles, FilterX, Layers, Zap } from 'lucide-react';

export function App() {
  const { user, token, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Modals state
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [vehicleModal, setVehicleModal] = useState({ isOpen: false, vehicle: null });
  const [restockModal, setRestockModal] = useState({ isOpen: false, vehicle: null });
  const [modalLoading, setModalLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

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
      showToast('Failed to load inventory. Please check backend API status.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Vehicle Purchase handler
  const handlePurchase = async (vehicle) => {
    if (!user) {
      setAuthModal({ isOpen: true, mode: 'login' });
      showToast('Please log in to purchase a vehicle.', 'error');
      return;
    }

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

  // Admin Add / Update vehicle
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
      showToast(err.response?.data?.detail || 'Failed to save vehicle details.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Admin Restock vehicle
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

  // Admin Delete vehicle
  const handleDeleteVehicle = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model} from inventory?`)) {
      return;
    }
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Header Navigation */}
      <Navbar
        onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenAddVehicleModal={() => setVehicleModal({ isOpen: true, vehicle: null })}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Showcase Header */}
        <div className="relative rounded-3xl overflow-hidden mb-10 p-8 sm:p-12 glass-panel border border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/60">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Full-Stack TDD Car Dealership System</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Find, Manage & Purchase <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Exotic Vehicles</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
              A high-performance Car Dealership Inventory System built with Python (FastAPI), SQLite/SQLAlchemy, and React (Tailwind CSS).
            </p>

            {!user && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                >
                  Log In to Access Inventory
                </button>
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

        {/* Unauthenticated View Banner */}
        {!user ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 my-10 max-w-xl mx-auto">
            <Car className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-bounce-short" />
            <h3 className="text-xl font-bold text-white mb-2">Protected Inventory API</h3>
            <p className="text-sm text-slate-400 mb-6">
              Please log in or click one of the quick demo buttons in the navbar to explore available vehicles and test the purchase workflow.
            </p>
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
            >
              Sign In to View Vehicles
            </button>
          </div>
        ) : loading ? (
          /* Loading Skeleton Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-2xl p-4 h-96 animate-pulse flex flex-col justify-between">
                <div className="bg-slate-800/60 rounded-xl h-48 w-full" />
                <div className="space-y-3 mt-4">
                  <div className="bg-slate-800/80 h-6 w-3/4 rounded-lg" />
                  <div className="bg-slate-800/60 h-4 w-1/2 rounded-lg" />
                  <div className="bg-slate-800/40 h-10 w-full rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 my-8">
            <FilterX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Vehicles Match Your Search</h3>
            <p className="text-xs text-slate-400 mb-4">
              Try adjusting your query, price range, or category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Vehicles Card Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Showing <span className="text-white">{vehicles.length}</span> Available Vehicles
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

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DriveHub — Car Dealership Inventory System (TDD Kata).</p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">FastAPI</span>
            <span>•</span>
            <span className="text-slate-400">React + Tailwind</span>
            <span>•</span>
            <span className="text-slate-400">Pytest Suite</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={(msg) => showToast(msg)}
      />

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

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}

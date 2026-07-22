import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { VehicleDetails } from './pages/VehicleDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';

export function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col font-sans">
          
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home showToast={showToast} />} />
              <Route path="/vehicles/:id" element={<VehicleDetails showToast={showToast} />} />
              <Route path="/admin" element={<AdminDashboard showToast={showToast} />} />
              <Route path="/login" element={<AuthPage mode="login" showToast={showToast} />} />
              <Route path="/register" element={<AuthPage mode="register" showToast={showToast} />} />
            </Routes>
          </main>

          <footer className="border-t border-obsidian-border bg-obsidian-950 py-8 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} DriveHub — Car Dealership Inventory System (TDD Kata).</p>
              <div className="flex items-center space-x-4">
                <span className="text-amber-400 font-semibold">FastAPI</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">React + Tailwind</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">Pytest Suite</span>
              </div>
            </div>
          </footer>

          <Toast toast={toast} onClose={() => setToast(null)} />

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { VehicleDetails } from './pages/VehicleDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-100 dark:bg-[#080a0f] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
            
            <Navbar />

            <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
              <Routes>
                <Route path="/" element={<Home showToast={showToast} />} />
                <Route path="/vehicles/:id" element={<VehicleDetails showToast={showToast} />} />
                <Route path="/admin" element={<AdminDashboard showToast={showToast} />} />
                <Route path="/login" element={<AuthPage mode="login" showToast={showToast} />} />
                <Route path="/register" element={<AuthPage mode="register" showToast={showToast} />} />
              </Routes>
            </main>

            <footer className="border-t border-slate-200 dark:border-obsidian-border bg-white dark:bg-obsidian-950 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors w-full">
              <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} DriveHub — Car Dealership Inventory System.</p>
                <p className="text-slate-400 text-[11px]">All rights reserved.</p>
              </div>
            </footer>

            <Toast toast={toast} onClose={() => setToast(null)} />

          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

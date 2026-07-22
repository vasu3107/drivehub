import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, ShieldCheck, UserCheck, LogOut, LogIn, PlusCircle, Sparkles, LayoutDashboard, Grid, Sun, Moon, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { user, isAdmin, logout, loginDemoAdmin, loginDemoCustomer } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleDemoAdmin = async () => {
    await loginDemoAdmin();
    navigate('/admin');
  };

  const handleDemoCustomer = async () => {
    await loginDemoCustomer();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e18] dark:bg-[#0b0e18] light:bg-white border-b-2 border-amber-500/30 shadow-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-2xl font-black gold-gradient-text tracking-tight">
                Drive<span className="text-amber-500">Hub</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-bold text-amber-600 dark:text-amber-400">
                Luxury Inventory OS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-200/80 dark:bg-obsidian-900/90 border border-slate-300 dark:border-obsidian-border rounded-xl p-1.5 text-xs font-semibold">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition-all ${
                location.pathname === '/' 
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Showroom</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition-all ${
                  location.pathname.startsWith('/admin') 
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Quick Demo Mode */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-200/80 dark:bg-obsidian-900/90 border border-slate-300 dark:border-obsidian-border rounded-full px-3 py-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300 pr-1">Demo Mode:</span>
            <button
              onClick={handleDemoAdmin}
              className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 transition-all text-xs"
            >
              ⚡ Admin Mode
            </button>
            <button
              onClick={handleDemoCustomer}
              className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30 transition-all text-xs"
            >
              🚗 Customer Mode
            </button>
          </div>

          {/* Right Action Menu & Theme Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle Selector */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center space-x-1.5 p-2.5 rounded-xl bg-slate-200/80 dark:bg-obsidian-900/90 border border-slate-300 dark:border-obsidian-border text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                title="Toggle Theme Mode"
              >
                {theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : (
                  <Laptop className="w-4 h-4 text-blue-400" />
                )}
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 glass-panel rounded-xl shadow-2xl border border-slate-300 dark:border-obsidian-border p-1 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => { setTheme('light'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      theme === 'light' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    onClick={() => { setTheme('dark'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      theme === 'dark' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark Mode</span>
                  </button>

                  <button
                    onClick={() => { setTheme('system'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      theme === 'system' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-800'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-blue-400" />
                    <span>System Mode</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 gold-button text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Vehicle</span>
                  </Link>
                )}

                <div className="flex items-center space-x-3 bg-slate-200/80 dark:bg-obsidian-900/90 border border-slate-300 dark:border-obsidian-border px-3.5 py-2 rounded-xl">
                  <div className="flex items-center space-x-2">
                    {isAdmin ? (
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.username}</span>
                  </div>
                  {isAdmin ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      USER
                    </span>
                  )}
                  <button
                    onClick={logout}
                    title="Logout"
                    className="text-slate-400 hover:text-rose-500 transition-colors ml-1 p-1 rounded-lg hover:bg-slate-300 dark:hover:bg-obsidian-800"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-amber-500 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="gold-button text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

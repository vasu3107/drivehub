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
    <header className="sticky top-0 z-40 bg-[#090c15] dark:bg-[#090c15] light:bg-white border-b border-amber-500/20 shadow-2xl transition-colors w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-2xl font-black gold-gradient-text tracking-tight">
                Drive<span className="text-amber-400">Hub</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-bold text-amber-500/90">
                Luxury Inventory OS
              </span>
            </div>
          </Link>

          {/* Center Navigation Capsule */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#131726] light:bg-slate-200/80 border border-[#232a3d] light:border-slate-300 rounded-2xl p-1.5 text-xs font-semibold shadow-inner">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                location.pathname === '/' 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Showroom</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  location.pathname.startsWith('/admin') 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Quick Demo Mode Pill */}
          <div className="hidden lg:flex items-center space-x-2 bg-[#131726] light:bg-slate-200/80 border border-[#232a3d] light:border-slate-300 rounded-2xl px-3.5 py-1.5 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300 light:text-slate-700 pr-1">Demo Mode:</span>
            <button
              onClick={handleDemoAdmin}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/30 transition-all text-xs"
            >
              ⚡ Admin Mode
            </button>
            <button
              onClick={handleDemoCustomer}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 transition-all text-xs"
            >
              🚗 Customer Mode
            </button>
          </div>

          {/* Right Menu (Add Vehicle, User Pill, Theme Toggle) */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#131726] light:bg-slate-200/80 border border-[#232a3d] light:border-slate-300 text-slate-300 light:text-slate-700 hover:text-amber-400 transition-colors"
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
                <div className="absolute right-0 mt-2 w-36 glass-panel rounded-2xl shadow-2xl border border-[#232a3d] p-1.5 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => { setTheme('light'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      theme === 'light' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-[#1a2035]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    onClick={() => { setTheme('dark'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-[#1a2035]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark Mode</span>
                  </button>

                  <button
                    onClick={() => { setTheme('system'); setThemeDropdownOpen(false); }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      theme === 'system' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-[#1a2035]'
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
                    className="flex items-center space-x-2 gold-button text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Vehicle</span>
                  </Link>
                )}

                <div className="flex items-center space-x-3 bg-[#131726] light:bg-slate-200/80 border border-[#232a3d] light:border-slate-300 px-3.5 py-2 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    {isAdmin ? (
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs font-bold text-slate-200 light:text-slate-900">{user.username}</span>
                  </div>
                  {isAdmin ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      USER
                    </span>
                  )}
                  <button
                    onClick={logout}
                    title="Logout"
                    className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-1 rounded-lg hover:bg-slate-800"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-slate-300 light:text-slate-700 hover:text-amber-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="gold-button text-xs font-bold px-4 py-2.5 rounded-2xl transition-all"
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

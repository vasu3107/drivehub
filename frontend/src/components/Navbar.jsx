import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, ShieldCheck, UserCheck, LogOut, LogIn, PlusCircle, Sparkles, LayoutDashboard, Grid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuthModal }) => {
  const { user, isAdmin, logout, loginDemoAdmin, loginDemoCustomer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDemoAdmin = async () => {
    await loginDemoAdmin();
    navigate('/admin');
  };

  const handleDemoCustomer = async () => {
    await loginDemoCustomer();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-amber-500/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Link */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-obsidian-900/90 border border-obsidian-border/60 rounded-xl p-1.5 text-xs font-semibold">
            <Link
              to="/"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition-all ${
                location.pathname === '/' 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:text-white'
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
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Center Quick Demo Account Switcher */}
          <div className="hidden lg:flex items-center space-x-2 bg-obsidian-900/90 border border-obsidian-border rounded-full px-3 py-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300 pr-1">Demo Mode:</span>
            <button
              onClick={handleDemoAdmin}
              className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/30 transition-all text-xs"
            >
              ⚡ Admin Mode
            </button>
            <button
              onClick={handleDemoCustomer}
              className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-500/30 transition-all text-xs"
            >
              🚗 Customer Mode
            </button>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
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

                <div className="flex items-center space-x-3 bg-obsidian-900/90 border border-obsidian-border px-3.5 py-2 rounded-xl">
                  <div className="flex items-center space-x-2">
                    {isAdmin ? (
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs font-semibold text-slate-200">{user.username}</span>
                  </div>
                  {isAdmin ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      USER
                    </span>
                  )}
                  <button
                    onClick={logout}
                    title="Logout"
                    className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-1 rounded-lg hover:bg-obsidian-800"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-obsidian-800 transition-colors"
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

import React from 'react';
import { Car, ShieldCheck, UserCheck, LogOut, LogIn, PlusCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuthModal, onOpenAddVehicleModal }) => {
  const { user, isAdmin, logout, loginDemoAdmin, loginDemoCustomer } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Drive<span className="text-blue-500">Hub</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-blue-400">
                Inventory OS
              </span>
            </div>
          </div>

          {/* Center Demo Switcher Quick Bar */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300 pr-1">Quick Demo Accounts:</span>
            <button
              onClick={loginDemoAdmin}
              className="px-2.5 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold border border-indigo-500/30 transition-all text-xs"
            >
              ⚡ Admin Mode
            </button>
            <button
              onClick={loginDemoCustomer}
              className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-500/30 transition-all text-xs"
            >
              🚗 Customer Mode
            </button>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {isAdmin && (
                  <button
                    onClick={onOpenAddVehicleModal}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Vehicle</span>
                  </button>
                )}

                <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
                  <div className="flex items-center space-x-2">
                    {isAdmin ? (
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs font-semibold text-slate-200">{user.username}</span>
                  </div>
                  {isAdmin ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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
                    className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-1 rounded-lg hover:bg-slate-800"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

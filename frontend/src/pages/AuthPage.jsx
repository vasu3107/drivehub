import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Shield, User, Sparkles } from 'lucide-react';

export function AuthPage({ mode = 'login', showToast }) {
  const navigate = useNavigate();
  const { login, register, loginDemoAdmin, loginDemoCustomer } = useAuth();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        showToast('Successfully logged in!');
      } else {
        await register(formData.username, formData.email, formData.password, formData.role);
        showToast('Registered & logged in successfully!');
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await loginDemoAdmin();
      showToast('Logged in as Demo Admin!');
      navigate('/admin');
    } catch (err) {
      setError('Demo admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    try {
      await loginDemoCustomer();
      showToast('Logged in as Demo Customer!');
      navigate('/');
    } catch (err) {
      setError('Demo customer login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="glass-panel rounded-3xl border border-amber-500/20 p-8 shadow-2xl">
        <div className="text-center pb-6 border-b border-obsidian-border mb-6">
          <h2 className="text-2xl font-black text-white gold-gradient-text">
            {isLogin ? 'Welcome Back to DriveHub' : 'Create DriveHub Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Sign in to access vehicle showroom & inventory' : 'Join as Customer or Admin user'}
          </p>
        </div>

        {/* Demo Auto-Fill */}
        <div className="p-3.5 bg-obsidian-950/90 rounded-2xl border border-obsidian-border mb-6">
          <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Auto-Fill:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Mode</span>
            </button>
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Mode</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isLogin ? 'Username or Email *' : 'Username *'}
            </label>
            <input
              type="text"
              required
              placeholder={isLogin ? 'admin or customer' : 'johndoe'}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-obsidian-950 text-slate-100 px-4 py-3 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-obsidian-950 text-slate-100 px-4 py-3 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-obsidian-950 text-slate-100 px-4 py-3 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-obsidian-950 text-slate-100 px-4 py-3 rounded-xl border border-obsidian-border text-sm focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="customer">Customer (Browse & Purchase)</option>
                <option value="admin">Admin (Add, Edit, Delete & Restock)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-button w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all mt-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-obsidian-border text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="text-amber-400 font-bold hover:underline">
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setIsLogin(true)} className="text-amber-400 font-bold hover:underline">
                Sign in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

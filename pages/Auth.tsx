
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { getDB, addUser } from '../store.ts';
import { User, MembershipType } from '../types.ts';
import { ADMIN_CREDENTIALS } from '../constants.tsx';

interface AuthProps {
  mode: 'login' | 'register';
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: MembershipType.MONTHLY
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const db = getDB();
      
      if (mode === 'login') {
        // Simple authentication check
        const user = db.users.find(u => u.email === formData.email && u.password === formData.password);
        if (user) {
          onLogin(user);
          navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Register new user
        if (db.users.find(u => u.email === formData.email)) {
          setError('Email already exists');
        } else {
          const newUser = addUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'customer',
            membershipType: undefined // Will be set after payment in dashboard or during flow
          });
          onLogin(newUser);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 relative overflow-hidden bg-black">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-400/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border-zinc-800 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="bg-lime-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 hover:rotate-0 transition-transform">
            <Dumbbell className="text-black w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join The Forge'}
          </h2>
          <p className="text-zinc-500 font-medium">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard' 
              : 'Create an account and start your transformation'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
                <input 
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all placeholder:text-zinc-600"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
              <input 
                type="email"
                required
                placeholder="john@example.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all placeholder:text-zinc-600"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all placeholder:text-zinc-600"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-lime-400 hover:bg-lime-300 text-black py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-lime-400/10 mt-4"
          >
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-zinc-500 font-medium">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </span>{' '}
          <Link 
            to={mode === 'login' ? '/register' : '/login'} 
            className="text-lime-400 font-bold hover:underline ml-1"
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </Link>
        </div>

        {mode === 'login' && (
          <div className="mt-6 pt-6 border-t border-zinc-800/50 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Demo Credentials</p>
            <div className="text-xs text-zinc-500 flex flex-col gap-1">
              <span>Admin: {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;

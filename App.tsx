
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { DBState, User } from './types';
import { getDB, saveDB } from './store';
import Home from './pages/Home';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Dumbbell, LogOut, User as UserIcon, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [db, setDb] = useState<DBState>(getDB());
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = getDB();
    if (saved.currentUser) {
      setCurrentUser(saved.currentUser);
    }
  }, []);

  const handleLogin = (user: User) => {
    const state = getDB();
    state.currentUser = user;
    saveDB(state);
    setCurrentUser(user);
    setDb(state);
  };

  const handleLogout = () => {
    const state = getDB();
    state.currentUser = null;
    saveDB(state);
    setCurrentUser(null);
    setDb(state);
  };

  const refreshDB = () => {
    setDb(getDB());
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 glass border-b border-zinc-800 py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-lime-400 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                <Dumbbell className="text-black w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">FORGE <span className="text-lime-400">FITNESS</span></span>
            </Link>

            <div className="flex items-center gap-6">
              {currentUser ? (
                <>
                  <Link 
                    to={currentUser.role === 'admin' ? "/admin" : "/dashboard"} 
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {currentUser.role === 'admin' ? <Shield className="w-4 h-4 text-red-500" /> : <UserIcon className="w-4 h-4" />}
                    <span className="hidden sm:inline font-medium">{currentUser.name}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full transition-all text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="bg-lime-400 hover:bg-lime-300 text-black px-6 py-2 rounded-full transition-all font-bold"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth mode="login" onLogin={handleLogin} />} />
            <Route path="/register" element={<Auth mode="register" onLogin={handleLogin} />} />
            
            <Route 
              path="/dashboard" 
              element={
                currentUser && currentUser.role === 'customer' 
                ? <UserDashboard user={currentUser} onUpdate={refreshDB} /> 
                : <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                currentUser && currentUser.role === 'admin' 
                ? <AdminDashboard db={db} onUpdate={refreshDB} /> 
                : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>

        <footer className="py-12 px-6 border-t border-zinc-900 bg-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="text-lime-400 w-6 h-6" />
                <span className="text-xl font-black text-white">FORGE</span>
              </div>
              <p className="text-zinc-500 leading-relaxed">
                Forge Fitness is your ultimate destination for high-intensity training, recovery, and community. Start your journey with us today.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Plans</h4>
              <ul className="space-y-2 text-zinc-500">
                <li className="hover:text-lime-400 cursor-pointer transition-colors">Monthly - ₹1,500</li>
                <li className="hover:text-lime-400 cursor-pointer transition-colors">Quarterly - ₹4,000</li>
                <li className="hover:text-lime-400 cursor-pointer transition-colors">Yearly - ₹14,000</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">Location</h4>
              <p className="text-zinc-500 leading-relaxed">
                123 Power Lane, Strength City<br />
                Mumbai, Maharashtra, India<br />
                Contact: +91 98765 43210
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
            © {new Date().getFullYear()} Forge Fitness. All Rights Reserved.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

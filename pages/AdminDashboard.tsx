
import React, { useState } from 'react';
import { DBState, User, Payment, Attendance } from '../types';
import { Users, CreditCard, BarChart3, Search, Calendar, CheckCircle2, MoreVertical, LayoutDashboard, Settings, UserPlus, Filter } from 'lucide-react';

interface AdminDashboardProps {
  db: DBState;
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ db, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'payments'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const customers = db.users.filter(u => u.role === 'customer');
  const totalRevenue = db.payments.reduce((acc, curr) => acc + curr.amount, 0);
  const activeMembers = customers.filter(u => u.membershipExpiry && new Date(u.membershipExpiry) > new Date()).length;
  
  const filteredCustomers = customers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CreditCard, color: 'text-lime-400' },
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-400' },
    { label: 'Active Members', value: activeMembers, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Check-ins Today', value: db.attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length, icon: BarChart3, color: 'text-purple-400' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[90vh] bg-black">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-r border-zinc-900 bg-zinc-950 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-red-500 p-2 rounded-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-white uppercase">Admin <span className="text-zinc-600">Console</span></span>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'payments', icon: CreditCard, label: 'Payments' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                activeTab === item.id 
                  ? 'bg-lime-400 text-black' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">
              {activeTab === 'overview' ? 'Performance Overview' : 
               activeTab === 'customers' ? 'Customer Management' : 'Transaction History'}
            </h2>
            <p className="text-zinc-500 font-medium">System status and metrics as of {new Date().toLocaleDateString()}</p>
          </div>
          {activeTab === 'customers' && (
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-lime-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search by name or email..."
                className="bg-zinc-900 border border-zinc-800 text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-lime-400 w-full md:w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass p-6 rounded-[2rem] border-zinc-800">
                  <div className={`${stat.color} mb-4`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2.5rem] border-zinc-800">
                <h3 className="text-xl font-black text-white mb-6">Recent Customer Activity</h3>
                <div className="space-y-4">
                  {db.attendance.slice(-5).reverse().map((att, i) => {
                    const user = db.users.find(u => u.id === att.userId);
                    return (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lime-400">
                            {user?.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-bold">{user?.name}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{user?.membershipType || 'No Plan'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white font-medium">{att.checkInTime}</div>
                          <div className="text-[10px] text-zinc-600">{att.date}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass p-8 rounded-[2.5rem] border-zinc-800">
                <h3 className="text-xl font-black text-white mb-6">Latest Payments</h3>
                <div className="space-y-4">
                  {db.payments.slice(-5).reverse().map((pay, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <div>
                        <div className="text-white font-bold">{pay.userName}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{pay.plan} Subscription</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lime-400 font-black">₹{pay.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-zinc-600">{new Date(pay.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="glass rounded-[2.5rem] border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Member</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Plan</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Expires</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredCustomers.length > 0 ? filteredCustomers.map((user) => {
                    const isActive = user.membershipExpiry && new Date(user.membershipExpiry) > new Date();
                    return (
                      <tr key={user.id} className="group hover:bg-zinc-900/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-lime-400 group-hover:text-black transition-all flex items-center justify-center font-bold text-zinc-400">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-bold">{user.name}</div>
                              <div className="text-zinc-500 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-zinc-400 font-medium">{user.membershipType || '—'}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-lime-400/20 text-lime-400' : 'bg-red-500/20 text-red-500'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-zinc-500 text-sm font-medium">
                            {user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <button className="text-zinc-600 hover:text-white transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-medium italic">
                        No members found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="glass rounded-[2.5rem] border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Transaction ID</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Plan</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {db.payments.length > 0 ? db.payments.slice().reverse().map((payment) => (
                    <tr key={payment.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-8 py-6 text-zinc-500 text-xs font-mono">{payment.id}</td>
                      <td className="px-8 py-6 text-white font-bold">{payment.userName}</td>
                      <td className="px-8 py-6 text-lime-400 font-black">₹{payment.amount.toLocaleString()}</td>
                      <td className="px-8 py-6 text-zinc-400 font-medium">{payment.plan}</td>
                      <td className="px-8 py-6 text-zinc-500 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-medium italic">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

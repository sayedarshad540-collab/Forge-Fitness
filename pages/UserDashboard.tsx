
import React, { useState } from 'react';
import { User, DBState, MembershipType } from '../types.ts';
import { addPayment, logAttendance } from '../store.ts';
import { MEMBERSHIP_PLANS } from '../constants.tsx';
import { Calendar, CreditCard, Activity, Trophy, Sparkles, AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react';
import { getWorkoutSuggestions } from '../geminiService.ts';

interface UserDashboardProps {
  user: User;
  db: DBState;
  onUpdate: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, db, onUpdate }) => {
  const [aiWorkout, setAiWorkout] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Derive data directly from props to ensure UI is always in sync with App state
  const userPayments = db.payments.filter(p => p.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const userAttendance = db.attendance.filter(a => a.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const isExpired = user.membershipExpiry ? new Date(user.membershipExpiry) < new Date() : true;

  const handleCheckIn = () => {
    logAttendance(user.id);
    onUpdate();
  };

  const handlePayment = async (planName: MembershipType) => {
    const plan = MEMBERSHIP_PLANS.find(p => p.name === planName)!;
    setIsSubmittingPayment(true);

    try {
      // Submit order details to Formspree
      await fetch("https://formspree.io/f/xqedaoln", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          subject: `New Membership Order: ${planName} Plan - ${user.name}`,
          customerName: user.name,
          customerEmail: user.email,
          membershipPlan: planName,
          amount: `₹${plan.price}`,
          duration: `${plan.durationMonths} Months`,
          userId: user.id,
          orderDate: new Date().toLocaleString()
        })
      });

      // Update local database state
      addPayment({
        userId: user.id,
        userName: user.name,
        amount: plan.price,
        plan: planName
      });

      setShowPayModal(false);
      onUpdate();
    } catch (error) {
      console.error("Payment submission failed:", error);
      alert("There was an issue processing your request. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const fetchAIWorkout = async () => {
    if (!user.membershipType) return;
    setLoadingAI(true);
    const result = await getWorkoutSuggestions(user.membershipType);
    setAiWorkout(result);
    setLoadingAI(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Welcome Back, {user.name.split(' ')[0]}!</h1>
          <p className="text-zinc-500 font-medium">Here's a snapshot of your fitness journey at Forge.</p>
        </div>
        {!isExpired ? (
          <button 
            onClick={handleCheckIn}
            className="bg-lime-400 hover:bg-lime-300 text-black px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg shadow-lime-400/20"
          >
            <Activity className="w-5 h-5" />
            Check In Today
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-2xl text-sm font-bold">
            <AlertCircle className="w-5 h-5" />
            Membership Expired
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Membership Card */}
        <div className="p-8 rounded-[2.5rem] glass border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-zinc-800 p-3 rounded-2xl">
                <Trophy className="w-6 h-6 text-lime-400" />
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isExpired ? 'bg-red-500/20 text-red-500' : 'bg-lime-400/20 text-lime-400'}`}>
                {isExpired ? 'Inactive' : 'Active'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white mb-1">
              {user.membershipType || 'No Active Plan'}
            </h3>
            <p className="text-zinc-500 text-sm mb-6">
              {user.membershipExpiry ? `Expires: ${new Date(user.membershipExpiry).toLocaleDateString()}` : 'Upgrade to start training'}
            </p>
          </div>
          <button 
            onClick={() => setShowPayModal(true)}
            className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
          >
            {user.membershipType ? 'Renew Plan' : 'Subscribe Now'}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="p-8 rounded-[2.5rem] glass border-zinc-800">
          <div className="bg-zinc-800 p-3 rounded-2xl w-fit mb-6">
            <Calendar className="w-6 h-6 text-lime-400" />
          </div>
          <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Monthly Attendance</h3>
          <div className="text-5xl font-black text-white mb-2">
            {userAttendance.filter(a => {
              const date = new Date(a.date);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length}
          </div>
          <p className="text-zinc-500 text-sm font-medium">Days checked in this month</p>
        </div>

        {/* AI Recommendations */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-lime-400/10 to-transparent border border-lime-400/20">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-lime-400 p-3 rounded-2xl">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white mb-2">Forge AI Coach</h3>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Get a personalized daily workout routine based on your plan level.</p>
          <button 
            disabled={loadingAI || !user.membershipType}
            onClick={fetchAIWorkout}
            className="w-full bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/30 py-4 rounded-2xl font-black transition-all disabled:opacity-50"
          >
            {loadingAI ? 'Generating...' : 'Generate Today\'s Routine'}
          </button>
        </div>
      </div>

      {aiWorkout && (
        <div className="mb-12 p-8 rounded-[2.5rem] glass border-lime-400/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Sparkles className="text-lime-400" />
            Your AI Workout Recommendation
          </h3>
          <div className="prose prose-invert max-w-none text-zinc-300 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 whitespace-pre-wrap font-mono text-sm">
            {aiWorkout}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attendance List */}
        <div className="p-8 rounded-[2.5rem] glass border-zinc-800">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <Activity className="text-lime-400 w-5 h-5" />
            Recent Check-ins
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {userAttendance.length > 0 ? userAttendance.map((a) => (
              <div key={a.id} className="flex justify-between items-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-white font-bold">{new Date(a.date).toLocaleDateString()}</span>
                <span className="text-zinc-500 text-sm">{a.checkInTime}</span>
              </div>
            )) : (
              <p className="text-zinc-600 italic">No check-ins yet.</p>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="p-8 rounded-[2.5rem] glass border-zinc-800">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <CreditCard className="text-lime-400 w-5 h-5" />
            Payment History
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {userPayments.length > 0 ? userPayments.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <div>
                  <div className="text-white font-bold">{p.plan} Plan</div>
                  <div className="text-zinc-500 text-xs">{new Date(p.date).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-lime-400 font-black">₹{p.amount.toLocaleString()}</div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest">{p.status}</div>
                </div>
              </div>
            )) : (
              <p className="text-zinc-600 italic">No payments found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 glass backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[3rem] p-10 relative animate-in zoom-in duration-300">
            <button 
              disabled={isSubmittingPayment}
              onClick={() => setShowPayModal(false)} 
              className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors disabled:opacity-0"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-white mb-2 text-center">Select Your Plan</h2>
            <p className="text-zinc-500 mb-10 text-center">Fuel your fitness with a premium membership.</p>
            
            <div className="space-y-4">
              {MEMBERSHIP_PLANS.map((plan) => (
                <button 
                  key={plan.id}
                  disabled={isSubmittingPayment}
                  onClick={() => handlePayment(plan.name)}
                  className="w-full p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-lime-400/50 transition-all flex justify-between items-center group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div>
                    <div className="text-white font-black text-lg group-hover:text-lime-400 transition-colors">{plan.name}</div>
                    <div className="text-zinc-500 text-sm">{plan.durationMonths} Month Duration</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">₹{plan.price.toLocaleString()}</div>
                    <div className="text-[10px] text-lime-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      {isSubmittingPayment ? (
                        <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>
                      ) : (
                        <>Pay Now <ArrowUpRight className="w-3 h-3" /></>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-8 text-center text-zinc-600 text-xs">Secure checkout details submitted via Formspree.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

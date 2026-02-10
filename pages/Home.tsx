
import React from 'react';
import { Link } from 'react-router-dom';
// Fix: Import Shield icon which was missing and causing a reference error
import { Check, ArrowRight, Activity, Users, Zap, Clock, Shield } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 scale-105"
            alt="Gym background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-lime-400 border border-lime-400/20 text-sm font-bold uppercase tracking-widest animate-pulse">
            <Zap className="w-4 h-4" />
            New Year Special Offers
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
            FORGE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">BEST VERSION</span> OF YOU
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
            Join the most elite fitness community in India. State-of-the-art equipment, world-class trainers, and a results-driven atmosphere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-lime-400 hover:bg-lime-300 text-black px-10 py-5 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(163,230,53,0.3)]"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#plans" 
              className="glass hover:bg-zinc-800 text-white px-10 py-5 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-2"
            >
              View Membership
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Members', value: '5,000+', icon: Users },
            { label: 'Certified Trainers', value: '50+', icon: Shield },
            { label: 'Total Gym Floor', value: '15k SqFt', icon: Activity },
            { label: 'Open Hours', value: '24/7', icon: Clock },
          ].map((stat, idx) => (
            <div key={idx} className="p-8 rounded-3xl glass border-zinc-800 flex flex-col items-center text-center">
              <stat.icon className="w-8 h-8 text-lime-400 mb-4" />
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-lime-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">UNBEATABLE PLANS</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">Choose a membership that fits your lifestyle and goals. No hidden fees, just pure gains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${
                  plan.name === 'Quarterly' 
                  ? 'bg-gradient-to-br from-zinc-900 to-black border-lime-400/50 ring-1 ring-lime-400/20 scale-105 shadow-[0_20px_60px_-15px_rgba(163,230,53,0.15)]' 
                  : 'glass border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {plan.name === 'Quarterly' && (
                  <div className="bg-lime-400 text-black text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full self-start mb-6">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">₹{plan.price.toLocaleString()}</span>
                    <span className="text-zinc-500 font-bold">/ {plan.durationMonths === 1 ? 'mo' : plan.durationMonths + ' mos'}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-400">
                      <div className="bg-lime-400/10 p-1 rounded-full mt-1">
                        <Check className="w-4 h-4 text-lime-400" />
                      </div>
                      <span className="text-sm font-medium leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/register"
                  className={`w-full py-4 rounded-2xl text-center font-black transition-all ${
                    plan.name === 'Quarterly'
                    ? 'bg-lime-400 text-black hover:bg-lime-300'
                    : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, LogOut, Wallet, Activity, BarChart3, TrendingDown, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NavTabs, { TabType } from '@/components/NavTabs';
import HomeView from '@/components/HomeView';
import SearchView from '@/components/SearchView';
import WatchlistView from '@/components/WatchlistView';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  const handleStockClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-zinc-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      icon: Wallet,
      label: 'Portfolio Value',
      value: '$0.00',
      change: '+0.00%',
      isPositive: true,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      iconBg: 'bg-emerald-500/20',
    },
    {
      icon: Activity,
      label: "Today's Change",
      value: '+$0.00',
      change: '+0.00%',
      isPositive: true,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      iconBg: 'bg-blue-500/20',
    },
    {
      icon: BarChart3,
      label: 'Total Return',
      value: '0.00%',
      change: 'All time',
      isPositive: true,
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10',
      iconBg: 'bg-violet-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Active Stocks',
      value: '0',
      change: 'Watching',
      isPositive: true,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-500/10 to-amber-500/10',
      iconBg: 'bg-orange-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur opacity-75" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Stock Market Pro
                </h1>
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {currentTime.toLocaleTimeString()} • Live Market Data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Welcome back,</p>
                  <p className="font-semibold text-white">{user.name || user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <LogOut className="w-4 h-4 relative z-10" />
                <span className="relative z-10 font-medium">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="relative max-w-[100rem] mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h2 className="text-3xl font-bold text-white">
                {activeTab === 'home' && 'Your Trading Dashboard'}
                {activeTab === 'search' && 'Search Stocks'}
                {activeTab === 'watchlist' && 'Your Watchlist'}
              </h2>
            </div>
            <p className="text-zinc-400">
              {activeTab === 'home' && 'Track your investments and market trends in real-time with advanced analytics'}
              {activeTab === 'search' && 'Find stocks and add them to your watchlist for tracking'}
              {activeTab === 'watchlist' && 'Monitor your favorite stocks with live price updates'}
            </p>
          </div>

          {/* Stats Cards - Only show on Home tab */}
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Card */}
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${stat.iconBg} p-3 rounded-xl`}>
                        <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tab Content */}
          <div key={activeTab}>
            {activeTab === 'home' && <HomeView selectedSymbol={selectedSymbol} />}
            {activeTab === 'search' && <SearchView onStockClick={handleStockClick} />}
            {activeTab === 'watchlist' && <WatchlistView />}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import RealTimeChart from './RealTime';
import MarketOverview from './TradingView';
import StockHeatMap from './StockHeatMap';
import { TrendingUp, BarChart3, Grid3x3 } from 'lucide-react';

interface HomeViewProps {
    selectedSymbol?: string;
}

export default function HomeView({ selectedSymbol }: HomeViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Advanced Trading Chart + Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Real-Time Chart - Takes 2 columns */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 relative group"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Card */}
                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-[600px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/20">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Advanced Trading Chart</h3>
                                    <p className="text-sm text-zinc-400">
                                        {selectedSymbol
                                            ? `Viewing ${selectedSymbol.replace('NASDAQ:', '').replace('NYSE:', '')}`
                                            : 'Real-time market data and technical analysis'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-xs font-medium text-emerald-400">LIVE</span>
                            </div>
                        </div>
                        <div className="h-[calc(100%-5rem)] rounded-xl overflow-hidden border border-white/5">
                            <RealTimeChart symbol={selectedSymbol} />
                        </div>
                    </div>
                </motion.div>

                {/* Market Overview - Takes 1 column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative group"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Card */}
                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-[600px]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Market Overview</h3>
                                <p className="text-sm text-zinc-400">Global indices and commodities</p>
                            </div>
                        </div>
                        <div className="h-[calc(100%-5rem)] rounded-xl overflow-hidden border border-white/5">
                            <MarketOverview />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stock Heatmap */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-[600px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                            <Grid3x3 className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Stock Heatmap</h3>
                            <p className="text-sm text-zinc-400">S&P 500 market cap and performance visualization</p>
                        </div>
                    </div>
                    <div className="h-[calc(100%-5rem)] rounded-xl overflow-hidden border border-white/5">
                        <StockHeatMap />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

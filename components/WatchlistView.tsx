'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, RefreshCw, TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { StockQuote } from '@/types/stock';

export default function WatchlistView() {
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const fetchPrices = async () => {
        if (watchlist.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            // Fetch quotes one by one to respect rate limits
            const newQuotes: Record<string, StockQuote> = {};

            for (let i = 0; i < watchlist.length; i++) {
                const stock = watchlist[i];
                try {
                    const response = await fetch(`/api/stocks/quote?symbol=${encodeURIComponent(stock.symbol)}`);

                    if (response.ok) {
                        const data = await response.json();
                        if (data.quote && !data.error) {
                            newQuotes[stock.symbol] = {
                                symbol: stock.symbol,
                                price: data.quote.price,
                                change: data.quote.change,
                                changePercent: data.quote.changePercent,
                                volume: data.quote.volume,
                                previousClose: data.quote.previousClose,
                                high: data.quote.high,
                                low: data.quote.low,
                                open: data.quote.open,
                            };
                        }
                    }
                } catch (err) {
                    console.error(`Failed to fetch quote for ${stock.symbol}:`, err);
                }

                // Add a small delay between requests to avoid rate limiting
                if (i < watchlist.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            setQuotes(newQuotes);
            setLastUpdate(new Date());
        } catch (err) {
            console.error('Error fetching prices:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch prices');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (watchlist.length > 0) {
            fetchPrices();
        }
    }, [watchlist.length]); // Only refetch when watchlist size changes

    // Auto-refresh every 60 seconds
    useEffect(() => {
        if (watchlist.length === 0) return;

        const intervalId = setInterval(() => {
            fetchPrices();
        }, 60000); // 60 seconds

        return () => clearInterval(intervalId);
    }, [watchlist.length]);

    if (watchlist.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-75" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-white/10 text-center">
                    <Star className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Your Watchlist is Empty</h3>
                    <p className="text-zinc-400 mb-6">Start adding stocks from the Search tab to track their prices</p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Star className="w-4 h-4" />
                        <span className="font-medium">Use Search to add stocks</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Watchlist Header */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-75" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-amber-500/20">
                                <Star className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
                                <p className="text-sm text-zinc-400">
                                    Tracking {watchlist.length} stock{watchlist.length !== 1 ? 's' : ''}
                                    {lastUpdate && ` • Updated ${lastUpdate.toLocaleTimeString()}`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchPrices}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="font-medium">Refresh Prices</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
            )}

            {/* Watchlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.map((stock, index) => {
                    const quote = quotes[stock.symbol];
                    const isPositive = quote ? quote.change >= 0 : true;

                    return (
                        <motion.div
                            key={stock.symbol}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${isPositive
                                    ? 'from-emerald-500/10 to-teal-500/10'
                                    : 'from-red-500/10 to-orange-500/10'
                                } rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Card */}
                            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{stock.symbol}</h3>
                                        <p className="text-sm text-zinc-400 line-clamp-1">{stock.name}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromWatchlist(stock.symbol)}
                                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                                        title="Remove from watchlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Price Info */}
                                {quote ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-3xl font-bold text-white">
                                                ${quote.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-2 ${isPositive ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {isPositive ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            <span className="font-semibold">
                                                {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                                            <div>
                                                <p className="text-xs text-zinc-500">High</p>
                                                <p className="text-sm font-semibold text-zinc-300">${quote.high.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Low</p>
                                                <p className="text-sm font-semibold text-zinc-300">${quote.low.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

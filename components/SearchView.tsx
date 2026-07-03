'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, TrendingUp, Loader2, AlertCircle, Plus, Check, BarChart2 } from 'lucide-react';
import { useStockSearch } from '@/hooks/useStockSearch';
import { useWatchlist } from '@/hooks/useWatchlist';
import { SearchResult } from '@/types/stock';

interface SearchViewProps {
    onStockClick?: (symbol: string) => void;
}

export default function SearchView({ onStockClick }: SearchViewProps) {
    const [searchInput, setSearchInput] = useState('');
    const { results, isLoading, error, search } = useStockSearch();
    const { addToWatchlist, isInWatchlist } = useWatchlist();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        search(value);
    };

    const handleStockClick = (stock: SearchResult) => {
        // Format symbol for TradingView (add exchange prefix if not present)
        let formattedSymbol = stock.symbol;
        if (!formattedSymbol.includes(':')) {
            // Determine exchange based on region
            if (stock.region === 'United States') {
                formattedSymbol = `NASDAQ:${formattedSymbol}`;
            } else {
                formattedSymbol = `${formattedSymbol}`;
            }
        }

        if (onStockClick) {
            onStockClick(formattedSymbol);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Search Header */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-75" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-emerald-500/20">
                            <SearchIcon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Search Stocks</h2>
                            <p className="text-sm text-zinc-400">Find stocks, view charts, and add to watchlist</p>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleSearchChange}
                            placeholder="Search by symbol or company name (e.g., AAPL, Apple, Microsoft)..."
                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                        {isLoading && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 animate-spin" />
                        )}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div>
                            <p className="text-red-400 font-medium">Error</p>
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    </motion.div>
                )}

                {!error && searchInput && !isLoading && results.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-white/10 text-center"
                    >
                        <SearchIcon className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg">No stocks found for "{searchInput}"</p>
                        <p className="text-zinc-500 text-sm mt-2">Try a different search term</p>
                    </motion.div>
                )}

                {!searchInput && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-white/10 text-center"
                    >
                        <TrendingUp className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg">Start searching for stocks</p>
                        <p className="text-zinc-500 text-sm mt-2">Enter a stock symbol or company name above</p>
                    </motion.div>
                )}

                {results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((stock, index) => {
                            const inWatchlist = isInWatchlist(stock.symbol);

                            return (
                                <motion.div
                                    key={stock.symbol}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative"
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Card */}
                                    <div
                                        className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                                    >
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                                                {stock.region && (
                                                    <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                        {stock.region}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-400 line-clamp-2">{stock.name}</p>
                                            {stock.exchange && (
                                                <p className="text-xs text-zinc-500 mt-1">{stock.exchange}</p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStockClick(stock)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 hover:from-blue-500/20 hover:to-cyan-500/20"
                                            >
                                                <BarChart2 className="w-4 h-4" />
                                                <span>View Chart</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (!inWatchlist) {
                                                        addToWatchlist(stock);
                                                    }
                                                }}
                                                disabled={inWatchlist}
                                                className={`p-3 rounded-lg font-medium transition-all ${inWatchlist
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                                                        : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-teal-500/20'
                                                    }`}
                                                title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                                            >
                                                {inWatchlist ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

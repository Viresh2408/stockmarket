'use client';

import { useState, useEffect, useCallback } from 'react';
import { WatchlistStock } from '@/types/stock';

const WATCHLIST_KEY = 'stock_watchlist';

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistStock[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load watchlist from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(WATCHLIST_KEY);
            if (stored) {
                setWatchlist(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading watchlist:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage whenever watchlist changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
            } catch (error) {
                console.error('Error saving watchlist:', error);
            }
        }
    }, [watchlist, isLoaded]);

    const addToWatchlist = useCallback((stock: Omit<WatchlistStock, 'addedAt'>) => {
        setWatchlist(prev => {
            // Check if already exists
            if (prev.some(s => s.symbol === stock.symbol)) {
                return prev;
            }
            return [...prev, { ...stock, addedAt: Date.now() }];
        });
    }, []);

    const removeFromWatchlist = useCallback((symbol: string) => {
        setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
    }, []);

    const isInWatchlist = useCallback((symbol: string) => {
        return watchlist.some(s => s.symbol === symbol);
    }, [watchlist]);

    const clearWatchlist = useCallback(() => {
        setWatchlist([]);
    }, []);

    return {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist,
        isLoaded,
    };
}

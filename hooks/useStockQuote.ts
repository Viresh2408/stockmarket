'use client';

import { useState, useEffect, useCallback } from 'react';
import { StockQuote } from '@/types/stock';

export function useStockQuote(symbol: string, autoRefresh = false, refreshInterval = 60000) {
    const [quote, setQuote] = useState<StockQuote | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuote = useCallback(async () => {
        if (!symbol) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/stocks/quote?symbol=${encodeURIComponent(symbol)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setQuote(data.quote);
        } catch (err) {
            console.error('Quote fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch quote');
            setQuote(null);
        } finally {
            setIsLoading(false);
        }
    }, [symbol]);

    // Initial fetch
    useEffect(() => {
        if (symbol) {
            fetchQuote();
        }
    }, [symbol, fetchQuote]);

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh || !symbol) return;

        const intervalId = setInterval(() => {
            fetchQuote();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [autoRefresh, symbol, refreshInterval, fetchQuote]);

    return {
        quote,
        isLoading,
        error,
        refetch: fetchQuote,
    };
}

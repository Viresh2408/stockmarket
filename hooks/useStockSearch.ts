'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchResult } from '@/types/stock';

export function useStockSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounced search
    useEffect(() => {
        if (!query || query.length < 1) {
            setResults([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        const timeoutId = setTimeout(async () => {
            try {
                const response = await fetch(`/api/stocks/search?query=${encodeURIComponent(query)}`);

                if (!response.ok) {
                    throw new Error('Failed to search stocks');
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setResults(data.results || []);
            } catch (err) {
                console.error('Search error:', err);
                setError(err instanceof Error ? err.message : 'Search failed');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    const search = useCallback((searchQuery: string) => {
        setQuery(searchQuery);
    }, []);

    const clearSearch = useCallback(() => {
        setQuery('');
        setResults([]);
        setError(null);
    }, []);

    return {
        query,
        results,
        isLoading,
        error,
        search,
        clearSearch,
    };
}

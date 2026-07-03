// Type definitions for stock-related data

export interface Stock {
    symbol: string;
    name: string;
    region?: string;
    exchange?: string;
}

export interface StockQuote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    previousClose: number;
    high: number;
    low: number;
    open: number;
    timestamp?: string;
}

export interface SearchResult extends Stock {
    matchScore?: string;
}

export interface WatchlistStock extends Stock {
    addedAt: number;
}

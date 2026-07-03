// Alpha Vantage API client utility

const API_KEY = process.env.ALPHA_VANTAGE_API;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface AlphaVantageSearchResult {
    '1. symbol': string;
    '2. name': string;
    '3. type': string;
    '4. region': string;
    '5. marketOpen': string;
    '6. marketClose': string;
    '7. timezone': string;
    '8. currency': string;
    '9. matchScore': string;
}

export interface AlphaVantageQuote {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
}

// In-memory cache to reduce API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

function getCachedData(key: string) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

function setCachedData(key: string, data: any) {
    cache.set(key, { data, timestamp: Date.now() });
}

export async function searchStocks(query: string) {
    if (!query || query.length < 1) {
        return [];
    }

    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
        const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        // Check for rate limit or error messages
        if (data.Note) {
            throw new Error('API rate limit reached. Please try again later.');
        }

        if (data['Error Message']) {
            throw new Error('Invalid API request');
        }

        const matches = data.bestMatches || [];
        const results = matches.map((match: AlphaVantageSearchResult) => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            region: match['4. region'],
            exchange: match['3. type'],
            matchScore: match['9. matchScore'],
        }));

        setCachedData(cacheKey, results);
        return results;
    } catch (error) {
        console.error('Error searching stocks:', error);
        throw error;
    }
}

export async function getStockQuote(symbol: string) {
    if (!symbol) {
        throw new Error('Symbol is required');
    }

    const cacheKey = `quote:${symbol.toUpperCase()}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
        const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        // Check for rate limit or error messages
        if (data.Note) {
            throw new Error('API rate limit reached. Please try again later.');
        }

        if (data['Error Message']) {
            throw new Error('Invalid symbol or API request');
        }

        const quote = data['Global Quote'];

        if (!quote || !quote['01. symbol']) {
            throw new Error('No data available for this symbol');
        }

        const result = {
            symbol: quote['01. symbol'],
            open: parseFloat(quote['02. open']),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            price: parseFloat(quote['05. price']),
            volume: parseInt(quote['06. volume']),
            latestTradingDay: quote['07. latest trading day'],
            previousClose: parseFloat(quote['08. previous close']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        };

        setCachedData(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}

// Helper function to delay between requests
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

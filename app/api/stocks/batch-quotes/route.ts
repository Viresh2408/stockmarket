import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote, delay } from '@/lib/alphaVantage';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { symbols } = body;

        if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
            return NextResponse.json(
                { error: 'Symbols array is required' },
                { status: 400 }
            );
        }

        // Fetch quotes with delay to respect rate limits
        const quotes = [];
        for (let i = 0; i < symbols.length; i++) {
            try {
                const quote = await getStockQuote(symbols[i]);
                quotes.push(quote);

                // Add delay between requests (except for the last one)
                if (i < symbols.length - 1) {
                    await delay(12000); // 12 seconds to stay under 5 requests/minute
                }
            } catch (error) {
                console.error(`Error fetching quote for ${symbols[i]}:`, error);
                // Continue with other symbols even if one fails
                quotes.push({
                    symbol: symbols[i],
                    error: error instanceof Error ? error.message : 'Failed to fetch quote'
                });
            }
        }

        return NextResponse.json({ quotes });
    } catch (error) {
        console.error('Batch quote error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch batch quotes' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote } from '@/lib/alphaVantage';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const symbol = searchParams.get('symbol');

        if (!symbol) {
            return NextResponse.json(
                { error: 'Symbol parameter is required' },
                { status: 400 }
            );
        }

        const quote = await getStockQuote(symbol);
        return NextResponse.json({ quote });
    } catch (error) {
        console.error('Stock quote error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch quote' },
            { status: 500 }
        );
    }
}

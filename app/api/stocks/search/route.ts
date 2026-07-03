import { NextRequest, NextResponse } from 'next/server';
import { searchStocks } from '@/lib/alphaVantage';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query');

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        const results = await searchStocks(query);
        return NextResponse.json({ results });
    } catch (error) {
        console.error('Stock search error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to search stocks' },
            { status: 500 }
        );
    }
}

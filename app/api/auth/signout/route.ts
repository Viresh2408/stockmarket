import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Create response
        const response = NextResponse.json(
            { message: 'Signed out successfully' },
            { status: 200 }
        );

        // Clear the auth cookie
        response.cookies.delete('auth-token');

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to sign out' },
            { status: 500 }
        );
    }
}

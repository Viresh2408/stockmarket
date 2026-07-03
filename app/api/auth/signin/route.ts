import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Sign in user
        const { user, token } = await signIn({ email, password });

        // Create response
        const response = NextResponse.json(
            { user, message: 'Signed in successfully' },
            { status: 200 }
        );

        // Set HTTP-only cookie with JWT token
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to sign in' },
            { status: 401 }
        );
    }
}

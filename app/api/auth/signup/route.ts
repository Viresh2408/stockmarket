import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        // Validate required fields
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        // Sign up user
        const { user, token } = await signUp({ email, password, name });

        // Create response
        const response = NextResponse.json(
            { user, message: 'Account created successfully' },
            { status: 201 }
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
            { error: error.message || 'Failed to create account' },
            { status: 400 }
        );
    }
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, TrendingUp } from 'lucide-react';
import { AuthCard } from '@/components/ui/auth/auth-card';
import { AuthInput } from '@/components/ui/auth/auth-input';
import { AuthButton } from '@/components/ui/auth/auth-button';
import { GoogleButton } from '@/components/ui/auth/social-button';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmail(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setGoogleLoading(true);

        try {
            await signInWithGoogle();
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl"
                />
            </div>

            {/* Stock market ticker animation */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 overflow-hidden">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="flex gap-8 whitespace-nowrap"
                >
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">AAPL</span>
                            <span className="text-emerald-200">+2.5%</span>
                            <span className="mx-4">•</span>
                            <span className="font-semibold">GOOGL</span>
                            <span className="text-emerald-200">+1.8%</span>
                            <span className="mx-4">•</span>
                            <span className="font-semibold">MSFT</span>
                            <span className="text-emerald-200">+3.2%</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to access your stock portfolio"
            >
                <form onSubmit={handleEmailSignIn} className="space-y-5">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <AuthInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="w-5 h-5" />}
                        required
                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock className="w-5 h-5" />}
                        required
                    />

                    <div className="flex items-center justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <AuthButton type="submit" loading={loading}>
                        Sign In
                    </AuthButton>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />

                <p className="mt-6 text-center text-sm text-zinc-600">
                    Don't have an account?{' '}
                    <Link
                        href="/signup"
                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </AuthCard>
        </div>
    );
}

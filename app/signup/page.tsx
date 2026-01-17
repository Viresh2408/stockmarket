'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, TrendingUp, Check, X } from 'lucide-react';
import { AuthCard } from '@/components/ui/auth/auth-card';
import { AuthInput } from '@/components/ui/auth/auth-input';
import { AuthButton } from '@/components/ui/auth/auth-button';
import { GoogleButton } from '@/components/ui/auth/social-button';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Password strength validation
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwordStrength < 3) {
            setError('Please create a stronger password');
            return;
        }

        setLoading(true);

        try {
            await signUpWithEmail(email, password, name);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setGoogleLoading(true);

        try {
            await signInWithGoogle();
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up with Google');
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
                            <span className="font-semibold">TSLA</span>
                            <span className="text-emerald-200">+4.2%</span>
                            <span className="mx-4">•</span>
                            <span className="font-semibold">NVDA</span>
                            <span className="text-emerald-200">+5.1%</span>
                            <span className="mx-4">•</span>
                            <span className="font-semibold">AMD</span>
                            <span className="text-emerald-200">+2.8%</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <AuthCard
                title="Create Account"
                subtitle="Start tracking your investments today"
            >
                <form onSubmit={handleEmailSignUp} className="space-y-5">
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
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<User className="w-5 h-5" />}
                        required
                    />

                    <AuthInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="w-5 h-5" />}
                        required
                    />

                    <div>
                        <AuthInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="w-5 h-5" />}
                            required
                        />

                        {/* Password strength indicator */}
                        {password && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 space-y-2"
                            >
                                <div className="flex gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength
                                                    ? passwordStrength === 4
                                                        ? 'bg-emerald-500'
                                                        : passwordStrength === 3
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                    : 'bg-zinc-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                        {passwordChecks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>8+ characters</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordChecks.uppercase ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                        {passwordChecks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>Uppercase</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordChecks.lowercase ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                        {passwordChecks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>Lowercase</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordChecks.number ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                        {passwordChecks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>Number</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <AuthInput
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={<Lock className="w-5 h-5" />}
                        error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                        required
                    />

                    <AuthButton type="submit" loading={loading}>
                        Create Account
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

                <GoogleButton onClick={handleGoogleSignUp} loading={googleLoading} />

                <p className="mt-6 text-center text-sm text-zinc-600">
                    Already have an account?{' '}
                    <Link
                        href="/signin"
                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </AuthCard>
        </div>
    );
}

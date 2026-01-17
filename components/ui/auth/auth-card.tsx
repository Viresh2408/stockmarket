'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
        >
            {/* Glassmorphic card */}
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-10">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/20 -z-10" />

                {title && (
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-zinc-600 text-sm md:text-base">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {children}
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 -z-20 blur-3xl opacity-30">
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-emerald-500 rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-teal-500 rounded-full" />
            </div>
        </motion.div>
    );
};

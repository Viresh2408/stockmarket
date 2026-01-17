'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    loading = false,
    variant = 'primary',
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = `
    relative w-full rounded-xl px-6 py-3.5 font-semibold
    transition-all duration-300 disabled:cursor-not-allowed
    disabled:opacity-50 overflow-hidden group
  `;

    const variantStyles = {
        primary: `
      bg-gradient-to-r from-emerald-600 to-teal-600
      text-white shadow-lg shadow-emerald-500/30
      hover:shadow-xl hover:shadow-emerald-500/40
      hover:from-emerald-500 hover:to-teal-500
      active:scale-[0.98]
    `,
        secondary: `
      bg-white/80 text-zinc-900 border-2 border-zinc-200
      backdrop-blur-sm hover:bg-white hover:border-zinc-300
      active:scale-[0.98]
    `,
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

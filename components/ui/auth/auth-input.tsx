'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className="relative w-full">
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        placeholder=" "
                        className={`
              peer w-full rounded-xl border-2 bg-white/50 px-4 py-3.5
              ${icon ? 'pl-12' : 'pl-4'}
              text-zinc-900 placeholder-transparent backdrop-blur-sm
              transition-all duration-300
              focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10
              ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-zinc-200 hover:border-zinc-300'}
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
                    />
                    <label
                        className={`
              absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500
              transition-all duration-300 pointer-events-none
              ${icon ? 'peer-placeholder-shown:left-12' : 'peer-placeholder-shown:left-4'}
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
              peer-focus:left-4 peer-focus:top-0 peer-focus:bg-white
              peer-focus:px-2 peer-focus:text-xs peer-focus:text-emerald-600
              ${props.value || props.defaultValue ? 'left-4 top-0 bg-white px-2 text-xs' : ''}
              ${error ? 'peer-focus:text-red-600' : ''}
            `}
                    >
                        {label}
                    </label>
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-600 px-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);

AuthInput.displayName = 'AuthInput';

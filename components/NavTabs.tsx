'use client';

import { motion } from 'framer-motion';
import { Home, Search, Star } from 'lucide-react';

export type TabType = 'home' | 'search' | 'watchlist';

interface NavTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
    const tabs = [
        { id: 'home' as TabType, label: 'Home', icon: Home },
        { id: 'search' as TabType, label: 'Search', icon: Search },
        { id: 'watchlist' as TabType, label: 'Watchlist', icon: Star },
    ];

    return (
        <div className="sticky top-[73px] z-40 border-b border-white/5 bg-zinc-900/80 backdrop-blur-xl">
            <div className="max-w-[100rem] mx-auto px-6 lg:px-8">
                <div className="flex gap-2 py-4">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className="relative group"
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Button content */}
                                <div className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? 'text-emerald-400'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                    <span className="font-semibold">{tab.label}</span>
                                </div>

                                {/* Hover glow */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

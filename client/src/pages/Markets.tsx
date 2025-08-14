
import React from 'react';
import { Activity } from "lucide-react";

export default function Markets() {
    return (
        <div className="min-h-screen bg-[#0B0E11] text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Markets
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Discover market stats and analytics to make informed trading decisions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <Activity className="w-12 h-12 text-green-500 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Market Overview</h2>
                        <p className="text-gray-400">Track key market trends and stats.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


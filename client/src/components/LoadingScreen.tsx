import { useState, useEffect } from "react";
import { TrendingUp, Shield, Zap, Activity } from "lucide-react";

interface LoadingScreenProps {
  isVisible?: boolean;
  message?: string;
  progress?: number;
}

export default function LoadingScreen({
  isVisible = true,
  message = "Loading your financial future...",
  progress = 0
}: LoadingScreenProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = [
    "Securing your connection...",
    "Loading market data...",
    "Preparing your dashboard...",
    "Initializing trading platform...",
    "Ready to trade!"
  ];

  const features = [
    { icon: TrendingUp, text: "Real-time market data", color: "text-green-400" },
    { icon: Shield, text: "Bank-grade security", color: "text-blue-400" },
    { icon: Zap, text: "Lightning-fast execution", color: "text-yellow-400" },
    { icon: Activity, text: "24/7 global markets", color: "text-purple-400" }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const progressInterval = setInterval(() => {
      setCurrentProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 95);
        return newProgress;
      });
    }, 200);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isVisible, loadingMessages.length]);

  useEffect(() => {
    if (progress > 0) {
      setCurrentProgress(progress);
    }
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-6 text-center">
        {/* Logo and brand */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-2xl">
            <img
              src="/src/assets/bitpanda-logo.svg"
              alt="BITPANDA PRO"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            BITPANDA PRO
          </h1>
          <p className="text-slate-400 text-lg">Europe's #1 Crypto Trading Platform</p>
        </div>

        {/* Animated loading spinner */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-slate-700 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-slate-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-80 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300 text-sm font-medium">
              {message || loadingMessages[currentMessageIndex]}
            </span>
            <span className="text-green-400 text-sm font-mono">
              {Math.round(currentProgress)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${currentProgress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 backdrop-blur border border-slate-700/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-slate-300 text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Connecting to secure servers...</span>
        </div>
      </div>

      {/* Corner branding */}
      <div className="absolute bottom-6 left-6 text-slate-500 text-xs">
        <p>Regulated by Austrian Financial Market Authority (FMA)</p>
      </div>

      <div className="absolute bottom-6 right-6 text-slate-500 text-xs">
        <p>© 2024 BITPANDA PRO Technology GmbH</p>
      </div>
    </div>
  );
}
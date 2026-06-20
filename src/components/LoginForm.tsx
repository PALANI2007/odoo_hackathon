"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import confetti from "canvas-confetti";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // High-fidelity success confetti explosion
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#7C3AED", "#06B6D4", "#8B5CF6", "#10B981"],
      });
      
      setTimeout(() => {
        setIsSuccess(false);
        setEmail("");
        setPassword("");
      }, 3000);

    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-[480px] p-8 md:p-10 glass-panel rounded-3xl relative overflow-hidden"
    >
      {/* Decorative internal mesh glow colors */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Header and 3D Cube branding */}
      <div className="flex flex-col items-center mb-8 text-center">
        {/* Floating 3D Cube SVG */}
        <div className="relative w-16 h-16 mb-4 animate-float-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <g transform="translate(50, 48)">
              {/* Rotating Cube structure */}
              <g className="animate-spin" style={{ animationDuration: "14s", transformOrigin: "center" }}>
                {/* Top face */}
                <polygon 
                  points="0,-24 24,-10 0,4 -24,-10" 
                  fill="rgba(124, 58, 237, 0.75)" 
                  stroke="#8B5CF6" 
                  strokeWidth="1.5"
                />
                {/* Left face */}
                <polygon 
                  points="-24,-10 0,4 0,32 -24,18" 
                  fill="rgba(109, 40, 217, 0.85)" 
                  stroke="#7C3AED" 
                  strokeWidth="1.5"
                />
                {/* Right face */}
                <polygon 
                  points="0,4 24,-10 24,18 0,32" 
                  fill="rgba(91, 33, 182, 0.95)" 
                  stroke="#7C3AED" 
                  strokeWidth="1.5"
                />
                {/* Inner glowing particle core */}
                <circle cx="0" cy="4" r="5.5" fill="#06B6D4" filter="blur(2.5px)" />
              </g>
            </g>
          </svg>
          
          <div className="absolute inset-0 scale-75 border-2 border-dashed border-cyan-500/30 rounded-full animate-ping" style={{ animationDuration: "3.5s" }}></div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight font-display text-white">
          ERP <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">NEXUS</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1.5 font-medium">
          Welcome back. Enter your credentials to access the node.
        </p>
      </div>

      {/* Login Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email Field */}
        <div className="relative">
          <input
            id="email-field"
            type="email"
            required
            className="w-full px-5 py-4 pl-12 bg-slate-950/60 border border-white/10 rounded-2xl text-white font-sans text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300 placeholder-slate-600"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSuccess}
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 focus-within:text-cyan-400 pointer-events-none" />
          <label 
            htmlFor="email-field"
            className="absolute left-4 -top-2.5 px-2 text-[9px] font-extrabold uppercase tracking-widest text-cyan-400 bg-[#030712] border border-cyan-500/20 rounded-md"
          >
            Email Address
          </label>
        </div>

        {/* Password Field */}
        <div className="relative">
          <input
            id="password-field"
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-5 py-4 pl-12 pr-12 bg-slate-950/60 border border-white/10 rounded-2xl text-white font-sans text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/25 transition-all duration-300 placeholder-slate-600"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || isSuccess}
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isSuccess}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <label 
            htmlFor="password-field"
            className="absolute left-4 -top-2.5 px-2 text-[9px] font-extrabold uppercase tracking-widest text-purple-400 bg-[#030712] border border-purple-500/20 rounded-md"
          >
            Password
          </label>
        </div>

        {/* Checkbox and Forgot Link */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
            <input 
              type="checkbox" 
              className="accent-primary w-4 h-4 bg-slate-900 border-white/10 rounded"
              disabled={isLoading || isSuccess} 
            />
            <span>Remember me</span>
          </label>
          <a
            href="#forgot"
            className="text-purple-400 hover:text-cyan-400 transition-colors font-semibold"
          >
            Forgot Password?
          </a>
        </div>

        {/* Action Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-display font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
          disabled={isLoading || isSuccess}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Decrypting Node...</span>
            </div>
          ) : isSuccess ? (
            <span>Access Granted</span>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <LogIn className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">or sign in with</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        {/* OAuth buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/12 text-white font-sans text-xs font-semibold rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-[1px]"
            disabled={isLoading || isSuccess}
            onClick={() => confetti({ particleCount: 30, spread: 40 })}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>
          
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/12 text-white font-sans text-xs font-semibold rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-[1px]"
            disabled={isLoading || isSuccess}
            onClick={() => confetti({ particleCount: 30, spread: 40 })}
          >
            <svg className="w-4 h-4" viewBox="0 0 23 23" fill="currentColor">
              <rect x="0" y="0" width="11" height="11" fill="#F25022"/>
              <rect x="12" y="0" width="11" height="11" fill="#7FBA00"/>
              <rect x="0" y="12" width="11" height="11" fill="#00A4EF"/>
              <rect x="12" y="12" width="11" height="11" fill="#FFB900"/>
            </svg>
            <span>Microsoft</span>
          </button>
        </div>

        {/* Create Account Link */}
        <div className="text-center text-xs text-slate-400">
          Don't have an enterprise account?{" "}
          <a href="#register" className="text-cyan-400 font-bold hover:text-purple-400 transition-colors hover:underline">
            Request Access
          </a>
        </div>

      </form>
    </motion.div>
  );
};

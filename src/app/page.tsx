import React from "react";
import { BackgroundMesh } from "@/components/BackgroundMesh";
import { IsometricFactory } from "@/components/IsometricFactory";
import { LoginForm } from "@/components/LoginForm";
import { ShieldCheck, HelpCircle, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* Animated Canvas & Grid System Background */}
      <BackgroundMesh />

      {/* Top Header Navigation */}
      <header className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="font-black text-white text-base font-display">N</span>
          </div>
          <span className="font-extrabold text-xl tracking-wide font-display text-white">
            ERP <span className="text-cyan-400">NEXUS</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Active status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/60 border border-emerald-500/25 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <Activity className="text-emerald-400 w-3 h-3 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-display">System Node Online</span>
          </div>
          
          <a 
            href="#help" 
            className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1 font-semibold"
          >
            <HelpCircle size={15} />
            <span>Support</span>
          </a>
        </div>
      </header>

      {/* Main Content Area (60% / 40% Split Screen Layout) */}
      <main className="w-full flex-1 max-w-[1440px] mx-auto px-6 md:px-12 py-4 grid grid-cols-1 lg:grid-cols-10 gap-8 items-center z-10">
        
        {/* Left Section (60%): Illustrated Isometric Factory & Live Analytics */}
        <div className="lg:col-span-6 hidden lg:flex flex-col items-center justify-start py-4">
          <div className="text-left w-full max-w-[620px] mb-2 px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 font-display">Enterprise ERP Ecosystem</span>
            <h2 className="text-3xl xl:text-4xl font-extrabold font-display leading-tight tracking-tight text-white mt-1">
              Synchronize operations with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
                Nexus Intelligence
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Unlock cognitive orchestration across supply-chain, assembly, and sales funnels. Experience automated material reordering, live metric trace, and predictive AI workloads in a single unified node.
            </p>
          </div>

          <IsometricFactory />
        </div>

        {/* Right Section (40%): Glassmorphic Credentials Login Card */}
        <div className="lg:col-span-4 flex items-center justify-center w-full py-4">
          <LoginForm />
        </div>

      </main>

      {/* Footer System Details */}
      <footer className="w-full z-10 bg-slate-950/20 border-t border-white/[0.02]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-slate-500 text-[10px] font-bold">
          <div className="flex items-center gap-1.5 tracking-wider">
            <ShieldCheck className="text-cyan-500 w-4 h-4" />
            <span>AES-256 END-TO-END SUPPLY CHAIN DATA SECURED</span>
          </div>
          <div className="flex items-center gap-5 tracking-wider">
            <span>© 2026 ERP NEXUS INC.</span>
            <a href="#terms" className="hover:text-slate-300 transition-colors uppercase">Terms</a>
            <a href="#privacy" className="hover:text-slate-300 transition-colors uppercase">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

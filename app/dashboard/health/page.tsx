'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Heart, Coins, CheckCircle2, TrendingUp, TrendingDown, Sparkles, Activity, ShieldCheck
} from 'lucide-react'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

const healthHistoryData = [
  { month: 'Jan', Score: 85 },
  { month: 'Feb', Score: 88 },
  { month: 'Mar', Score: 87 },
  { month: 'Apr', Score: 90 },
  { month: 'May', Score: 92 },
  { month: 'Jun', Score: 94 }
]

export default function HealthPage() {
  const { user } = useAuth()
  
  // Hydration safety
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Executive Command Shield
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Business Health Scorecard 💚
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit general operational efficiency indexes, financial structures, and AI strategic risk forecasting.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Health Gauge & Details (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Business Health Gauge Card */}
          <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="url(#healthGrad)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * 94) / 100}
                />
                <defs>
                  <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-white">94</span>
                <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest block mt-0.5">Health Index</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">Optimal</span>
              <h2 className="text-lg font-black text-white">General Business Operations Health is highly optimal.</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Aggregate database analysis indicates that the organization operates at 94% efficiency. Financial flows, quality margins, and supplier delivery scores are aligned with high-performance parameters.
              </p>
            </div>
          </div>

          {/* Recharts Area Chart: Health Trend */}
          <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">6-Month Business Health score progression</h3>
            <div className="h-[200px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthHistoryData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}
                      labelStyle={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}
                      itemStyle={{ fontSize: 10, fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="Score" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Operations Health Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Financial Health', percent: 95, value: '₹28,30,000 Revenue', icon: <Coins className="w-4 h-4 text-purple-400" /> },
              { title: 'Production Health', percent: 84, value: '84% Yield rate', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
              { title: 'Procurement Health', percent: 96, value: '94.6% Supplier rating', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
              { title: 'Inventory Health', percent: 92, value: '₹6,49,000 Valuation', icon: <Heart className="w-4 h-4 text-red-400" /> }
            ].map((node) => (
              <div key={node.title} className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    {node.icon}
                    {node.title}
                  </span>
                  <span className="text-xs font-black text-white">{node.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${node.percent}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 font-normal">{node.value}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: AI Strategic Recommendations (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI CEO Recommendations
            </h3>

            <div className="space-y-4 text-xs font-bold leading-normal">
              <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-purple-400 block mb-1">Growth Forecast</span>
                <p className="text-[10px] text-slate-300 font-normal">
                  Predictive analysis shows a 14.8% growth in sales margins for Q3. Accelerate production schedules for high-LTV items.
                </p>
              </div>

              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-cyan-400 block mb-1">Supply Risk Vetted</span>
                <p className="text-[10px] text-slate-300 font-normal">
                  Diverting varnish raw materials to Astro Coatings saves ₹3,150 and reduces ETA risk by 33%.
                </p>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-emerald-400 block mb-1">Preventive Task Alert</span>
                <p className="text-[10px] text-slate-300 font-normal">
                  Schedule calibrations on assembly Line-A to resolve temperature spikes and ensure zero-defect scrap yields.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

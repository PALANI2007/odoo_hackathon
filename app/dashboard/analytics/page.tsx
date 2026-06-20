'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  BarChart3, Sparkles, CheckCircle2, TrendingUp, TrendingDown, Coins, Target, Award
} from 'lucide-react'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell
} from 'recharts'

const monthlyFinancialData = [
  { month: 'Jan', Revenue: 280000, Profit: 120000 },
  { month: 'Feb', Revenue: 310000, Profit: 135000 },
  { month: 'Mar', Revenue: 290000, Profit: 110000 },
  { month: 'Apr', Revenue: 340000, Profit: 155000 },
  { month: 'May', Revenue: 320000, Profit: 140000 },
  { month: 'Jun', Revenue: 380000, Profit: 165000 }
]

const departmentSalesData = [
  { name: 'Wooden Chairs', value: 345000, color: '#7C3AED' },
  { name: 'Dining Tables', value: 188000, color: '#06B6D4' },
  { name: 'Fabric Sofas', value: 249000, color: '#22C55E' },
  { name: 'Office Bookshelves', value: 123000, color: '#F59E0B' }
]

export default function AnalyticsPage() {
  const { user } = useAuth()
  
  // Hydration safety
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Nexus ERP Intelligence
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Analytics Command Center 📉
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze corporate profit margins, revenue distributions, and AI business growth forecasting.
          </p>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Gross Corporate Revenue', value: '₹28,30,000', desc: 'Combined sales ledger value', color: 'border-purple-500/25', icon: <Coins className="w-4 h-4 text-purple-400" /> },
          { title: 'Gross Corporate Profit', value: '₹12,20,000', desc: 'Net business margins', color: 'border-emerald-500/25', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
          { title: 'Operating Profit Margin', value: '43.1%', desc: 'Yield efficiency index', color: 'border-cyan-500/25', icon: <Target className="w-4 h-4 text-cyan-400 animate-pulse" /> },
          { title: 'Total Sales Invoiced', value: '603 SOs', desc: 'Sealed sales order logs', color: 'border-blue-500/25', icon: <Award className="w-4 h-4 text-blue-400" /> }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, translateY: -2 }}
            className={`bg-white/[0.02] border ${kpi.color} p-5 rounded-2xl relative overflow-hidden transition-all duration-300 backdrop-blur-xl`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{kpi.value}</div>
            <span className="text-[9px] text-slate-500 block mt-1 leading-normal">{kpi.desc}</span>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 z-10 relative">
        
        {/* Left Column: Combined Revenue/Profit line-bar Recharts chart (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Monthly Financial Revenue vs Profit</h3>
          <div className="h-[250px] w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFinancialData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}
                    labelStyle={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: 10, fontWeight: 'bold' }}
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Gross Revenue" />
                  <Area type="monotone" dataKey="Profit" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" name="Net Profit" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Column: Product Performance (Span 4) */}
        <div className="lg:col-span-4 bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Product Category Revenue Net</h3>
          <div className="h-[250px] w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentSalesData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 8, fontWeight: 'bold' }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                  />
                  <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]}>
                    {departmentSalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Layout: AI Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Product Sales Breakdown (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden p-6">
          <h3 className="font-extrabold text-sm text-white mb-4">Product Valuation Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-slate-900/10 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Allocated Bins</th>
                  <th className="p-3">Movement Velocity</th>
                  <th className="p-3 text-right">Net Sales Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs font-bold text-slate-300">
                {[
                  { name: 'Wooden Chairs', bin: 'Bin-01/Bin-02', velocity: '+14% Inbound', revenue: 345000 },
                  { name: 'Dining Tables', bin: 'Bin-03/Bin-04', velocity: '+8% Outbound', revenue: 188000 },
                  { name: 'Fabric Sofas', bin: 'Bin-05/Bin-06', velocity: '+12% Inbound', revenue: 249000 },
                  { name: 'Office Bookshelves', bin: 'Bin-07', velocity: '+5% Outbound', revenue: 123000 }
                ].map((item) => (
                  <tr key={item.name} className="hover:bg-white/[0.01]">
                    <td className="p-3 text-white font-extrabold">{item.name}</td>
                    <td className="p-3 text-slate-400 font-normal">{item.bin}</td>
                    <td className="p-3 text-cyan-400">{item.velocity}</td>
                    <td className="p-3 text-right text-emerald-400">₹{item.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Executive prognosis summary (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Business Forecast
            </h3>
            
            <div className="space-y-4 text-xs font-bold leading-normal">
              <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-purple-400 block mb-1">ARIMA Demand Forecast</span>
                <p className="text-[10px] text-slate-300 font-normal">
                  Sales volumes are forecast to surge by 25% for Wooden Chairs in Q3. Restock buffers to prevent production deficits.
                </p>
              </div>

              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-cyan-400 block mb-1">Profit Margins Prognosis</span>
                <p className="text-[10px] text-slate-300 font-normal">
                  Transitioning paint varnish supplier to Astro Coatings yields an estimated net margin increase of +1.8% next month.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

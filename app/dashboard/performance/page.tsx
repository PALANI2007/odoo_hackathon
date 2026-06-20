'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Users, Activity, CheckCircle2, Sparkles, Target, Award, Coins, TrendingUp
} from 'lucide-react'
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

interface DepartmentMetric {
  name: string
  efficiency: number // %
  sla: number // %
  headcount: number
  targetMet: number // %
}

interface TopPerformer {
  id: string
  name: string
  role: string
  department: string
  rating: number // out of 5
  score: number // efficiency score %
}

const departmentMetrics: DepartmentMetric[] = [
  { name: 'Sales', efficiency: 98, sla: 99, headcount: 15, targetMet: 104 },
  { name: 'Inventory', efficiency: 92, sla: 94, headcount: 8, targetMet: 96 },
  { name: 'Manufacturing', efficiency: 84, sla: 95, headcount: 22, targetMet: 88 },
  { name: 'Procurement', efficiency: 96, sla: 98, headcount: 5, targetMet: 102 },
  { name: 'Administration', efficiency: 95, sla: 100, headcount: 4, targetMet: 100 }
]

const topPerformers: TopPerformer[] = [
  { id: 'EMP-01', name: 'Marcus Johnson', role: 'Sales Executive', department: 'Sales', rating: 4.9, score: 98 },
  { id: 'EMP-02', name: 'Priya Patel', role: 'Procurement Manager', department: 'Procurement', rating: 4.8, score: 96 },
  { id: 'EMP-03', name: 'David Kim', role: 'Operations Inspector', department: 'Operations', rating: 4.7, score: 95 },
  { id: 'EMP-04', name: 'Elena Rodriguez', role: 'Inventory Manager', department: 'Warehouse', rating: 4.8, score: 92 },
  { id: 'EMP-05', name: 'Sarah Chen', role: 'Executive Assistant', department: 'Administration', rating: 4.9, score: 99 }
]

export default function PerformancePage() {
  const { user } = useAuth()
  
  // Hydration safety
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Dynamic calculations
  const stats = useMemo(() => {
    const totalHeadcount = departmentMetrics.reduce((acc, d) => acc + d.headcount, 0)
    const avgEfficiency = Math.round(departmentMetrics.reduce((acc, d) => acc + d.efficiency, 0) / departmentMetrics.length)
    const avgSla = Math.round(departmentMetrics.reduce((acc, d) => acc + d.sla, 0) / departmentMetrics.length)

    return {
      headcount: totalHeadcount,
      efficiency: avgEfficiency,
      sla: avgSla
    }
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
            Corporate Command Center
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Department Performance Analytics ⚡
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze department SLA completions, team sizes, yield indicators, and employee efficiency metrics.
          </p>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Total Enterprise Headcount', value: stats.headcount, desc: 'Active company employees', color: 'border-slate-500/25', icon: <Users className="w-4 h-4 text-slate-400" /> },
          { title: 'Aggregate Efficiency Score', value: `${stats.efficiency}%`, desc: 'Average department productivity rate', color: 'border-purple-500/25', icon: <Activity className="w-4 h-4 text-purple-400 animate-pulse" /> },
          { title: 'Enterprise SLA Compliance', value: `${stats.sla}%`, desc: 'Corporate milestone fulfillment rate', color: 'border-cyan-500/25', icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" /> },
          { title: 'Revenue Per Employee', value: '₹4.5L', desc: 'Normalized productivity index', color: 'border-emerald-500/25', icon: <Coins className="w-4 h-4 text-emerald-400" /> }
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

      {/* Recharts Bar Chart: Department Comparisons */}
      <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl mb-8 z-10 relative">
        <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Department Metrics Comparison (Efficiency vs SLA vs Target Met)</h3>
        <div className="h-[250px] w-full">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentMetrics} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}
                  labelStyle={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: 10, fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="efficiency" fill="#7C3AED" name="Efficiency %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sla" fill="#06B6D4" name="SLA %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="targetMet" fill="#22C55E" name="Target Met %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Main Grid: Team Leaderboard & AI Performance Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Top Performers Table (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden p-6">
          <h3 className="font-extrabold text-sm text-white mb-4">Enterprise Top Performers</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-slate-900/10 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role / Department</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Yield Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs font-bold text-slate-300">
                {topPerformers.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.01]">
                    <td className="p-3 font-mono text-[10px] text-cyan-400">{emp.id}</td>
                    <td className="p-3 text-white font-extrabold">{emp.name}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span>{emp.role}</span>
                        <span className="text-[9px] text-slate-500 font-normal mt-0.5">{emp.department}</span>
                      </div>
                    </td>
                    <td className="p-3 text-amber-400">★ {emp.rating}</td>
                    <td className="p-3 text-right text-emerald-400">{emp.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Performance Widget (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Performance Analysis
            </h3>

            <div className="space-y-4 text-xs font-bold leading-normal">
              <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-purple-400 block mb-1">Top Department: Sales</span>
                <p className="text-[10px] text-slate-300 font-normal">
                  Sales department lead the target fulfillment at 104%, driven by Ramesh Nair's B2B contract closures.
                </p>
              </div>

              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-cyan-400 block mb-1">Bottleneck Warning: Manufacturing</span>
                <p className="text-[10px] text-slate-300 font-normal">
                  Manufacturing yield is currently at 88% against target, due to workorder calib delays on Line-A. Recommend scheduling service workorders immediately.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

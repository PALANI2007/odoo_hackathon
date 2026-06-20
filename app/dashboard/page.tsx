'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth, User } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  ShoppingCart, ShieldAlert, Mic, TrendingUp, TrendingDown, 
  Truck, Star, Award, Activity, CheckCircle2, AlertTriangle, 
  ArrowRight, ChevronUp, ChevronDown, Zap, BarChart3, 
  Coins, FileCheck, RefreshCw, Layers, ShieldCheck, HelpCircle, 
  User as UserIcon, Check, X, Search, Info, Cpu, Send, Database, Compass, Eye, Users,
  Sparkles, Target, Wrench, Briefcase, Shield, Clock
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line 
} from 'recharts'

// ==========================================
// MOCK DATA FOR ENTERPRISE SYSTEM
// ==========================================

const demandForecastData = [
  { month: 'Jan', tables: 120, chairs: 90 },
  { month: 'Feb', tables: 150, chairs: 110 },
  { month: 'Mar', tables: 140, chairs: 95 },
  { month: 'Apr', tables: 180, chairs: 140 },
  { month: 'May', tables: 200, chairs: 150 },
  { month: 'Jun', tables: 240, chairs: 180 }
]

const revenueTrendData = [
  { month: 'Jan', revenue: 1550000 },
  { month: 'Feb', revenue: 1850000 },
  { month: 'Mar', revenue: 1720000 },
  { month: 'Apr', revenue: 2100000 },
  { month: 'May', revenue: 1980000 },
  { month: 'Jun', revenue: 2350000 }
]

const inventoryDistributionPie = [
  { name: 'Chairs', value: 180, color: '#7C3AED' },
  { name: 'Tables', value: 110, color: '#06B6D4' },
  { name: 'Sofas', value: 85, color: '#22C55E' },
  { name: 'Beds', value: 50, color: '#F59E0B' },
  { name: 'Wardrobes', value: 25, color: '#EF4444' }
]

const inventoryMovementsData = [
  { month: 'Jan', Inbound: 320, Outbound: 240 },
  { month: 'Feb', Inbound: 400, Outbound: 290 },
  { month: 'Mar', Inbound: 350, Outbound: 310 },
  { month: 'Apr', Inbound: 450, Outbound: 380 },
  { month: 'May', Inbound: 420, Outbound: 390 },
  { month: 'Jun', Inbound: 480, Outbound: 435 }
]

const monthlyFinancialData = [
  { month: 'Jan', Revenue: 15500000, Profit: 8200000 },
  { month: 'Feb', Revenue: 18500000, Profit: 9800000 },
  { month: 'Mar', Revenue: 17200000, Profit: 9100000 },
  { month: 'Apr', Revenue: 21000000, Profit: 11100000 },
  { month: 'May', Revenue: 19800000, Profit: 10500000 },
  { month: 'Jun', Revenue: 23500000, Profit: 12500000 }
]

// ==========================================
// PRIMARY ROUTING COMPONENT
// ==========================================

export default function DashboardRouter() {
  const { user } = useAuth()

  if (!user) return null

  // Branch dashboard dynamically depending on user role
  if (user.role === 'inventory') {
    return <InventoryManagerDashboard user={user} />
  }
  if (user.role === 'sales') {
    return <SalesDashboard user={user} />
  }
  if (user.role === 'purchase') {
    return <ProcurementDashboard user={user} />
  }
  if (user.role === 'manufacturing') {
    return <ManufacturingDashboard user={user} />
  }
  if (user.role === 'business_owner') {
    return <ExecutiveDashboard user={user} />
  }
  
  // Default Admin Dashboard
  return <AdminDashboard user={user} />
}

// ==========================================
// 1. ADMIN DASHBOARD OVERVIEW
// ==========================================

function AdminDashboard({ user }: { user: User }) {
  const [isMounted, setIsMounted] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [factoryUnits, setFactoryUnits] = useState([
    { name: 'Assembly', status: 'Running', efficiency: '96%', operator: 'Node-10', heat: 'Nominal' },
    { name: 'Painting', status: 'Running', efficiency: '95%', operator: 'Node-04', heat: 'Nominal' },
    { name: 'Packing', status: 'Running', efficiency: '98%', operator: 'Node-12', heat: 'Nominal' },
    { name: 'Quality Check', status: 'Idle', efficiency: '99%', operator: 'Node-02', heat: 'Low' }
  ])

  useEffect(() => {
    setIsMounted(true)

    const fetchAdminStats = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('id, name, email, role, created_at')
          .order('created_at', { ascending: false })
        if (data) setUsers(data)
      } catch (err) {
        console.error('Failed to fetch admin stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminStats()
  }, [])

  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter(u => !u.role.startsWith('deactivated_')).length
    
    const departments = new Set()
    const roleCounts: Record<string, number> = {
      admin: 0,
      owner: 0,
      sales: 0,
      purchase: 0,
      manufacturing: 0,
      inventory: 0
    }

    users.forEach(u => {
      let r = u.role
      if (r.startsWith('deactivated_')) {
        r = r.replace('deactivated_', '')
      }
      departments.add(r)
      if (roleCounts[r] !== undefined) {
        roleCounts[r]++
      }
    })

    return {
      total,
      active,
      departments: departments.size,
      roleCounts,
      recent: users.slice(0, 4)
    }
  }, [users])

  const getRoleBadgeStyle = (role: string) => {
    let baseRole = role
    if (baseRole.startsWith('deactivated_')) {
      baseRole = baseRole.replace('deactivated_', '')
    }

    switch (baseRole) {
      case 'admin':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
      case 'owner':
      case 'business_owner':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
      case 'sales':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
      case 'purchase':
        return 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
      case 'manufacturing':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
      case 'inventory':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
      default:
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      {/* Neo Highlights */}
      <div className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            Enterprise Control Command Engine
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
            ERP NEXUS COMMAND CORE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active session: <strong className="text-white">{user.name}</strong> ({user.role.replace('_', ' ').toUpperCase()}) | Odoo DB Sync Online.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/60 border border-emerald-500/25 px-3.5 py-2 rounded-xl backdrop-blur-md text-[10px] font-extrabold uppercase">
            <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Odoo DB Handshake: Secure</span>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Total Revenue', val: '₹2,35,00,000', icon: <Coins className="w-4 h-4 text-purple-400" />, delta: '+14.8%', deltaColor: 'text-emerald-400' },
          { title: 'Inventory Value', val: '₹5,42,00,000', icon: <Layers className="w-4 h-4 text-green-400" />, delta: 'Optimized', deltaColor: 'text-emerald-400' },
          { title: 'Health Index', val: '92 / 100', icon: <Zap className="w-4 h-4 text-cyan-400" />, delta: 'Optimal', deltaColor: 'text-emerald-400' },
          { title: 'Total Users', val: isLoading ? '...' : stats.total, icon: <Users className="w-4 h-4 text-purple-400" />, delta: 'Provisioned', deltaColor: 'text-purple-400' },
          { title: 'Active Users', val: isLoading ? '...' : stats.active, icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, delta: 'Validated', deltaColor: 'text-emerald-400' },
          { title: 'Departments', val: isLoading ? '...' : stats.departments, icon: <Briefcase className="w-4 h-4 text-cyan-400" />, delta: 'Active Groups', deltaColor: 'text-cyan-300' }
        ].map((kpi) => (
          <div key={kpi.title} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl transition-all duration-300">
            <div className="flex justify-between items-start text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-xl font-black text-white">{kpi.val}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.03]">
              <span className={`text-[9px] font-bold ${kpi.deltaColor}`}>{kpi.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        {/* Left Column (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Health Vitals */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-purple-400" />
              Business Health Vitals
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#7C3AED" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.92)} />
                </svg>
                <div className="absolute flex flex-col items-center text-center"><span className="text-xl font-black text-white">92</span></div>
              </div>
              <div className="space-y-1 text-[10px] font-bold uppercase">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-slate-400">Sales: Nominal</span></div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-slate-400">Inventory: Healthy</span></div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-slate-400">Operations: Stable</span></div>
              </div>
            </div>
          </div>

          {/* Department Role Distribution */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-purple-400" />
              Security Role Distribution
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Admin', key: 'admin', color: 'bg-purple-500' },
                { name: 'Owner', key: 'owner', color: 'bg-amber-500' },
                { name: 'Sales', key: 'sales', color: 'bg-blue-500' },
                { name: 'Procurement', key: 'purchase', color: 'bg-orange-500' },
                { name: 'Operations', key: 'manufacturing', color: 'bg-emerald-500' },
                { name: 'Warehouse', key: 'inventory', color: 'bg-cyan-500' }
              ].map((role) => {
                const count = stats.roleCounts[role.key] || 0
                const percent = stats.total > 0 ? (count / stats.total) * 100 : 0
                return (
                  <div key={role.key} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                      <span>{role.name}</span>
                      <span className="text-white font-extrabold">{count} Nodes</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div className={`h-full ${role.color}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle Column (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Digital Twin */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-purple-400" />
              Digital Twin Floor Status
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {factoryUnits.map((unit) => (
                <div key={unit.name} className="p-3 bg-slate-950/60 border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-bold text-white mb-2 uppercase">
                    <span>{unit.name} Unit</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded border border-emerald-500/20 text-emerald-400">{unit.status}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-2">Efficiency: <strong className="text-white">{unit.efficiency}</strong></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent User Activity logs */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent User Registrations
            </h2>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="text-xs text-slate-500 py-4 uppercase font-bold text-center">Auditing registers...</div>
              ) : stats.recent.length === 0 ? (
                <div className="text-xs text-slate-500 py-4 uppercase font-bold text-center">No recent records</div>
              ) : (
                <table className="w-full text-[10px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-slate-500 font-bold uppercase pb-2">
                      <th className="pb-2">User</th>
                      <th className="pb-2">Role</th>
                      <th className="pb-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {stats.recent.map((u: any) => {
                      const baseRoleName = u.role.startsWith('deactivated_') ? u.role.replace('deactivated_', '') : u.role
                      return (
                        <tr key={u.id} className="hover:bg-white/[0.01]">
                          <td className="py-2.5 font-bold text-white max-w-[120px] truncate">{u.name}</td>
                          <td className="py-2.5">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${getRoleBadgeStyle(u.role)}`}>
                              {baseRoleName === 'business_owner' ? 'owner' : baseRoleName}
                            </span>
                          </td>
                          <td className="py-2.5 text-right text-slate-500 font-bold">
                            {new Date(u.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Span 3) - Embedded AI Summary */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div className="bg-[#0b081e]/85 border border-purple-500/25 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Executive summary
            </h3>
            <div className="space-y-3.5 text-xs font-bold leading-normal">
              <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                <span className="text-[9px] uppercase font-black text-purple-400 block mb-1">ARIMA Growth Forecast</span>
                <p className="text-[10px] text-slate-300 font-normal leading-normal">
                  Corporate revenue model projects a 14.8% growth in Q3. Gross margin target set at 45% under optimized ABC Woods contract billing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. SALES DASHBOARD OVERVIEW
// ==========================================

function SalesDashboard({ user }: { user: User }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Sales Control Tower
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
            Sales Command Center 📈
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fulfill pipeline opportunities, optimize B2B conversion metrics, and evaluate gross invoice sales.
          </p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Total Sales Revenue', val: '₹18,50,000', icon: <Coins className="w-4 h-4 text-purple-400" />, delta: '+12.4% MoM' },
          { title: 'Active Leads Vetted', val: '342', icon: <Users className="w-4 h-4 text-cyan-400" />, delta: 'Active Pipeline' },
          { title: 'Lead-to-Deal Conversion', val: '32%', icon: <Target className="w-4 h-4 text-violet-400" />, delta: 'Optimal Index' },
          { title: 'Department target Met', val: '104%', icon: <Award className="w-4 h-4 text-emerald-400" />, delta: 'Exceeded Target' }
        ].map((kpi) => (
          <div key={kpi.title} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
            <div className="flex justify-between items-start text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-xl font-black text-white">{kpi.val}</div>
            <span className="text-[9px] text-slate-500 font-bold block mt-2">{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        {/* Left Column: AI Win Rate Gauge */}
        <div className="lg:col-span-4 bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-xl relative">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Lead Conversion Prediction
          </h3>
          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#7C3AED" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.88)} />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-white">88%</span>
                <span className="text-[8px] text-slate-400 uppercase font-black block mt-0.5">Win Prob</span>
              </div>
            </div>
            <div className="text-center mt-3 text-xs">
              <h4 className="text-white font-extrabold">Tata Steel Labs Opportunity</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-normal">
                Win probability calculated at 88%. AI recommendation: Finalize terms and schedule billing signatures immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column: AI Revenue Forecast Area Chart */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Sales Revenue Forecast (Q3 Projection)
          </h3>
          <div className="h-44 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`]} />
                  <Area type="monotone" dataKey="revenue" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 3. PROCUREMENT DASHBOARD OVERVIEW
// ==========================================

function ProcurementDashboard({ user }: { user: User }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Supply Chain Intelligence
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
            Procurement Control Center 💼
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit supplier scorecards, execute cryptographic handshakes, and track spending metrics.
          </p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Procurement Cost', val: '₹3,80,000', icon: <Coins className="w-4 h-4 text-purple-400" />, delta: '-4.2% Cost Cut' },
          { title: 'Active POs', val: '4 Orders', icon: <FileCheck className="w-4 h-4 text-cyan-400" />, delta: 'Vetting Pipeline' },
          { title: 'Vendor Rating Score', val: '94.6%', icon: <Award className="w-4 h-4 text-violet-400 animate-pulse" />, delta: 'Optimal index' },
          { title: 'AI Savings Generated', val: '₹54,300', icon: <Zap className="w-4 h-4 text-emerald-400" />, delta: '14.3% Optimized' }
        ].map((kpi) => (
          <div key={kpi.title} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
            <div className="flex justify-between items-start text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-xl font-black text-white">{kpi.val}</div>
            <span className="text-[9px] text-slate-500 font-bold block mt-2">{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        {/* Left Column: AI Vendor Recs */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-xl relative">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Vendor Recommendation
          </h3>
          <div className="p-4 bg-slate-950/50 rounded-xl border border-cyan-500/25 text-xs font-bold leading-normal space-y-3">
            <div>
              <span className="text-[8px] uppercase tracking-widest text-cyan-400 block mb-0.5">Wood Top Vetted Match</span>
              <span className="text-white text-md block font-extrabold">Oak & Timber Co</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-white/[0.05]">
              <span>Unit Price: <strong className="text-emerald-400">₹680</strong></span>
              <span>ETA: <strong className="text-white">2 Days</strong></span>
              <span>Quality Score: <strong className="text-white">98%</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Cost Optimization Tracker */}
        <div className="lg:col-span-7 bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Cost Optimization Analysis
          </h3>
          <div className="h-44 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`]} />
                  <Area type="monotone" dataKey="revenue" name="Procure Spend" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 4. MANUFACTURING DASHBOARD OVERVIEW
// ==========================================

function ManufacturingDashboard({ user }: { user: User }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Digital Twin Control
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
            Production Command Center 🏭
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch workorders, monitor line status telemetries, and inspect scrap yield ratios.
          </p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Active Mfg Orders', val: '18 Orders', icon: <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />, delta: 'Running Line' },
          { title: 'Workstation Availability', val: '96.5%', icon: <Activity className="w-4 h-4 text-cyan-400" />, delta: 'Optimal Telemetry' },
          { title: 'Mean Cycle Time', val: '4.2 Hrs', icon: <Wrench className="w-4 h-4 text-violet-400" />, delta: 'Speed index' },
          { title: 'Inspections Pass Rate', val: '99.2%', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, delta: 'Scrap Rate 0.8%' }
        ].map((kpi) => (
          <div key={kpi.title} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
            <div className="flex justify-between items-start text-slate-400 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-xl font-black text-white">{kpi.val}</div>
            <span className="text-[9px] text-slate-500 font-bold block mt-2">{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        {/* Left Column: AI Production Efficiency Score */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-xl relative">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Production Efficiency Score
          </h3>
          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22C55E" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.96)} />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-white">96%</span>
                <span className="text-[8px] text-slate-400 uppercase font-black block mt-0.5">Floor Yield</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Delay Prediction Widget */}
        <div className="lg:col-span-7 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Production Delay Forecast
          </h3>
          <div className="p-4 bg-slate-950/50 rounded-xl border border-red-500/25 text-xs font-bold leading-normal space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-red-400 animate-pulse mt-0.5 shrink-0" />
              <div>
                <span className="text-[8px] uppercase tracking-widest text-red-400 block mb-0.5">Node-10 Calibration alert</span>
                <p className="text-[10px] text-slate-300 font-normal leading-normal">
                  Pneumatic assembly Line-A is under warning state (84% efficiency). Model predicts a potential 2-hour delay on MO-4008 if calibrators are not dispatched.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 5. INVENTORY MANAGER DASHBOARD OVERVIEW
// ==========================================

function InventoryManagerDashboard({ user }: { user: User }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Inventory Control Network
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Welcome, Elena Rodriguez 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here's your inventory dashboard overview. Odoo DB Sync is online.
          </p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Total Products', val: '450 SKUs', icon: <Layers className="w-4 h-4 text-purple-400" />, delta: '+12.4% Growth', deltaColor: 'text-emerald-400' },
          { title: 'Inventory Value', val: '₹6,49,000', icon: <Coins className="w-4 h-4 text-green-400" />, delta: 'Optimized', deltaColor: 'text-emerald-400' },
          { title: 'Low Stock Items', val: '2 Items', icon: <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />, delta: 'Needs Restock', deltaColor: 'text-red-400' },
          { title: 'Monthly Movement', val: '435 units', icon: <Activity className="w-4 h-4 text-cyan-400" />, delta: 'Nominal velocity', deltaColor: 'text-cyan-300' }
        ].map((kpi) => (
          <div key={kpi.title} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
            <div className="flex justify-between items-start text-slate-400 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-xl font-black text-white">{kpi.val}</div>
            <span className={`text-[9px] font-bold block mt-2 ${kpi.deltaColor}`}>{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        {/* Left Column: AI Stock Risk Detector */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-xl relative">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Stock Risk & Reorder Detector
          </h3>
          <div className="space-y-4 text-xs font-bold leading-normal">
            <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
              <span className="text-[9px] uppercase font-black text-purple-400 block mb-1">Reorder suggestions</span>
              <p className="text-[10px] text-slate-300 font-normal">
                Critical stocks found on Fabric Sofas (3 remaining) and Ergonomic Chairs (0 remaining). Initiating restock request of 25 units is recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Inbound/Outbound velocity Bar Chart */}
        <div className="lg:col-span-7 bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Monthly Inventory Movement Velocity</h3>
          <div className="h-44 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryMovementsData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip />
                  <Bar dataKey="Inbound" fill="#7C3AED" name="Inbound" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Outbound" fill="#06B6D4" name="Outbound" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 6. EXECUTIVE (CEO) DASHBOARD OVERVIEW
// ==========================================

function ExecutiveDashboard({ user }: { user: User }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Executive Office
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
            CEO Command Center 👑
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregate corporate ledger vitals, operational pass indexes, and general business intelligence.
          </p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Total Revenue', val: '₹2,35,00,000', icon: <Coins className="w-4 h-4 text-purple-400" />, delta: '+14.8% YoY' },
          { title: 'Gross Profit', val: '₹1,25,00,000', icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, delta: '53.1% Margin' },
          { title: 'Operating Expenses', val: '₹1,10,00,000', icon: <TrendingDown className="w-4 h-4 text-red-400" />, delta: 'Optimized Spend' },
          { title: 'Inventory Valuation', val: '₹5,42,00,000', icon: <Layers className="w-4 h-4 text-green-400" />, delta: 'Warehouse Net' },
          { title: 'Procurement Cost', val: '₹15,50,000', icon: <ShoppingCart className="w-4 h-4 text-cyan-400" />, delta: '-4.2% Saving' },
          { title: 'Manufacturing Yield', val: '98.1%', icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />, delta: '0.8% Scrap Rate' }
        ].map((kpi) => (
          <div key={kpi.title} className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
            <div className="flex justify-between items-start text-slate-400 mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-lg font-black text-white">{kpi.val}</div>
            <span className="text-[8px] text-slate-500 font-bold block mt-2">{kpi.delta}</span>
          </div>
        ))}
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        {/* Left Column: AI Executive Health Insights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-xl relative">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            AI Executive Insights
          </h3>
          <div className="space-y-4 text-xs font-bold leading-normal">
            <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
              <span className="text-[9px] uppercase font-black text-purple-400 block mb-1">Strategic growth forecast</span>
              <p className="text-[10px] text-slate-300 font-normal leading-normal">
                Models predict Q3 margin spikes to 55%. Supply chains are clear, and procurement savings of ₹54,300 have been logged under contract optimizations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Trend Area Chart */}
        <div className="lg:col-span-7 bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Corporate Financial Margins Trend</h3>
          <div className="h-44 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFinancialData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`]} />
                  <Area type="monotone" dataKey="Revenue" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="Profit" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

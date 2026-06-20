'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, Star, Activity, CheckCircle2, TrendingUp, 
  ChevronUp, ChevronDown, Layers, ShieldCheck, HelpCircle, 
  Search, ArrowRight, ShieldAlert, Cpu, Coins, Truck, Settings2,
  BarChart3
} from 'lucide-react'
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts'

interface Supplier {
  name: string
  category: string
  onTimeRate: number
  qualityScore: number
  costEfficiency: number
  riskIndex: number
  overallScore: number
  activeOrders: number
  rating: number
  rank: number
  savingsMoM: number
  status: 'Preferred' | 'Verified' | 'Probationary'
}

const suppliersData: Supplier[] = [
  { name: 'Oak & Timber Co', category: 'Raw Wood', onTimeRate: 98, qualityScore: 98, costEfficiency: 94, riskIndex: 5, overallScore: 98, activeOrders: 3, rating: 4.9, rank: 1, savingsMoM: 6000, status: 'Preferred' },
  { name: 'Industrial Screws', category: 'Hardware', onTimeRate: 97, qualityScore: 97, costEfficiency: 95, riskIndex: 8, overallScore: 96, activeOrders: 5, rating: 4.8, rank: 2, savingsMoM: 8000, status: 'Preferred' },
  { name: 'Titan Steel', category: 'Hardware', onTimeRate: 99, qualityScore: 99, costEfficiency: 86, riskIndex: 12, overallScore: 95, activeOrders: 2, rating: 4.9, rank: 3, savingsMoM: 2100, status: 'Verified' },
  { name: 'Astro Coatings', category: 'Coatings', onTimeRate: 96, qualityScore: 96, costEfficiency: 92, riskIndex: 15, overallScore: 94, activeOrders: 1, rating: 4.8, rank: 4, savingsMoM: 3150, status: 'Verified' },
  { name: 'ABC Woods', category: 'Raw Wood', onTimeRate: 94, qualityScore: 92, costEfficiency: 88, riskIndex: 18, overallScore: 92, activeOrders: 0, rating: 4.6, rank: 5, savingsMoM: 0, status: 'Verified' },
  { name: 'LegMasters', category: 'Furniture Legs', onTimeRate: 95, qualityScore: 95, costEfficiency: 85, riskIndex: 10, overallScore: 91, activeOrders: 4, rating: 4.7, rank: 6, savingsMoM: 0, status: 'Verified' },
  { name: 'EcoPaints', category: 'Coatings', onTimeRate: 91, qualityScore: 93, costEfficiency: 84, riskIndex: 25, overallScore: 88, activeOrders: 1, rating: 4.5, rank: 7, savingsMoM: -1200, status: 'Probationary' }
]

const performanceData = [
  { name: 'Oak & Timber', 'On-Time': 98, Quality: 98, Efficiency: 94 },
  { name: 'Industrial Screws', 'On-Time': 97, Quality: 97, Efficiency: 95 },
  { name: 'Titan Steel', 'On-Time': 99, Quality: 99, Efficiency: 86 },
  { name: 'Astro Coatings', 'On-Time': 96, Quality: 96, Efficiency: 92 },
  { name: 'LegMasters', 'On-Time': 95, Quality: 95, Efficiency: 85 }
]

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortField, setSortField] = useState<keyof Supplier>('overallScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isMounted, setIsMounted] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>(suppliersData[0])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter Categories
  const categories = useMemo(() => {
    const set = new Set(suppliersData.map(s => s.category))
    return ['All', ...Array.from(set)]
  }, [])

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliersData.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory = selectedCategory === 'All' || s.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [searchQuery, selectedCategory])

  // Sorted Suppliers
  const sortedSuppliers = useMemo(() => {
    const list = [...filteredSuppliers]
    return list.sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredSuppliers, sortField, sortOrder])

  // Handle Sort Change
  const handleSort = (field: keyof Supplier) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Risk Radar Data for Selected Supplier
  const radarData = useMemo(() => {
    if (!selectedSupplier) return []
    return [
      { subject: 'On-Time Delivery', value: selectedSupplier.onTimeRate, fullMark: 100 },
      { subject: 'Product Quality', value: selectedSupplier.qualityScore, fullMark: 100 },
      { subject: 'Cost Efficiency', value: selectedSupplier.costEfficiency, fullMark: 100 },
      { subject: 'Risk Resistance', value: 100 - selectedSupplier.riskIndex, fullMark: 100 },
      { subject: 'Overall Score', value: selectedSupplier.overallScore, fullMark: 100 }
    ]
  }, [selectedSupplier])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-white/10 backdrop-blur-md px-3 py-2.5 rounded-xl shadow-xl">
          <p className="text-xs font-black text-slate-400 mb-1">{label}</p>
          {payload.map((pld: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white mt-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
              <span>{pld.name}: {pld.value}%</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

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
            Supplier Lifecycle Management
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            SUPPLIER COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global supplier risk indices, real-time quality audits, and AI optimization logs.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/60 border border-emerald-500/25 px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] text-emerald-400 font-extrabold uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Vetting Protocol: Active
          </div>
        </div>
      </div>

      {/* Top Cards KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Total Vetted', val: '7 Vendors', icon: <Layers className="w-4 h-4 text-purple-400" />, footer: '3 Categories' },
          { title: 'Active Contracts', val: '5 Contracts', icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />, footer: 'Secure ledger' },
          { title: 'On-Time delivery', val: '96.2%', icon: <Truck className="w-4 h-4 text-green-400" />, footer: 'Global average' },
          { title: 'Supplier Quality', val: '4.7 / 5.0', icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400" />, footer: '96% pass threshold' },
          { title: 'Optimized Savings', val: '₹19,250', icon: <Coins className="w-4 h-4 text-emerald-400" />, footer: 'AI suggested MoM' },
          { title: 'System Risk level', val: 'Low Risk', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />, footer: 'Secure supply line' }
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 15px rgba(255,255,255,0.02)' }}
            className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
          >
            <div className="flex justify-between items-start text-slate-400 mb-2">
              <span className="text-[9px] uppercase font-bold tracking-wider">{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-xl font-black text-white mt-1">{kpi.val}</div>
            <div className="text-[9px] text-slate-500 font-bold uppercase mt-1.5 border-t border-white/[0.03] pt-1.5">{kpi.footer}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        
        {/* LEFT COLUMN: FILTER, LIST, LEADERBOARD (SPAN 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Controls Bar */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search vetted suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier Comparison Table */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-5">
              <Layers className="w-4 h-4 text-purple-400" />
              Supplier Audit Ledger
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 text-left">Supplier</th>
                    <th className="pb-3 text-left">Category</th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('onTimeRate')}>
                      <div className="flex items-center gap-1">
                        Delivery {sortField === 'onTimeRate' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('qualityScore')}>
                      <div className="flex items-center gap-1">
                        Quality {sortField === 'qualityScore' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('overallScore')}>
                      <div className="flex items-center gap-1">
                        Score {sortField === 'overallScore' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 text-right">Risk index</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSuppliers.map((supplier) => (
                    <tr
                      key={supplier.name}
                      onClick={() => setSelectedSupplier(supplier)}
                      className={`border-b border-white/[0.04] transition-all hover:bg-white/[0.02] cursor-pointer ${
                        selectedSupplier.name === supplier.name ? 'bg-purple-950/20 border-purple-500/30' : ''
                      }`}
                    >
                      <td className="py-3.5 font-bold text-white flex items-center gap-2">
                        {supplier.name}
                        {supplier.status === 'Preferred' && (
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                            Preferred
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400">{supplier.category}</td>
                      <td className="py-3.5 font-bold text-slate-200">{supplier.onTimeRate}%</td>
                      <td className="py-3.5 text-slate-300">{supplier.qualityScore}%</td>
                      <td className="py-3.5 font-black text-cyan-400">{supplier.overallScore}/100</td>
                      <td className="py-3.5 text-right font-bold text-slate-300">
                        <span className={`px-2 py-0.5 rounded border ${
                          supplier.riskIndex > 20 ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                          supplier.riskIndex > 10 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                          'bg-green-500/10 border-green-500/30 text-green-400'
                        }`}>
                          {supplier.riskIndex}% Risk
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supplier Performance Trends BarChart */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Supplier Core Audit Comparisons
            </h2>

            <div className="h-56 w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={8} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="On-Time" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Quality" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Efficiency" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SUPPLIER SCORECARD & RISK RADAR (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Supplier Detailed Scorecard & Risk Analysis */}
          <div className="bg-gradient-to-b from-[#0b081e]/80 to-[#05060f]/80 border border-purple-500/20 p-6 rounded-2xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start mb-5 border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[8px] uppercase font-black tracking-widest text-purple-400">Selected Supplier Card</span>
                <h3 className="font-extrabold text-lg text-white mt-1">{selectedSupplier.name}</h3>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                selectedSupplier.status === 'Preferred' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                selectedSupplier.status === 'Verified' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
              }`}>
                {selectedSupplier.status}
              </span>
            </div>

            {/* Risk Radar Chart */}
            <div className="h-56 w-full mb-6">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#ffffff0d" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={8} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={7} />
                    <Radar name={selectedSupplier.name} dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
              )}
            </div>

            {/* Score Details */}
            <div className="space-y-3 text-xs border-t border-white/[0.06] pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">On-Time delivery</span>
                  <div className="text-white font-extrabold text-sm mt-1">{selectedSupplier.onTimeRate}%</div>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">Product Quality</span>
                  <div className="text-white font-extrabold text-sm mt-1">{selectedSupplier.qualityScore}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">Cost Efficiency</span>
                  <div className="text-white font-extrabold text-sm mt-1">{selectedSupplier.costEfficiency}%</div>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-slate-400 text-[9px] uppercase font-bold">Risk Index</span>
                  <div className="text-red-400 font-extrabold text-sm mt-1">{selectedSupplier.riskIndex}%</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-white/5 rounded-xl flex justify-between items-center mt-2">
                <div>
                  <span className="text-[9px] uppercase font-black text-cyan-400">Active Order Load</span>
                  <div className="text-white text-md font-black mt-0.5">{selectedSupplier.activeOrders} contracts</div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-slate-500">Savings MoM</span>
                  <div className="text-emerald-400 font-black mt-0.5">
                    {selectedSupplier.savingsMoM > 0 ? `+₹${selectedSupplier.savingsMoM}` : '₹0'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Supplier Risk Mitigation Alert */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              AI Risk mitigation ledger
            </h2>

            <div className="space-y-3.5">
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs flex gap-3">
                <span>⚠️</span>
                <div>
                  <h4 className="font-bold text-white">Probation Audit Alert</h4>
                  <p className="text-[10px] text-slate-400 mt-1">EcoPaints delivery rate dropped to 91%. Risk shield active: diverting 25% coatings volume to Astro Coatings.</p>
                </div>
              </div>
              
              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-xs flex gap-3">
                <span>💡</span>
                <div>
                  <h4 className="font-bold text-cyan-400">Optimization Opportunity</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Routing raw wood supply entirely through Oak & Timber Co saves additional ₹3,000 monthly compared to ABC Woods baseline.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

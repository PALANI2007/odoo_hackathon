'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layers, ShieldAlert, Cpu, Award, TrendingUp, ChevronUp, ChevronDown,
  Activity, CheckCircle2, Search, ArrowRight, Coins, RefreshCw, BarChart3,
  Database, Info, AlertTriangle, Truck, Zap
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts'

interface InventoryItem {
  name: string
  category: string
  stock: number
  target: number
  unit: string
  value: number
  bin: string
  status: 'critical' | 'warning' | 'safe'
  reorderPoint: number
}

const initialInventoryItems: InventoryItem[] = [
  { name: 'Wood Top', category: 'Lumber', stock: 5, target: 50, unit: 'pcs', value: 4000, bin: 'Bin-01', status: 'critical', reorderPoint: 15 },
  { name: 'Screws', category: 'Hardware', stock: 20, target: 1000, unit: 'boxes', value: 1000, bin: 'Bin-04', status: 'warning', reorderPoint: 100 },
  { name: 'Wooden Legs', category: 'Lumber', stock: 150, target: 200, unit: 'pcs', value: 45000, bin: 'Bin-02', status: 'safe', reorderPoint: 40 },
  { name: 'Varnish Coating', category: 'Coatings', stock: 8, target: 50, unit: 'liters', value: 3600, bin: 'Bin-03', status: 'critical', reorderPoint: 10 },
  { name: 'Metal Brackets', category: 'Hardware', stock: 12, target: 150, unit: 'pcs', value: 1440, bin: 'Bin-05', status: 'warning', reorderPoint: 30 },
  { name: 'Seat Cushions', category: 'Upholstery', stock: 85, target: 100, unit: 'pcs', value: 17000, bin: 'Bin-06', status: 'safe', reorderPoint: 20 }
]

const movementData = [
  { time: '10:15', name: 'Wood Top', action: 'Allocated to MO-093', qty: '4 pcs', status: 'allocated' },
  { time: '09:42', name: 'Metal Brackets', action: 'Inbound PO-002', qty: '+150 pcs', status: 'received' },
  { time: '08:15', name: 'Screws', action: 'Allocated to MO-092', qty: '12 boxes', status: 'allocated' },
  { time: 'Yesterday', name: 'Wooden Legs', action: 'Inbound PO-004', qty: '+50 pcs', status: 'received' }
]

const capacityTrendData = [
  { name: 'Mon', capacity: 72 },
  { name: 'Tue', capacity: 74 },
  { name: 'Wed', capacity: 73 },
  { name: 'Thu', capacity: 78 },
  { name: 'Fri', capacity: 77 },
  { name: 'Sat', capacity: 78 }
]

const allocationPieData = [
  { name: 'Lumber Storage', value: 249000, color: '#7C3AED' },
  { name: 'Hardware Bin', value: 87000, color: '#06B6D4' },
  { name: 'Coatings Zone', value: 125000, color: '#22C55E' },
  { name: 'Upholstery Bay', value: 188000, color: '#F59E0B' }
]

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedBin, setSelectedBin] = useState<string>('All')
  const [sortField, setSortField] = useState<keyof InventoryItem>('stock')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isMounted, setIsMounted] = useState(false)
  
  // Quick restock states
  const [restockProgress, setRestockProgress] = useState(false)
  const [activeRestockItem, setActiveRestockItem] = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Categories & Bins
  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category))
    return ['All', ...Array.from(set)]
  }, [items])

  const bins = useMemo(() => {
    return ['All', 'Bin-01', 'Bin-02', 'Bin-03', 'Bin-04', 'Bin-05', 'Bin-06']
  }, [])

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCat = selectedCategory === 'All' || i.category === selectedCategory
      const matchBin = selectedBin === 'All' || i.bin === selectedBin
      return matchSearch && matchCat && matchBin
    })
  }, [items, searchQuery, selectedCategory, selectedBin])

  // Sorted List
  const sortedItems = useMemo(() => {
    const list = [...filteredItems]
    return list.sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredItems, sortField, sortOrder])

  // Handle Sort
  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Quick Restock Trigger
  const triggerRestock = (itemName: string) => {
    setActiveRestockItem(itemName)
    setRestockProgress(true)

    setTimeout(() => {
      setRestockProgress(false)
      
      confetti({
        particleCount: 120,
        spread: 70,
        colors: ['#7C3AED', '#06B6D4', '#22C55E']
      })

      setItems(prev => prev.map(item => {
        if (item.name === itemName) {
          return {
            ...item,
            stock: item.target,
            status: 'safe'
          }
        }
        return item
      }))
    }, 1500)
  }

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
      
      {/* Neo glow backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Warehouse & Inventory twin
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            SMART INVENTORY Twin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic asset capacities, automatic reorders, and stock movements timeline audit.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/60 border border-emerald-500/25 px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] text-emerald-400 font-extrabold uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Heatmap sync: nominal
          </div>
        </div>
      </div>

      {/* Top cards KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8 z-10 relative">
        {[
          { title: 'Total SKU Stock', val: '1,280 items', icon: <Layers className="w-4 h-4 text-purple-400" />, footer: '6 active SKUs' },
          { title: 'Inventory Accuracy', val: '99.1%', icon: <CheckCircle2 className="w-4 h-4 text-green-400" />, footer: 'Verified audited' },
          { title: 'Stock Turnover', val: '6.8x / Year', icon: <Activity className="w-4 h-4 text-cyan-400" />, footer: 'Healthy velocity' },
          { title: 'Critical Items', val: items.filter(i=>i.status==='critical').length + ' SKUs', icon: <ShieldAlert className="w-4 h-4 text-red-400" />, footer: 'Auto PO active' },
          { title: 'Active Warehouses', val: '2 Depots', icon: <Database className="w-4 h-4 text-amber-400" />, footer: 'Cap: 78% filled' },
          { title: 'Assigned Bins', val: '6 Bins', icon: <Cpu className="w-4 h-4 text-purple-400" />, footer: 'Optimized layout' }
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        
        {/* LEFT COLUMN: FILTERS, SKU LIST TABLE (SPAN 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Controls Bar */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search SKU name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Category selector */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-300 font-bold py-1.5 px-3 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Bin selector */}
              <select
                value={selectedBin}
                onChange={(e) => setSelectedBin(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-300 font-bold py-1.5 px-3 focus:outline-none"
              >
                <option value="All">All Bins</option>
                {bins.filter(b => b !== 'All').map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SKU Ledger Table */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-5">
              <Layers className="w-4 h-4 text-purple-400" />
              Inventory Stock Ledger
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pr-2 text-left">SKU Material</th>
                    <th className="pb-3 text-left">Bin</th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('stock')}>
                      <div className="flex items-center gap-1">
                        Stock {sortField === 'stock' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 text-left">Target</th>
                    <th className="pb-3 text-left">Buffer Point</th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('value')}>
                      <div className="flex items-center gap-1">
                        Asset Value {sortField === 'value' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => {
                    let statusBadge = 'bg-green-500/10 border-green-500/30 text-green-400'
                    if (item.status === 'critical') statusBadge = 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                    if (item.status === 'warning') statusBadge = 'bg-amber-500/10 border-amber-500/30 text-amber-400'

                    return (
                      <tr
                        key={item.name}
                        className="border-b border-white/[0.04] transition-all hover:bg-white/[0.01]"
                      >
                        <td className="py-3.5 pr-2 font-bold text-white flex items-center gap-2">
                          {item.name}
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400">{item.bin}</td>
                        <td className="py-3.5 font-bold text-slate-200">{item.stock} {item.unit}</td>
                        <td className="py-3.5 text-slate-300">{item.target} {item.unit}</td>
                        <td className="py-3.5 text-slate-400">{item.reorderPoint} {item.unit}</td>
                        <td className="py-3.5 font-black text-cyan-400">₹{item.value.toLocaleString()}</td>
                        <td className="py-3.5 text-right">
                          {item.status !== 'safe' ? (
                            <button
                              onClick={() => triggerRestock(item.name)}
                              className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg cursor-pointer"
                            >
                              Restock
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold">Stable</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warehouse heat map & layout visualizer */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                Warehouse twin layout heatmap
              </h2>
              <span className="text-[9px] uppercase font-black tracking-widest text-cyan-400">Section layout</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'Bin-01', name: 'Lumber A', mat: 'Wood Top', filled: 10, color: 'border-red-500/40 bg-red-500/5 text-red-400' },
                { id: 'Bin-02', name: 'Lumber B', mat: 'Wooden Legs', filled: 75, color: 'border-green-500/20 bg-green-500/5 text-green-400' },
                { id: 'Bin-03', name: 'Coatings C', mat: 'Varnish Coating', filled: 16, color: 'border-red-500/40 bg-red-500/5 text-red-400' },
                { id: 'Bin-04', name: 'Hardware D', mat: 'Screws', filled: 20, color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
                { id: 'Bin-05', name: 'Hardware E', mat: 'Metal Brackets', filled: 8, color: 'border-red-500/40 bg-red-500/5 text-red-400' },
                { id: 'Bin-06', name: 'Upholstery F', mat: 'Seat Cushions', filled: 85, color: 'border-green-500/20 bg-green-500/5 text-green-400' },
                { id: 'Bin-07', name: 'Buffer Bay G', mat: 'Empty', filled: 0, color: 'border-white/5 bg-slate-900/60 text-slate-500' },
                { id: 'Bin-08', name: 'Shipping Bay H', mat: 'Empty', filled: 0, color: 'border-white/5 bg-slate-900/60 text-slate-500' }
              ].map((bin) => (
                <div
                  key={bin.id}
                  onClick={() => setSelectedBin(bin.id)}
                  className={`p-3.5 border rounded-xl cursor-pointer hover:border-purple-500/40 transition-all ${
                    selectedBin === bin.id ? 'border-purple-500/60 bg-purple-500/5' : bin.color
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono">{bin.id}</span>
                    <span>{bin.filled}% filled</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-white mt-1.5">{bin.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{bin.mat}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TIMELINE & CAPACITY CHARTS (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Capacity Utilization Trend LineChart */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Warehouse utilization trend
            </h2>

            <div className="h-44 w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={capacityTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="capacity" name="Capacity utilization (%)" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorCap)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
              )}
            </div>
          </div>

          {/* Allocation Pie chart */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-purple-400" />
              Asset Value Allocation
            </h2>

            <div className="h-44 w-full flex items-center">
              {isMounted ? (
                <div className="w-full h-full flex flex-col md:flex-row items-center justify-around gap-2">
                  <div className="w-[110px] h-[110px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={45}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {allocationPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 text-[9px] font-bold text-slate-400">
                    {allocationPieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-white truncate max-w-[80px]">{item.name}</span>
                        <span>(₹{Math.round(item.value / 1000)}k)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
              )}
            </div>
          </div>

          {/* Stock movements timeline */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-purple-400" />
              Live movement timeline
            </h2>

            <div className="space-y-4 pl-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.06]">
              {movementData.map((mov, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className="w-4 h-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] z-10 shrink-0 mt-0.5">
                    {mov.status === 'allocated' ? '⚙️' : '📥'}
                  </div>
                  <div>
                    <div className="flex justify-between items-center gap-2 text-xs">
                      <span className="font-bold text-white">{mov.name}</span>
                      <span className="text-[9px] text-slate-500 shrink-0">{mov.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{mov.action} | Quantity: <strong className={mov.status === 'received' ? 'text-emerald-400' : 'text-amber-400'}>{mov.qty}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Restock loading modal */}
      <AnimatePresence>
        {restockProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0c071d] border border-purple-500/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative text-center"
            >
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <h3 className="text-md font-black tracking-wider text-white uppercase mb-2">Restocking {activeRestockItem}</h3>
              <p className="text-slate-400 text-xs">Signing secure PO with Odoo backend ledger buffers...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

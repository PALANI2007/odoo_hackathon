'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowLeftRight, Search, FileDown, PlusCircle, Calendar, 
  ArrowUpRight, ArrowDownLeft, RefreshCw, Filter, Layers, 
  User, CheckCircle2, AlertTriangle, Play, Check, X, ShieldCheck
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts'

interface StockMovement {
  id: string
  date: string
  product: string
  sku: string
  type: 'IN' | 'OUT' | 'TRANSFER'
  quantity: number
  warehouse: string
  destinationWarehouse?: string
  user: string
  status: 'Completed' | 'In Transit' | 'Pending'
}

const initialMovements: StockMovement[] = [
  { id: 'MOV-1008', date: '2026-06-20 18:30', product: 'Wooden Chair', sku: 'FUR-CHA-01', type: 'IN', quantity: 50, warehouse: 'Coimbatore Warehouse', user: 'Elena Rodriguez', status: 'Completed' },
  { id: 'MOV-1007', date: '2026-06-20 15:45', product: 'Executive Desk', sku: 'FUR-DES-03', type: 'OUT', quantity: 12, warehouse: 'Chennai Warehouse', user: 'Marcus Chen', status: 'Completed' },
  { id: 'MOV-1006', date: '2026-06-20 11:20', product: 'Ergonomic Chair', sku: 'FUR-CHA-05', type: 'TRANSFER', quantity: 20, warehouse: 'Bangalore Warehouse', destinationWarehouse: 'Coimbatore Warehouse', user: 'Elena Rodriguez', status: 'Completed' },
  { id: 'MOV-1005', date: '2026-06-19 16:10', product: 'Fabric Sofa', sku: 'FUR-SOF-01', type: 'IN', quantity: 15, warehouse: 'Chennai Warehouse', user: 'David Kim', status: 'Completed' },
  { id: 'MOV-1004', date: '2026-06-19 09:30', product: 'Wooden Wardrobe', sku: 'FUR-WAR-04', type: 'OUT', quantity: 5, warehouse: 'Coimbatore Warehouse', user: 'Elena Rodriguez', status: 'Completed' },
  { id: 'MOV-1003', date: '2026-06-18 14:15', product: 'Dining Table', sku: 'FUR-TAB-02', type: 'TRANSFER', quantity: 15, warehouse: 'Coimbatore Warehouse', destinationWarehouse: 'Chennai Warehouse', user: 'Marcus Chen', status: 'Completed' },
  { id: 'MOV-1002', date: '2026-06-18 10:00', product: 'Office Bookshelf', sku: 'FUR-BOK-01', type: 'IN', quantity: 40, warehouse: 'Bangalore Warehouse', user: 'Priya Patel', status: 'Completed' },
  { id: 'MOV-1001', date: '2026-06-17 11:45', product: 'Wooden Chair', sku: 'FUR-CHA-01', type: 'OUT', quantity: 8, warehouse: 'Coimbatore Warehouse', user: 'Elena Rodriguez', status: 'Completed' }
]

const productsList = [
  { name: 'Wooden Chair', sku: 'FUR-CHA-01' },
  { name: 'Dining Table', sku: 'FUR-TAB-02' },
  { name: 'Fabric Sofa', sku: 'FUR-SOF-01' },
  { name: 'Wooden Wardrobe', sku: 'FUR-WAR-04' },
  { name: 'Office Bookshelf', sku: 'FUR-BOK-01' },
  { name: 'Ergonomic Chair', sku: 'FUR-CHA-05' },
  { name: 'Executive Desk', sku: 'FUR-DES-03' }
]

const warehousesList = [
  'Coimbatore Warehouse',
  'Chennai Warehouse',
  'Bangalore Warehouse'
]

// 7-day movement velocity mock data
const initialChartData = [
  { date: '06-14', Inbound: 120, Outbound: 80, Transfer: 30 },
  { date: '06-15', Inbound: 150, Outbound: 95, Transfer: 20 },
  { date: '06-16', Inbound: 90, Outbound: 110, Transfer: 45 },
  { date: '06-17', Inbound: 200, Outbound: 130, Transfer: 10 },
  { date: '06-18', Inbound: 110, Outbound: 140, Transfer: 50 },
  { date: '06-19', Inbound: 180, Outbound: 90, Transfer: 25 },
  { date: '06-20', Inbound: 210, Outbound: 160, Transfer: 40 }
]

export default function StockMovementsPage() {
  const { user } = useAuth()
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements)
  const [chartData, setChartData] = useState(initialChartData)
  
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | 'IN' | 'OUT' | 'TRANSFER'>('All')
  const [warehouseFilter, setWarehouseFilter] = useState<string>('All')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProductSku, setSelectedProductSku] = useState(productsList[0].sku)
  const [movementType, setMovementType] = useState<'IN' | 'OUT' | 'TRANSFER'>('IN')
  const [movementQty, setMovementQty] = useState('10')
  const [sourceWarehouse, setSourceWarehouse] = useState(warehousesList[0])
  const [destWarehouse, setDestWarehouse] = useState(warehousesList[1])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Dynamic metrics
  const metrics = useMemo(() => {
    const total = movements.length
    const inbound = movements.filter(m => m.type === 'IN').reduce((acc, m) => acc + m.quantity, 0)
    const outbound = movements.filter(m => m.type === 'OUT').reduce((acc, m) => acc + m.quantity, 0)
    const transfers = movements.filter(m => m.type === 'TRANSFER').length
    
    return { total, inbound, outbound, transfers }
  }, [movements])

  // Filtered movements list
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchesSearch = 
        m.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === 'All' || m.type === typeFilter
      
      const matchesWarehouse = warehouseFilter === 'All' || 
        m.warehouse === warehouseFilter || 
        m.destinationWarehouse === warehouseFilter

      return matchesSearch && matchesType && matchesWarehouse
    })
  }, [movements, searchQuery, typeFilter, warehouseFilter])

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault()
    
    const qty = parseInt(movementQty)
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity.')
      return
    }

    if (movementType === 'TRANSFER' && sourceWarehouse === destWarehouse) {
      alert('Source and Destination warehouses must be different for internal transfers.')
      return
    }

    const matchedProduct = productsList.find(p => p.sku === selectedProductSku)
    if (!matchedProduct) return

    const newMovId = `MOV-${Math.floor(Math.random() * 9000) + 1000}`
    const now = new Date()
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16)

    const newMovement: StockMovement = {
      id: newMovId,
      date: dateStr,
      product: matchedProduct.name,
      sku: matchedProduct.sku,
      type: movementType,
      quantity: qty,
      warehouse: sourceWarehouse,
      destinationWarehouse: movementType === 'TRANSFER' ? destWarehouse : undefined,
      user: user?.name || 'Elena Rodriguez',
      status: 'Completed'
    }

    // Prepend new movement
    setMovements(prev => [newMovement, ...prev])

    // Dynamically update Recharts data
    const todayStr = dateStr.substring(5, 10) // e.g. "06-20"
    setChartData(prev => {
      const existIndex = prev.findIndex(c => c.date === todayStr)
      if (existIndex > -1) {
        const updated = [...prev]
        if (movementType === 'IN') updated[existIndex].Inbound += qty
        if (movementType === 'OUT') updated[existIndex].Outbound += qty
        if (movementType === 'TRANSFER') updated[existIndex].Transfer += qty
        return updated
      } else {
        return [
          ...prev.slice(1),
          {
            date: todayStr,
            Inbound: movementType === 'IN' ? qty : 0,
            Outbound: movementType === 'OUT' ? qty : 0,
            Transfer: movementType === 'TRANSFER' ? qty : 0
          }
        ]
      }
    })

    // Reset fields and close modal
    setIsModalOpen(false)
    setMovementQty('10')
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ['#7C3AED', '#06B6D4', '#22C55E']
    })
  }

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Date,Product,SKU,Type,Quantity,Warehouse,Destination,Handled By,Status\n'
    movements.forEach(m => {
      csvContent += `${m.id},${m.date},"${m.product}",${m.sku},${m.type},${m.quantity},"${m.warehouse}","${m.destinationWarehouse || ''}","${m.user}",${m.status}\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'stock_movements_ledger.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    confetti({ particleCount: 30, spread: 40 })
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
            Stock Ledger Systems
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Stock Movements ↔️
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit inbound receptions, outbound shipments, and internal warehouse transfers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={exportCSV}
            className="bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-white font-extrabold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
          >
            <FileDown className="w-4 h-4 text-slate-400" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Record Movement
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Total Ledgers', value: metrics.total, desc: 'Movement entries recorded', color: 'border-purple-500/25', icon: <Layers className="w-4 h-4 text-purple-400" /> },
          { title: 'Total Inbound', value: `${metrics.inbound} units`, desc: 'Total incoming product inventory', color: 'border-emerald-500/25', icon: <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> },
          { title: 'Total Outbound', value: `${metrics.outbound} units`, desc: 'Total delivered/shipped stock', color: 'border-red-500/25', icon: <ArrowUpRight className="w-4 h-4 text-red-400" /> },
          { title: 'Active Transfers', value: metrics.transfers, desc: 'Internal multi-facility flows', color: 'border-cyan-500/25', icon: <ArrowLeftRight className="w-4 h-4 text-cyan-400" /> }
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

      {/* Main Grid: Chart & Filters + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Recharts Chart (Span 12 always, or split) */}
        <div className="lg:col-span-12 bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <span className="text-[9px] uppercase font-black text-cyan-400 tracking-wider">Velocity Tracking</span>
              <h3 className="font-extrabold text-sm text-white">Inventory Stock Movement Velocity (7-Day Trend)</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400/20 border border-emerald-400/40 block" /> Inbound</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-400/20 border border-red-400/40 block" /> Outbound</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-400/20 border border-cyan-400/40 block" /> Transfers</div>
            </div>
          </div>

          <div className="h-[250px] w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTransfer" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tickLine={false} style={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tickLine={false} style={{ fontSize: 9, fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }} 
                    labelStyle={{ fontSize: 10, fontWeight: 'bold', color: '#fff' }}
                    itemStyle={{ fontSize: 10, fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="Inbound" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorInbound)" />
                  <Area type="monotone" dataKey="Outbound" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorOutbound)" />
                  <Area type="monotone" dataKey="Transfer" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorTransfer)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Ledger Table Component: Span 12 */}
        <div className="lg:col-span-12 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden">
          
          {/* Filtering Controls Header */}
          <div className="p-5 border-b border-white/[0.05] bg-slate-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white">Stock Movement Ledger</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Physical transactions auditing log</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Search Bar */}
              <div className="relative flex-1 md:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by SKU, product, user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/25"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Type
                </span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="bg-slate-950 border border-white/10 hover:border-white/20 text-white text-[10px] py-1.5 px-2 rounded-xl focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="IN">IN (Inbound)</option>
                  <option value="OUT">OUT (Outbound)</option>
                  <option value="TRANSFER">TRANSFER (Internal)</option>
                </select>
              </div>

              {/* Facility Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Facility
                </span>
                <select
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 hover:border-white/20 text-white text-[10px] py-1.5 px-2 rounded-xl focus:outline-none"
                >
                  <option value="All">All Facilities</option>
                  {warehousesList.map(wh => (
                    <option key={wh} value={wh}>{wh}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-slate-900/10 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-4">ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Location (Origin / Destination)</th>
                  <th className="p-4">Handled By</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                <AnimatePresence mode="popLayout">
                  {filteredMovements.map((mov) => (
                    <motion.tr
                      key={mov.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-white/[0.01] text-xs font-bold text-slate-300"
                    >
                      <td className="p-4 font-mono text-[10px] text-cyan-400">{mov.id}</td>
                      <td className="p-4 text-slate-400 font-normal">{mov.date}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-white font-extrabold">{mov.product}</span>
                          <span className="text-[9px] text-slate-500 font-mono mt-0.5">{mov.sku}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase ${
                          mov.type === 'IN' 
                            ? 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400' 
                            : mov.type === 'OUT' 
                              ? 'bg-red-400/10 border border-red-400/20 text-red-400' 
                              : 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400'
                        }`}>
                          {mov.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{mov.quantity}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-200 font-extrabold">{mov.warehouse.split(' ')[0]}</span>
                          {mov.type === 'TRANSFER' && (
                            <>
                              <span className="text-slate-500 font-normal">→</span>
                              <span className="text-cyan-400 font-extrabold">{mov.destinationWarehouse?.split(' ')[0]}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-normal text-slate-400">{mov.user}</td>
                      <td className="p-4">
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {mov.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {filteredMovements.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-xs text-slate-500 font-normal">
                      No stock movement records found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Record Movement Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-[#0b081a] border border-purple-500/30 p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white absolute top-5 right-5 cursor-pointer bg-transparent border-none focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[8px] uppercase tracking-wider text-purple-400 font-black flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ERP Security Cleared
                </span>
                <h3 className="text-lg font-black tracking-tight text-white">Record Stock Ledger Entry</h3>
                <p className="text-xs text-slate-400 mt-1">Submit physical stock receptions, transfers, or write-offs.</p>
              </div>

              <form onSubmit={handleRecordMovement} className="space-y-4">
                
                {/* Product SKU Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Select Product</label>
                  <select
                    value={selectedProductSku}
                    onChange={(e) => setSelectedProductSku(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all"
                  >
                    {productsList.map(p => (
                      <option key={p.sku} value={p.sku}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Movement Type & Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Movement Type</label>
                    <select
                      value={movementType}
                      onChange={(e) => setMovementType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="IN">IN (Inbound)</option>
                      <option value="OUT">OUT (Outbound)</option>
                      <option value="TRANSFER">TRANSFER (Internal)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={movementQty}
                      onChange={(e) => setMovementQty(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Warehouse Location Fields */}
                <div className={`grid ${movementType === 'TRANSFER' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      {movementType === 'TRANSFER' ? 'Source Warehouse' : 'Facility Location'}
                    </label>
                    <select
                      value={sourceWarehouse}
                      onChange={(e) => setSourceWarehouse(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      {warehousesList.map(wh => (
                        <option key={wh} value={wh}>{wh}</option>
                      ))}
                    </select>
                  </div>

                  {movementType === 'TRANSFER' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Destination Warehouse</label>
                      <select
                        value={destWarehouse}
                        onChange={(e) => setDestWarehouse(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      >
                        {warehousesList.map(wh => (
                          <option key={wh} value={wh}>{wh}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Form Footer */}
                <div className="pt-4 flex gap-3 justify-end border-t border-white/[0.05]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-transparent border border-white/10 hover:bg-white/5 text-slate-300 font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer border-none shadow"
                  >
                    Commit Entry
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}


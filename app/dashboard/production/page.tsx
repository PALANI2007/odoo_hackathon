'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Settings2, Search, PlusCircle, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, X, Cpu, Activity, AlertTriangle
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface MfgOrder {
  id: string
  product: string
  sku: string
  plannedQty: number
  producedQty: number
  status: 'Draft' | 'Confirmed' | 'In Progress' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  line: 'Line-A' | 'Line-B' | 'Line-C'
}

const initialOrders: MfgOrder[] = [
  { id: 'MO-4008', product: 'Wooden Chairs', sku: 'FUR-CHA-01', plannedQty: 50, producedQty: 10, status: 'In Progress', priority: 'High', line: 'Line-A' },
  { id: 'MO-4007', product: 'Executive Desks', sku: 'FUR-DES-03', plannedQty: 12, producedQty: 12, status: 'Completed', priority: 'High', line: 'Line-B' },
  { id: 'MO-4006', product: 'Ergonomic Chairs', sku: 'FUR-CHA-05', plannedQty: 25, producedQty: 0, status: 'Confirmed', priority: 'Medium', line: 'Line-C' },
  { id: 'MO-4005', product: 'Dining Tables', sku: 'FUR-TAB-02', plannedQty: 10, producedQty: 2, status: 'In Progress', priority: 'Medium', line: 'Line-A' },
  { id: 'MO-4004', product: 'Fabric Sofas', sku: 'FUR-SOF-01', plannedQty: 5, producedQty: 5, status: 'Completed', priority: 'Low', line: 'Line-B' },
  { id: 'MO-4003', product: 'Wooden Wardrobes', sku: 'FUR-WAR-04', plannedQty: 8, producedQty: 0, status: 'Draft', priority: 'Low', line: 'Line-C' }
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

export default function ProductionPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<MfgOrder[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string>('MO-4008')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSku, setSelectedSku] = useState(productsList[0].sku)
  const [plannedQty, setPlannedQty] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [line, setLine] = useState<'Line-A' | 'Line-B' | 'Line-C'>('Line-A')

  // Selected Order details
  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || orders[0]
  }, [orders, selectedOrderId])

  // Stats calculation
  const stats = useMemo(() => {
    const totalMO = orders.length
    const activeMO = orders.filter(o => o.status !== 'Completed').length
    const completedCount = orders.filter(o => o.status === 'Completed').length
    
    let totalPlanned = 0
    let totalProduced = 0
    orders.forEach(o => {
      totalPlanned += o.plannedQty
      totalProduced += o.producedQty
    })
    const yieldRate = totalPlanned > 0 ? Math.round((totalProduced / totalPlanned) * 100) : 0

    return {
      totalMO,
      activeMO,
      completedMO: completedCount,
      yieldRate
    }
  }, [orders])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [orders, searchQuery])

  // Simulate incrementing production output quantity
  const incrementProduced = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const nextQty = o.producedQty + 5
        let nextStatus = o.status
        
        if (nextQty >= o.plannedQty) {
          nextStatus = 'Completed'
          confetti({
            particleCount: 80,
            spread: 50,
            colors: ['#22C55E', '#7C3AED']
          })
          return { ...o, producedQty: o.plannedQty, status: 'Completed' }
        } else {
          nextStatus = 'In Progress'
        }
        return { ...o, producedQty: nextQty, status: nextStatus }
      }
      return o
    }))
  }

  // Handle Create Manufacturing Order
  const handleCreateMO = (e: React.FormEvent) => {
    e.preventDefault()
    const qty = parseInt(plannedQty)
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid planned quantity.')
      return
    }

    const matchedProd = productsList.find(p => p.sku === selectedSku)
    if (!matchedProd) return

    const newMO: MfgOrder = {
      id: `MO-4${Math.floor(Math.random() * 900) + 100}`,
      product: matchedProd.name + 's',
      sku: matchedProd.sku,
      plannedQty: qty,
      producedQty: 0,
      status: 'Confirmed',
      priority,
      line
    }

    setOrders(prev => [newMO, ...prev])
    setSelectedOrderId(newMO.id)
    setIsModalOpen(false)

    // Reset Form
    setPlannedQty('')

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#7C3AED', '#06B6D4']
    })
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
            Operations Cockpit
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Production Management 🏭
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch workorders, monitor lines utilization, and audit manufacturing yield stats.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Plan Mfg Order (MO)
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Total MOs Logged', value: stats.totalMO, desc: 'Registered factory workorders', color: 'border-slate-500/25', icon: <Cpu className="w-4 h-4 text-slate-400" /> },
          { title: 'Active Production Queue', value: stats.activeMO, desc: 'Orders currently on assembly lines', color: 'border-purple-500/25', icon: <Activity className="w-4 h-4 text-purple-400 animate-pulse" /> },
          { title: 'Completed Assemblies', value: stats.completedMO, desc: 'Cleared inventory products', color: 'border-emerald-500/25', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
          { title: 'Factory Yield Efficiency', value: `${stats.yieldRate}%`, desc: 'Produced vs Planned quantity ratio', color: 'border-cyan-500/25', icon: <Settings2 className="w-4 h-4 text-cyan-400" /> }
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: MOs Table Ledger (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden">
          
          {/* Header Controls */}
          <div className="p-5 border-b border-white/[0.05] bg-slate-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white">Manufacturing Orders Ledger</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Active relational shop-floor logs</p>
            </div>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by MO ID, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/25"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-slate-900/10 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-4">MO Code</th>
                  <th className="p-4">SKU / Product Info</th>
                  <th className="p-4">Allocated Line</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Completed Qty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`hover:bg-white/[0.01] text-xs font-bold cursor-pointer transition-all ${
                      order.id === selectedOrderId ? 'bg-purple-950/20' : ''
                    }`}
                  >
                    <td className="p-4 font-mono text-[10px] text-cyan-400">{order.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-white font-extrabold">{order.product}</span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">{order.sku}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-normal">{order.line}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        order.priority === 'High' 
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                          : order.priority === 'Medium'
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            : 'bg-slate-500/10 border border-white/5 text-slate-400'
                      }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      {order.producedQty} / {order.plannedQty} units
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        order.status === 'Completed'
                          ? 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400'
                          : order.status === 'In Progress'
                            ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 animate-pulse'
                            : 'bg-white/5 border border-white/10 text-slate-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status !== 'Completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            incrementProduced(order.id)
                          }}
                          className="bg-slate-900 hover:bg-slate-800 border border-white/5 text-[9px] uppercase font-bold py-1 px-2.5 rounded-lg text-cyan-400 hover:text-white cursor-pointer"
                        >
                          +5 Output
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Workstation Status & AI Widget (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Telemetry and AI Widget */}
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Production Optimization
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold mb-1.5">
                  <span>Line-A Load capacity</span>
                  <span className="text-white font-bold">85%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: '85%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold mb-1.5">
                  <span>Line-B Load capacity</span>
                  <span className="text-white font-bold">92%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold mb-1.5">
                  <span>Line-C Load capacity</span>
                  <span className="text-white font-bold">40%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500" style={{ width: '40%' }} />
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.05] pt-4 mt-6 space-y-3">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black block">AI Delay Predictor</span>
              {activeOrder?.priority === 'High' && activeOrder?.status !== 'Completed' ? (
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-[10px] text-slate-300 leading-normal font-normal flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <strong className="text-red-400 block font-bold">Workstation Calibration Risk</strong>
                    High-priority status on {activeOrder?.id} on Line-A requires pneumatic calibrations. Recalibrate Line-A nodes to prevent latency bottlenecks.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-normal">
                  All workorders proceeding within nominal standard deviations. Machine availability healthy at 96.5%.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Plan Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-[#0b081a] border border-purple-500/30 p-6 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white absolute top-5 right-5 cursor-pointer bg-transparent border-none focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <span className="text-[8px] uppercase tracking-wider text-purple-400 font-black flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ERP Security Cleared
                </span>
                <h3 className="text-lg font-black tracking-tight text-white">Issue Manufacturing Order</h3>
                <p className="text-xs text-slate-400 mt-1">Submit planned product target requirements to the factory floor.</p>
              </div>

              <form onSubmit={handleCreateMO} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Select SKU</label>
                  <select
                    value={selectedSku}
                    onChange={(e) => setSelectedSku(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all"
                  >
                    {productsList.map(p => (
                      <option key={p.sku} value={p.sku}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Quantity</label>
                    <input
                      type="number"
                      required
                      value={plannedQty}
                      onChange={(e) => setPlannedQty(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allocated Assembly Line</label>
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="Line-A">Line-A (Chairs/Sofas)</option>
                    <option value="Line-B">Line-B (Desks/Tables)</option>
                    <option value="Line-C">Line-C (Wardrobes/Other)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-white/[0.05]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-transparent border border-white/10 hover:bg-white/5 text-slate-300 font-extrabold text-xs uppercase px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase px-5 py-2 rounded-xl border-none shadow"
                  >
                    Dispatch Order
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

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileCheck, ShoppingCart, Activity, Coins, Star, Truck, Award, 
  ChevronUp, ChevronDown, CheckCircle2, ShieldAlert, Cpu, RefreshCw,
  Search, ArrowRight, Zap, X, Volume2, ShieldCheck, Check
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar 
} from 'recharts'

interface PurchaseOrder {
  id: string
  item: string
  qty: number
  vendor: string
  cost: number
  date: string
  status: 'Draft' | 'Approved' | 'In Transit' | 'Delivered'
  etaDays: number
  trackingStep: number // 0: Created, 1: Approved, 2: Shipped, 3: Delivered
}

const initialPurchaseOrders: PurchaseOrder[] = [
  { id: 'PO-2026-004', item: 'Wooden Legs', qty: 50, vendor: 'LegMasters', cost: 15000, date: '2026-06-19', status: 'Delivered', etaDays: 0, trackingStep: 3 },
  { id: 'PO-2026-003', item: 'Varnish Coating', qty: 45, vendor: 'Astro Coatings', cost: 17100, date: '2026-06-18', status: 'In Transit', etaDays: 2, trackingStep: 2 },
  { id: 'PO-2026-002', item: 'Metal Brackets', qty: 140, vendor: 'Titan Steel', cost: 14700, date: '2026-06-17', status: 'Delivered', etaDays: 0, trackingStep: 3 },
  { id: 'PO-2026-001', item: 'Screws', qty: 1000, vendor: 'Industrial Screws', cost: 42000, date: '2026-06-15', status: 'Approved', etaDays: 1, trackingStep: 1 }
]

const costSavingsData = [
  { week: 'W1', standardCost: 45000, optimizedCost: 39600, savings: 5400 },
  { week: 'W2', standardCost: 52000, optimizedCost: 43800, savings: 8200 },
  { week: 'W3', standardCost: 48000, optimizedCost: 41900, savings: 6100 },
  { week: 'W4', standardCost: 61000, optimizedCost: 49600, savings: 11400 }
]

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder>(initialPurchaseOrders[1])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<keyof PurchaseOrder>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isMounted, setIsMounted] = useState(false)
  const [quickPOModal, setQuickPOModal] = useState(false)

  // PO creation states
  const [isCreatingPo, setIsCreatingPo] = useState(false)
  const [poCreationStep, setPoCreationStep] = useState(0)
  const [creationSuccess, setCreationSuccess] = useState(false)
  const [newPoId, setNewPoId] = useState('')
  const [formData, setFormData] = useState({
    item: 'Wood Top',
    qty: 50,
    vendor: 'Oak & Timber Co',
    cost: 34000
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto calculate cost when quantity changes in creation form
  const handleFormChange = (field: string, val: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val }
      if (field === 'qty' || field === 'item') {
        let pricePerUnit = 680 // Default Wood Top
        if (updated.item === 'Screws') pricePerUnit = 42
        if (updated.item === 'Wooden Legs') pricePerUnit = 300
        if (updated.item === 'Varnish Coating') pricePerUnit = 380
        if (updated.item === 'Metal Brackets') pricePerUnit = 105
        updated.cost = updated.qty * pricePerUnit
      }
      return updated
    })
  }

  // Handle PO Creation Submission
  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingPo(true)
    setPoCreationStep(0)

    const steps = [
      () => setPoCreationStep(1), // Ledger check
      () => setPoCreationStep(2), // Vendor check
      () => setPoCreationStep(3), // Signature check
      () => {
        const generatedId = `PO-2026-0${Math.floor(Math.random() * 900) + 100}`
        setNewPoId(generatedId)
        setCreationSuccess(true)
        setIsCreatingPo(false)

        confetti({
          particleCount: 150,
          spread: 80,
          colors: ['#7C3AED', '#06B6D4', '#22C55E']
        })

        const newPo: PurchaseOrder = {
          id: generatedId,
          item: formData.item,
          qty: formData.qty,
          vendor: formData.vendor,
          cost: formData.cost,
          date: new Date().toISOString().split('T')[0],
          status: 'Approved',
          etaDays: 2,
          trackingStep: 1
        }

        setPurchaseOrders(prev => [newPo, ...prev])
        setSelectedPo(newPo)
      }
    ]

    steps.forEach((stepFn, index) => {
      setTimeout(stepFn, (index + 1) * 1000)
    })
  }

  // Handle sorting
  const handleSort = (field: keyof PurchaseOrder) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Filtered/Sorted list
  const processedOrders = useMemo(() => {
    const list = purchaseOrders.filter(po => 
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return list.sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [purchaseOrders, searchQuery, sortField, sortOrder])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-white/10 backdrop-blur-md px-3 py-2.5 rounded-xl shadow-xl">
          <p className="text-xs font-black text-slate-400 mb-1">{label}</p>
          {payload.map((pld: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white mt-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
              <span>{pld.name}: ₹{pld.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      
      {/* Neo backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Supply Chain Operations
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            PURCHASE ORDERS COMMAND
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track, audit, and authorize enterprise cryptographic purchase requests.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            setFormData({ item: 'Wood Top', qty: 50, vendor: 'Oak & Timber Co', cost: 34000 })
            setQuickPOModal(true)
          }}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-widest px-4.5 py-2.5 rounded-xl shadow-lg shadow-purple-500/10 transition-all cursor-pointer border-none flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-white text-white animate-pulse" />
          <span>Generate PO</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        
        {/* LEFT COLUMN: FILTER, PO LIST TABLE (SPAN 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Controls Bar */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl flex items-center">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search PO ID, material, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-purple-500/50 animate-fade-in"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* PO Ledger Table */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-5">
              <FileCheck className="w-4 h-4 text-purple-400" />
              Purchase Orders Ledger
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pr-2 text-left">PO ID</th>
                    <th className="pb-3 text-left">Material</th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('qty')}>
                      <div className="flex items-center gap-1">
                        Quantity {sortField === 'qty' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 text-left">Supplier</th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('cost')}>
                      <div className="flex items-center gap-1">
                        Value {sortField === 'cost' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 text-left">Date</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedOrders.map((po) => (
                    <tr
                      key={po.id}
                      onClick={() => setSelectedPo(po)}
                      className={`border-b border-white/[0.04] transition-all hover:bg-white/[0.02] cursor-pointer ${
                        selectedPo.id === po.id ? 'bg-purple-950/20 border-purple-500/30' : ''
                      }`}
                    >
                      <td className="py-3.5 font-bold text-white pr-2 text-left">{po.id}</td>
                      <td className="py-3.5 text-slate-300 text-left">{po.item}</td>
                      <td className="py-3.5 font-bold text-slate-200 text-left">{po.qty.toLocaleString()}</td>
                      <td className="py-3.5 text-slate-300 text-left">{po.vendor}</td>
                      <td className="py-3.5 font-black text-emerald-400 text-left">₹{po.cost.toLocaleString()}</td>
                      <td className="py-3.5 text-slate-400 text-left">{po.date}</td>
                      <td className="py-3.5 text-right">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          po.status === 'Delivered' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          po.status === 'In Transit' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                          'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Cost Savings graph */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-5">
              <Coins className="w-4 h-4 text-emerald-400" />
              AI Cost optimization Audit
            </h2>

            <div className="h-56 w-full">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costSavingsData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Area type="monotone" dataKey="standardCost" name="Baseline Budget (₹)" stroke="#ffffff15" fill="transparent" />
                    <Area type="monotone" dataKey="optimizedCost" name="Optimized Budget (₹)" stroke="#7C3AED" strokeWidth={2} />
                    <Area type="monotone" dataKey="savings" name="Calculated Savings (₹)" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PO STATUS WORKFLOW, LOGISTICS TRACKING (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* PO status tracking details */}
          <div className="bg-gradient-to-b from-[#0b081e]/80 to-[#05060f]/80 border border-purple-500/20 p-6 rounded-2xl relative">
            <div className="flex justify-between items-start mb-5 border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[8px] uppercase font-black tracking-widest text-purple-400">Order tracking details</span>
                <h3 className="font-extrabold text-lg text-white mt-1">{selectedPo.id}</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{selectedPo.item}</span>
            </div>

            {/* Steps tracker */}
            <div className="space-y-4 pl-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.06] mb-6">
              {[
                { name: 'PO Created', step: 0 },
                { name: 'Authorized & Approved', step: 1 },
                { name: 'Shipped (Transit)', step: 2 },
                { name: 'Received & Logged', step: 3 }
              ].map((item) => {
                const isDone = selectedPo.trackingStep >= item.step
                const isActive = selectedPo.trackingStep === item.step

                let iconColor = 'border-white/10 bg-[#030712]'
                let textColor = 'text-slate-500'

                if (isDone) {
                  iconColor = 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  textColor = 'text-emerald-400 font-bold'
                } else if (isActive) {
                  iconColor = 'border-cyan-500 bg-cyan-500/20 text-cyan-400 animate-pulse'
                  textColor = 'text-white font-extrabold'
                }

                return (
                  <div key={item.step} className="flex items-center gap-4 relative">
                    <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[8px] z-10 shrink-0 ${iconColor}`}>
                      {isDone && '✓'}
                      {!isDone && isActive && '•'}
                    </div>
                    <span className={`text-xs ${textColor}`}>{item.name}</span>
                  </div>
                )
              })}
            </div>

            {/* Shipment Route details */}
            <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl text-xs space-y-2">
              <span className="text-[9px] uppercase font-black text-cyan-400 block mb-1">Fleet Logistics Map</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Supplier:</span>
                <span className="text-white font-bold">{selectedPo.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Quantity:</span>
                <span className="text-white font-bold">{selectedPo.qty.toLocaleString()} pcs</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.05] pt-1.5 font-bold">
                <span className="text-slate-300">Purchase Value:</span>
                <span className="text-emerald-400">₹{selectedPo.cost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Fleet logistics visual pathway */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-cyan-400 animate-pulse" />
              Logistics Fleet Visualizer
            </h2>

            <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl flex flex-col justify-center min-h-[120px] relative overflow-hidden">
              <div className="h-0.5 border-t border-dashed border-white/20 w-full absolute left-0 top-[60%] -translate-y-1/2 px-8" />
              
              <div className="flex justify-between items-center z-10 w-full px-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-lg" />
                  <span className="text-[8px] uppercase font-bold text-slate-500">Vendor</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-lg" />
                  <span className="text-[8px] uppercase font-bold text-slate-500">Transit</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg animate-pulse" />
                  <span className="text-[8px] uppercase font-bold text-slate-500">Warehouse</span>
                </div>
              </div>

              {/* Truck Icon */}
              <motion.div
                className="absolute bottom-[35%] flex flex-col items-center z-10"
                animate={{ 
                  left: selectedPo.trackingStep === 0 ? '10%' : 
                        selectedPo.trackingStep === 1 ? '30%' :
                        selectedPo.trackingStep === 2 ? '55%' : '85%'
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              >
                <Truck className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-bounce" />
              </motion.div>
            </div>
          </div>

        </div>

      </div>

      {/* ==========================================
          PO CREATOR MODAL DIALOG
          ========================================== */}
      <AnimatePresence>
        {quickPOModal && (
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
              className="bg-[#0c071d] border border-purple-500/30 p-7 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setQuickPOModal(false)}
                className="text-slate-400 hover:text-white absolute top-4 right-4 cursor-pointer bg-transparent border-none"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-md font-black tracking-wider text-white uppercase text-center mb-6 flex items-center justify-center gap-2">
                <Zap className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
                Generate Purchase Order
              </h3>

              <form onSubmit={handleCreatePo} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-400 uppercase text-[9px] mb-1.5">Select Material</label>
                  <select
                    value={formData.item}
                    onChange={(e) => handleFormChange('item', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-purple-500/40"
                  >
                    <option value="Wood Top">Wood Top (₹680)</option>
                    <option value="Screws">Screws (₹42)</option>
                    <option value="Wooden Legs">Wooden Legs (₹300)</option>
                    <option value="Varnish Coating">Varnish Coating (₹380)</option>
                    <option value="Metal Brackets">Metal Brackets (₹105)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[9px] mb-1.5">Order Quantity</label>
                  <input
                    type="number"
                    value={formData.qty}
                    onChange={(e) => handleFormChange('qty', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-purple-500/40 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[9px] mb-1.5">Vendor Assigned</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => handleFormChange('vendor', e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-purple-500/40"
                  >
                    <option value="Oak & Timber Co">Oak & Timber Co</option>
                    <option value="Industrial Screws">Industrial Screws</option>
                    <option value="Titan Steel">Titan Steel</option>
                    <option value="Astro Coatings">Astro Coatings</option>
                    <option value="LegMasters">LegMasters</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex justify-between items-center mt-4">
                  <span className="text-slate-400 uppercase text-[9px]">Calculated Cost:</span>
                  <span className="text-emerald-400 text-sm font-black">₹{formData.cost.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl cursor-pointer shadow-lg shadow-purple-500/10 mt-6 border-none"
                >
                  Confirm Purchase Handshake
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PO Processing Modal */}
      <AnimatePresence>
        {isCreatingPo && (
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
              <h3 className="text-md font-black tracking-wider text-white uppercase text-center mb-6">
                PO CRYPTO PROTOCOL HANDSHAKE
              </h3>
              <div className="space-y-4 text-left">
                {[
                  { text: 'Validating Odoo ERP inventory ledger buffers...', step: 1 },
                  { text: 'Vetting vendor performance analytics scores...', step: 2 },
                  { text: 'Cryptographically signing secure PO hash...', step: 3 }
                ].map((item) => {
                  const isDone = poCreationStep > item.step
                  const isActive = poCreationStep === item.step
                  
                  let labelColor = 'text-slate-500'
                  let icon = <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />

                  if (isDone) {
                    labelColor = 'text-emerald-400 font-bold'
                    icon = <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  } else if (isActive) {
                    labelColor = 'text-white font-extrabold'
                    icon = <RefreshCw className="w-4.5 h-4.5 text-purple-400 animate-spin shrink-0" />
                  }

                  return (
                    <div key={item.step} className="flex items-center gap-3">
                      {icon}
                      <span className={`text-xs ${labelColor}`}>{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PO Success Modal */}
      <AnimatePresence>
        {creationSuccess && (
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
              className="bg-[#070b19] border border-emerald-500/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400 font-black text-2xl animate-bounce">
                ✓
              </div>

              <h3 className="text-xl font-black text-white uppercase mb-2">Purchase Request Committed</h3>
              <p className="text-emerald-400 font-extrabold text-sm mb-4">{newPoId}</p>

              <div className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl text-left text-xs mb-6 space-y-1.5 font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Material:</span>
                  <span className="text-white">{formData.item}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Quantity:</span>
                  <span className="text-white">{formData.qty.toLocaleString()} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Supplier Assigned:</span>
                  <span className="text-white">{formData.vendor}</span>
                </div>
                <div className="flex justify-between border-t border-white/[0.05] pt-1.5">
                  <span className="text-slate-300">Total Costs:</span>
                  <span className="text-emerald-400">₹{formData.cost.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCreationSuccess(false)
                  setQuickPOModal(false)
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 border-none"
              >
                Dismiss Ledger
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

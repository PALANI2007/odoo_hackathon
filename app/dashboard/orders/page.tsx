'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  ShoppingBag, Search, PlusCircle, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, X, Filter, Truck, Coins, ArrowUpRight
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface SalesOrder {
  id: string
  customer: string
  date: string
  items: string
  amount: number
  status: 'Processing' | 'Shipped' | 'Delivered'
  step: number // 1: Ingested, 2: Packaged, 3: Shipped, 4: Delivered
  representative: string
}

const initialOrders: SalesOrder[] = [
  { id: 'SO-9008', customer: 'Tata Steel Labs', date: '2026-06-20', items: 'Wooden Chairs x50', amount: 60000, status: 'Processing', step: 1, representative: 'Marcus Johnson' },
  { id: 'SO-9007', customer: 'Reliance Retail', date: '2026-06-20', items: 'Dining Tables x10', amount: 75000, status: 'Shipped', step: 3, representative: 'Marcus Johnson' },
  { id: 'SO-9006', customer: 'Wipro Digital', date: '2026-06-19', items: 'Ergonomic Chairs x25', amount: 87500, status: 'Delivered', step: 4, representative: 'Marcus Johnson' },
  { id: 'SO-9005', customer: 'Aero Logistics', date: '2026-06-18', items: 'Executive Desks x12', amount: 57600, status: 'Delivered', step: 4, representative: 'Marcus Johnson' },
  { id: 'SO-9004', customer: 'Infotech India', date: '2026-06-17', items: 'Office Bookshelves x15', amount: 33000, status: 'Processing', step: 2, representative: 'Marcus Johnson' },
  { id: 'SO-9003', customer: 'Techcorp Systems', date: '2026-06-16', items: 'Fabric Sofas x5', amount: 72500, status: 'Shipped', step: 3, representative: 'Marcus Johnson' },
  { id: 'SO-9002', customer: 'Green Energy Corp', date: '2026-06-15', items: 'Wooden Wardrobes x8', amount: 78400, status: 'Delivered', step: 4, representative: 'Marcus Johnson' }
]

const representativeList = ['Marcus Johnson', 'Sarah Chen', 'David Kim']

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered'>('All')
  const [selectedOrderId, setSelectedOrderId] = useState<string>('SO-9008')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState('')
  const [newItems, setNewItems] = useState('')
  const [newAmount, setNewAmount] = useState('')

  // Selected Order
  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || orders[0]
  }, [orders, selectedOrderId])

  // Stats calculation
  const stats = useMemo(() => {
    const grossSales = orders.reduce((acc, o) => acc + o.amount, 0)
    const pendingCount = orders.filter(o => o.status !== 'Delivered').length
    const shippedCount = orders.filter(o => o.status === 'Shipped').length
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length

    return {
      grossSales,
      pending: pendingCount,
      shipped: shippedCount,
      delivered: deliveredCount
    }
  }, [orders])

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.items.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'All' || o.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Advance shipment step simulator
  const advanceShipmentStep = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        let nextStep = o.step + 1
        let nextStatus = o.status
        
        if (nextStep > 4) return o // Already delivered

        if (nextStep === 2) {
          nextStatus = 'Processing'
        } else if (nextStep === 3) {
          nextStatus = 'Shipped'
        } else if (nextStep === 4) {
          nextStatus = 'Delivered'
          confetti({
            particleCount: 80,
            spread: 50,
            colors: ['#22C55E', '#06B6D4']
          })
        }
        
        return { ...o, step: nextStep, status: nextStatus }
      }
      return o
    }))
  }

  // Handle Add Order
  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(newAmount)
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid billing amount.')
      return
    }

    const newSO: SalesOrder = {
      id: `SO-9${Math.floor(Math.random() * 900) + 100}`,
      customer: newCustomer,
      date: new Date().toISOString().split('T')[0],
      items: newItems,
      amount: amt,
      status: 'Processing',
      step: 1,
      representative: user?.name || 'Marcus Johnson'
    }

    setOrders(prev => [newSO, ...prev])
    setSelectedOrderId(newSO.id)
    setIsModalOpen(false)

    // Reset Form
    setNewCustomer('')
    setNewItems('')
    setNewAmount('')

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#7C3AED', '#06B6D4']
    })
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      
      {/* Neo glow background */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Billing Operations
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Sales Order Ledger 📋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fulfill orders, track shipping logistics, and manage gross sales revenue logs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            New Sales Order
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Gross Revenue', value: `₹${stats.grossSales.toLocaleString('en-IN')}`, desc: 'Combined sales ledger value', color: 'border-purple-500/25', icon: <Coins className="w-4 h-4 text-purple-400" /> },
          { title: 'Active Processing', value: stats.pending, desc: 'Orders in fulfillment pipeline', color: 'border-cyan-500/25', icon: <ShoppingBag className="w-4 h-4 text-cyan-400" /> },
          { title: 'In Transit', value: stats.shipped, desc: 'Orders shipped out for delivery', color: 'border-blue-500/25', icon: <Truck className="w-4 h-4 text-blue-400 animate-pulse" /> },
          { title: 'Successful Deliveries', value: stats.delivered, desc: 'Sealed sales order logs', color: 'border-emerald-500/25', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> }
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

      {/* Main Grid: Orders Table & Shipment Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Orders Table Ledger (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden">
          
          {/* Controls Header */}
          <div className="p-5 border-b border-white/[0.05] bg-slate-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white">Sales Invoices</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Billing logs and packaging checkpoints</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/25"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Status
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-white/10 text-white text-[10px] py-1.5 px-2 rounded-xl focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-slate-900/10 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-4">SO ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Billing Items</th>
                  <th className="p-4">Amount</th>
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
                    <td className="p-4 text-slate-400 font-normal">{order.date}</td>
                    <td className="p-4 text-white font-extrabold">{order.customer}</td>
                    <td className="p-4 text-slate-300 font-normal">{order.items}</td>
                    <td className="p-4 text-slate-200">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        order.status === 'Processing' 
                          ? 'bg-amber-400/10 border border-amber-400/20 text-amber-400'
                          : order.status === 'Shipped'
                            ? 'bg-blue-400/10 border border-blue-400/20 text-blue-400'
                            : 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            advanceShipmentStep(order.id)
                          }}
                          className="bg-slate-900 hover:bg-slate-800 border border-white/5 text-[9px] uppercase font-bold py-1 px-2.5 rounded-lg text-cyan-400 hover:text-white cursor-pointer"
                        >
                          Step Up
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-xs text-slate-500 font-normal">
                      No invoices found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Shipment Tracker Node Progress (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400 animate-pulse" />
              Live Order Fulfillment Twin
            </h3>

            {/* Stepper details */}
            <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
              {[
                { label: 'SO Ingested', desc: 'Billing logged & checked', stepNum: 1 },
                { label: 'Asset Allocated', desc: 'Bins catalogued & packaged', stepNum: 2 },
                { label: 'Shipped Out', desc: 'Handed to logistics fleet', stepNum: 3 },
                { label: 'Signed & Delivered', desc: 'Odoo inventory ledger cleared', stepNum: 4 }
              ].map((stp) => {
                const isActive = (activeOrder?.step || 1) >= stp.stepNum
                const isCurrent = (activeOrder?.step || 1) === stp.stepNum
                
                return (
                  <div key={stp.stepNum} className="relative text-xs">
                    {/* Circle Node */}
                    <div className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                      isActive 
                        ? isCurrent
                          ? 'bg-cyan-500 border-cyan-400 shadow-md shadow-cyan-500/40 animate-pulse'
                          : 'bg-emerald-500 border-emerald-400'
                        : 'bg-slate-950 border-white/10'
                    }`}>
                      {isActive && !isCurrent && <span className="text-[7px] text-white">✓</span>}
                    </div>

                    <div>
                      <h4 className={`font-extrabold uppercase text-[10px] ${isActive ? 'text-white' : 'text-slate-500'}`}>{stp.label}</h4>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">{stp.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* In-place AI Forecast widget */}
            <div className="border-t border-white/[0.05] pt-4 mt-6 space-y-2">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                AI Logistics ETA Predictor
              </span>
              {activeOrder?.status === 'Delivered' ? (
                <p className="text-[10px] text-emerald-400 font-bold">Delivery completed, Odoo logs verified.</p>
              ) : (
                <div className="text-[10px] text-slate-400 font-normal leading-normal">
                  Fulfillment latency estimated at <strong className="text-cyan-400">{activeOrder?.step === 1 ? '48 hours' : activeOrder?.step === 2 ? '24 hours' : '12 hours'}</strong>. Standard deviations within nominal range (+-4 min).
                </div>
              )}
            </div>
          </div>

          {/* Selected Order Summary info */}
          <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-3">Order Abstract</h3>
            <div className="space-y-3 text-xs font-bold">
              <div className="flex justify-between pb-2.5 border-b border-white/[0.03]">
                <span className="text-slate-400 font-normal">Customer Name:</span>
                <span className="text-white">{activeOrder?.customer}</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-white/[0.03]">
                <span className="text-slate-400 font-normal">Billing Amount:</span>
                <span className="text-emerald-400">₹{(activeOrder?.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-white/[0.03]">
                <span className="text-slate-400 font-normal">Representative:</span>
                <span className="text-white">{activeOrder?.representative}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Add Order Modal */}
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
                <h3 className="text-lg font-black tracking-tight text-white">Create Sales Invoice</h3>
                <p className="text-xs text-slate-400 mt-1">Fulfill product purchase orders for registered customers.</p>
              </div>

              <form onSubmit={handleAddOrder} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer</label>
                  <input
                    type="text"
                    required
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="e.g. Tata Steel Labs"
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Billing Items</label>
                  <input
                    type="text"
                    required
                    value={newItems}
                    onChange={(e) => setNewItems(e.target.value)}
                    placeholder="e.g. Wooden Chairs x50"
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Invoiced Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 60000"
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
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
                    Authorize Order
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

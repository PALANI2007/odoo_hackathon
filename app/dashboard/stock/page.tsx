'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layers, Search, FileDown, PlusCircle, Edit2, Trash2, 
  RotateCw, AlertTriangle, ShieldCheck, Cpu, ArrowRight, Zap, CheckCircle2,
  ChevronUp, ChevronDown, RefreshCw
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface StockProduct {
  name: string
  sku: string
  quantity: number
  unitPrice: number
  reorderLevel: number
  status: 'In Stock' | 'Low Stock' | 'Out Of Stock'
}

const initialProducts: StockProduct[] = [
  { name: 'Wooden Chair', sku: 'FUR-CHA-01', quantity: 5, unitPrice: 1200, reorderLevel: 50, status: 'Low Stock' },
  { name: 'Executive Desk', sku: 'FUR-DES-03', quantity: 45, unitPrice: 4800, reorderLevel: 10, status: 'In Stock' },
  { name: 'Ergonomic Chair', sku: 'FUR-CHA-05', quantity: 0, unitPrice: 3500, reorderLevel: 15, status: 'Out Of Stock' },
  { name: 'Dining Table', sku: 'FUR-TAB-02', quantity: 18, unitPrice: 7500, reorderLevel: 5, status: 'In Stock' },
  { name: 'Fabric Sofa', sku: 'FUR-SOF-01', quantity: 3, unitPrice: 14500, reorderLevel: 8, status: 'Low Stock' },
  { name: 'Wooden Wardrobe', sku: 'FUR-WAR-04', quantity: 24, unitPrice: 9800, reorderLevel: 5, status: 'In Stock' },
  { name: 'Office Bookshelf', sku: 'FUR-BOK-01', quantity: 35, unitPrice: 2200, reorderLevel: 10, status: 'In Stock' }
]

export default function StockLevelsPage() {
  const [products, setProducts] = useState<StockProduct[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out Of Stock'>('All')
  
  // Quick Actions Simulation States
  const [isRestocking, setIsRestocking] = useState(false)
  const [restockItem, setRestockItem] = useState('')
  
  // Table Sorting
  const [sortField, setSortField] = useState<keyof StockProduct>('quantity')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      const matchFilter = selectedFilter === 'All' || p.status === selectedFilter
      return matchSearch && matchFilter
    })
  }, [products, searchQuery, selectedFilter])

  // Sorted List
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    return list.sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredProducts, sortField, sortOrder])

  // Sort function
  const handleSort = (field: keyof StockProduct) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Quick Restock Simulation
  const triggerRestock = (itemName: string) => {
    setRestockItem(itemName)
    setIsRestocking(true)

    setTimeout(() => {
      setIsRestocking(false)
      confetti({
        particleCount: 100,
        spread: 60,
        colors: ['#7C3AED', '#06B6D4', '#22C55E']
      })

      setProducts(prev => prev.map(p => {
        if (p.name === itemName) {
          return {
            ...p,
            quantity: p.reorderLevel + 25,
            status: 'In Stock'
          }
        }
        return p
      }))
    }, 1500)
  }

  // Delete product
  const handleDeleteProduct = (sku: string) => {
    setProducts(prev => prev.filter(p => p.sku !== sku))
    confetti({ particleCount: 30, spread: 50, colors: ['#EF4444'] })
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
            Stock Ledger & Vitals
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Stock Levels 📦
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time physical asset audits, reorder thresholds, and quick-restock triggers.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => alert('CSV Export complete')}
            className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-extrabold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-slate-400" />
            Export CSV
          </button>
          <button 
            onClick={() => {
              const newName = prompt('Enter product name:')
              if (!newName) return
              const newSku = `FUR-NEW-${Math.floor(Math.random() * 90) + 10}`
              setProducts(prev => [
                { name: newName, sku: newSku, quantity: 50, unitPrice: 2400, reorderLevel: 10, status: 'In Stock' },
                ...prev
              ])
              confetti({ particleCount: 30, spread: 40 })
            }}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Add Product
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        
        {/* Left Column Span 8: Table */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Controls Bar */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search by SKU or material name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex gap-2">
              {(['All', 'In Stock', 'Low Stock', 'Out Of Stock'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 text-left">Product Name</th>
                    <th className="pb-3 text-left">SKU</th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('quantity')}>
                      <div className="flex items-center gap-1">
                        Quantity {sortField === 'quantity' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('unitPrice')}>
                      <div className="flex items-center gap-1">
                        Price {sortField === 'unitPrice' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="pb-3 text-left">Reorder level</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((p) => {
                    let badgeColor = 'bg-green-500/10 border-green-500/30 text-green-400'
                    if (p.status === 'Low Stock') badgeColor = 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    if (p.status === 'Out Of Stock') badgeColor = 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'

                    return (
                      <tr key={p.sku} className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                        <td className="py-3.5 font-bold text-white pr-2 text-left">{p.name}</td>
                        <td className="py-3.5 text-slate-400 text-left font-mono">{p.sku}</td>
                        <td className="py-3.5 font-bold text-slate-200 text-left">{p.quantity} units</td>
                        <td className="py-3.5 text-slate-300 text-left">₹{p.unitPrice.toLocaleString()}</td>
                        <td className="py-3.5 text-slate-400 text-left">{p.reorderLevel} units</td>
                        <td className="py-3.5 text-left">
                          <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right flex justify-end gap-2.5">
                          <button
                            onClick={() => {
                              const newQty = parseInt(prompt(`Update quantity for ${p.name}:`, p.quantity.toString()) || '')
                              if (isNaN(newQty)) return
                              setProducts(prev => prev.map(item => {
                                if (item.sku === p.sku) {
                                  const status = newQty === 0 ? 'Out Of Stock' : newQty <= item.reorderLevel ? 'Low Stock' : 'In Stock'
                                  return { ...item, quantity: newQty, status }
                                }
                                return item
                              }))
                            }}
                            className="p-1.5 bg-slate-900 border border-white/5 hover:border-purple-500/25 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => triggerRestock(p.name)}
                            className="p-1.5 bg-slate-900 border border-white/5 hover:border-cyan-500/25 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                            title="Restock"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.sku)}
                            className="p-1.5 bg-slate-900 border border-white/5 hover:border-red-500/25 text-slate-500 hover:text-red-400 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column Span 4: AI Recommendations Alert */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-b from-[#0b081e]/80 to-[#05060f]/80 border border-purple-500/20 p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
              Low Stock Recommendations
            </h2>

            <div className="space-y-4">
              {[
                { name: 'Wooden Chair', current: 5, target: 50, suggestedVendor: 'Oak & Timber Co' },
                { name: 'Fabric Sofa', current: 3, target: 15, suggestedVendor: 'SeatCrafts Ltd' },
                { name: 'Ergonomic Chair', current: 0, target: 30, suggestedVendor: 'Hardware Corp' }
              ].map((item) => (
                <div key={item.name} className="p-4 bg-slate-950/60 border border-white/5 rounded-xl text-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Supplier: {item.suggestedVendor}</p>
                    </div>
                    <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">
                      Critical
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/[0.04] pt-2">
                    <span>Current: <strong className="text-red-400 font-bold">{item.current}</strong></span>
                    <span>Recommended Reorder: <strong className="text-cyan-400 font-bold">{item.target} units</strong></span>
                  </div>

                  <button
                    onClick={() => triggerRestock(item.name)}
                    className="w-full bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold py-2 rounded-xl transition-all cursor-pointer text-center text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span>Instant AI Reorder</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Security Shield */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Inventory Risk Index
            </h2>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs flex gap-3 leading-relaxed">
              <span>✓</span>
              <div>
                <span className="font-bold text-white">Inventory Risk Score: 12% (Low)</span>
                <p className="text-[10px] text-slate-400 mt-1">Automatic replenishment systems are fully functional. Shrinkage index is under normal threshold.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isRestocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0b071a] border border-cyan-500/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative text-center"
            >
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
              <h3 className="text-md font-black tracking-wider text-white uppercase mb-2">Restocking {restockItem}</h3>
              <p className="text-slate-400 text-xs">Submitting restock PO details to Odoo database buffers...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

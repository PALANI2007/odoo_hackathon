'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layers, ChevronLeft, FileDown, PlusCircle, Search, 
  MapPin, User, Coins, CheckCircle2, AlertTriangle, 
  Activity, ArrowRight, Cpu, ShieldCheck, Settings2, ShieldAlert
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Warehouse {
  name: string
  location: string
  occupancy: number
  capacity: number
  totalProducts: number
  manager: string
  inventoryValue: number
  lastUpdated: string
}

interface WarehouseInventory {
  product: string
  category: string
  sku: string
  qty: number
  price: number
  status: 'In Stock' | 'Low Stock' | 'Out Of Stock'
}

const warehousesData: Warehouse[] = [
  { name: 'Coimbatore Warehouse', location: 'Coimbatore, Tamil Nadu', occupancy: 92, capacity: 5000, totalProducts: 450, manager: 'Elena Rodriguez', inventoryValue: 345000, lastUpdated: 'Just Now' },
  { name: 'Chennai Warehouse', location: 'Chennai, Tamil Nadu', occupancy: 58, capacity: 8000, totalProducts: 380, manager: 'Marcus Chen', inventoryValue: 188000, lastUpdated: '12 min ago' },
  { name: 'Bangalore Warehouse', location: 'Bangalore, Karnataka', occupancy: 82, capacity: 6000, totalProducts: 450, manager: 'Priya Reddy', inventoryValue: 249000, lastUpdated: '45 min ago' }
]

const coimbatoreInventory: WarehouseInventory[] = [
  { product: 'Wooden Chair', category: 'Chairs', sku: 'FUR-CHA-01', qty: 5, price: 1200, status: 'Low Stock' },
  { product: 'Dining Table', category: 'Tables', sku: 'FUR-TAB-02', qty: 18, price: 7500, status: 'In Stock' },
  { product: 'Fabric Sofa', category: 'Sofas', sku: 'FUR-SOF-01', qty: 3, price: 14500, status: 'Low Stock' },
  { product: 'Wooden Wardrobe', category: 'Wardrobes', sku: 'FUR-WAR-04', qty: 24, price: 9800, status: 'In Stock' },
  { product: 'Office Bookshelf', category: 'Office', sku: 'FUR-BOK-01', qty: 35, price: 2200, status: 'In Stock' }
]

export default function WarehousesPage() {
  const [activeWarehouse, setActiveWarehouse] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  
  // Heatmap configuration
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<string | null>('Row-A Bin-01')

  const categories = useMemo(() => {
    return ['All', 'Chairs', 'Tables', 'Sofas', 'Wardrobes', 'Office']
  }, [])

  const filteredInventory = useMemo(() => {
    return coimbatoreInventory.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory
      const matchStatus = selectedStatus === 'All' || item.status === selectedStatus
      return matchCat && matchStatus
    })
  }, [selectedCategory, selectedStatus])

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!activeWarehouse ? (
          
          // ==========================================
          // OVERVIEW: LIST OF WAREHOUSES
          // ==========================================
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Facility Management
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                  Warehouses 🏗️
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Monitor capacity utilization, warehouse twins layout, and storage optimization metrics.
                </p>
              </div>
            </div>

            {/* Warehouse Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {warehousesData.map((wh) => (
                <motion.div
                  key={wh.name}
                  whileHover={{ scale: 1.02, translateY: -2, boxShadow: '0 0 15px rgba(255,255,255,0.02)' }}
                  className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {wh.location}
                    </span>
                    <h3 className="font-extrabold text-md text-white mt-1.5">{wh.name}</h3>

                    <div className="space-y-2 mt-4 text-[10px] text-slate-400">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span>Utilization Cap</span>
                          <strong className="text-white font-bold">{wh.occupancy}%</strong>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${wh.occupancy > 90 ? 'bg-red-400' : 'bg-cyan-400'}`} style={{ width: `${wh.occupancy}%` }} />
                        </div>
                      </div>

                      <div className="flex justify-between mt-3">
                        <span>Total SKU Count:</span>
                        <strong className="text-slate-200">{wh.totalProducts} units</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Physical Capacity:</span>
                        <strong className="text-slate-200">{wh.capacity} units</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveWarehouse(wh.name)
                      confetti({ particleCount: 40, spread: 50 })
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-purple-500/30 text-white font-bold text-[10px] uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-colors mt-4 text-center"
                  >
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Warehouse Heatmap & Space ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Heatmap visualizer */}
              <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
                <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                  Twin facility capacity heatmap
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {[
                    { id: 'Row-A Bin-01', name: 'Bin-01 (Wood)', filled: 92, status: 'Critical' },
                    { id: 'Row-A Bin-02', name: 'Bin-02 (Hardware)', filled: 58, status: 'Nominal' },
                    { id: 'Row-A Bin-03', name: 'Bin-03 (Hardware)', filled: 82, status: 'High' },
                    { id: 'Row-B Bin-01', name: 'Bin-04 (Coatings)', filled: 12, status: 'Empty' },
                    { id: 'Row-B Bin-02', name: 'Bin-05 (Upholstery)', filled: 85, status: 'High' },
                    { id: 'Row-B Bin-03', name: 'Bin-06 (Buffer)', filled: 0, status: 'Empty' }
                  ].map((cell) => (
                    <div
                      key={cell.id}
                      onClick={() => setSelectedHeatmapCell(cell.id)}
                      className={`p-3 border rounded-xl cursor-pointer hover:border-purple-500/40 transition-all text-xs ${
                        selectedHeatmapCell === cell.id ? 'border-purple-500 bg-purple-500/5' :
                        cell.filled > 90 ? 'border-red-500/30 bg-red-500/5 text-red-400' :
                        cell.filled > 70 ? 'border-amber-500/25 bg-amber-500/5 text-amber-400' :
                        cell.filled > 0 ? 'border-green-500/25 bg-green-500/5 text-green-400' :
                        'border-white/5 bg-slate-900/60 text-slate-500'
                      }`}
                    >
                      <div className="font-mono text-[9px]">{cell.id}</div>
                      <h4 className="font-bold text-white mt-1">{cell.name}</h4>
                      <div className="text-[10px] text-slate-400 mt-1">{cell.filled}% filled</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="lg:col-span-4 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative flex flex-col justify-between min-h-[220px]">
                <div>
                  <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-purple-400 animate-pulse" />
                    AI space optimization sugg.
                  </h2>

                  <div className="space-y-3.5 text-xs">
                    <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                      <h4 className="font-bold text-cyan-400">Coimbatore Restructure</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Coimbatore lumber bay is at 92% capacity. Suggest moving hardware crates to Chennai bin-06.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          
          // ==========================================
          // DETAILS: DETAILS VIEW FOR COIMBATORE WAREHOUSE
          // ==========================================
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Header with Back button */}
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-6 mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveWarehouse(null)}
                  className="p-2 border border-white/10 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400">Facility Details twin</span>
                  <h1 className="text-2xl font-extrabold text-white">{activeWarehouse} Details</h1>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert('Exporting Inventory CSV')}
                  className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileDown className="w-4 h-4" />
                  Export Inventory
                </button>
              </div>
            </div>

            {/* Summary card & Fast/Slow-Moving Vitals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Summary Card */}
              <div className="lg:col-span-4 bg-gradient-to-b from-[#0b081e]/80 to-[#05060f]/80 border border-purple-500/20 p-6 rounded-2xl relative">
                <h3 className="font-extrabold text-sm uppercase text-slate-400 mb-4 pb-2 border-b border-white/[0.06]">
                  Warehouse Summary Card
                </h3>

                <div className="space-y-3.5 text-xs font-bold">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupancy Cap:</span>
                    <span className="text-white">92% utilization</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Capacity:</span>
                    <span className="text-white">5,000 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Warehouse Manager:</span>
                    <span className="text-cyan-400">Elena Rodriguez</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Asset Value:</span>
                    <span className="text-emerald-400">₹3,45,000</span>
                  </div>
                  <div className="flex justify-between border-t border-white/[0.05] pt-3">
                    <span className="text-slate-400">Last Audited:</span>
                    <span className="text-slate-300">Just Now</span>
                  </div>
                </div>
              </div>

              {/* Fast/Slow-Moving Analysis */}
              <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
                <h3 className="font-extrabold text-sm uppercase text-slate-200 mb-4">
                  Material flow velocity analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-green-500/5 border border-green-500/20 rounded-xl">
                    <span className="text-[9px] uppercase font-black text-green-400 tracking-wider">Fast Moving</span>
                    <h4 className="font-extrabold text-white mt-1">Wooden Chair</h4>
                    <p className="text-[9px] text-slate-400 mt-1">Stock turnover rate: 9.4x per year. Demand forecast high.</p>
                  </div>
                  <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <span className="text-[9px] uppercase font-black text-amber-400 tracking-wider">Slow Moving</span>
                    <h4 className="font-extrabold text-white mt-1">Fabric Sofa</h4>
                    <p className="text-[9px] text-slate-400 mt-1">Average inventory storage duration: 32 days. Restocking postponed.</p>
                  </div>
                  <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <span className="text-[9px] uppercase font-black text-red-400 tracking-wider">Dead Stock</span>
                    <h4 className="font-extrabold text-white mt-1">Beds (Bin-07)</h4>
                    <p className="text-[9px] text-slate-400 mt-1">No transaction log for 45 days. Capacity clearance alert.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Inventory table */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
                <h2 className="text-md font-bold uppercase tracking-wider text-slate-200">
                  Warehouse SKU Ledger
                </h2>

                <div className="flex gap-2 text-xs font-bold">
                  {/* Category filters */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-lg text-slate-300 py-1.5 px-3 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-lg text-slate-300 py-1.5 px-3 focus:outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 text-left">Product</th>
                      <th className="pb-3 text-left">Category</th>
                      <th className="pb-3 text-left">SKU</th>
                      <th className="pb-3 text-left">Quantity</th>
                      <th className="pb-3 text-left">Unit Price</th>
                      <th className="pb-3 text-left">Total Value</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => {
                      let badge = 'bg-green-500/10 border-green-500/30 text-green-400'
                      if (item.status === 'Low Stock') badge = 'bg-amber-500/10 border-amber-500/30 text-amber-400'

                      return (
                        <tr key={item.sku} className="border-b border-white/[0.04] hover:bg-white/[0.01]">
                          <td className="py-3 font-bold text-white text-left">{item.product}</td>
                          <td className="py-3 text-slate-400 text-left">{item.category}</td>
                          <td className="py-3 text-slate-400 text-left font-mono">{item.sku}</td>
                          <td className="py-3 font-bold text-slate-200 text-left">{item.qty} pcs</td>
                          <td className="py-3 text-slate-300 text-left">₹{item.price.toLocaleString()}</td>
                          <td className="py-3 font-black text-cyan-400 text-left">₹{(item.qty * item.price).toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${badge}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

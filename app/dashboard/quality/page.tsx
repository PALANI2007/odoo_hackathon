'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  CheckCircle2, AlertTriangle, Search, PlusCircle, 
  X, ShieldCheck, Sparkles, Filter, ShieldAlert
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts'

interface QualityAudit {
  id: string
  product: string
  sku: string
  inspector: string
  status: 'Passed' | 'Failed'
  defectType: 'None' | 'Surface Scratch' | 'Dimensional Variance' | 'Alignment Defect' | 'Pneumatic Failure'
  date: string
}

const initialAudits: QualityAudit[] = [
  { id: 'QA-5008', product: 'Wooden Chair', sku: 'FUR-CHA-01', inspector: 'David Kim', status: 'Passed', defectType: 'None', date: '2026-06-20' },
  { id: 'QA-5007', product: 'Executive Desk', sku: 'FUR-DES-03', inspector: 'David Kim', status: 'Passed', defectType: 'None', date: '2026-06-20' },
  { id: 'QA-5006', product: 'Ergonomic Chair', sku: 'FUR-CHA-05', inspector: 'David Kim', status: 'Failed', defectType: 'Alignment Defect', date: '2026-06-19' },
  { id: 'QA-5005', product: 'Dining Table', sku: 'FUR-TAB-02', inspector: 'David Kim', status: 'Passed', defectType: 'None', date: '2026-06-19' },
  { id: 'QA-5004', product: 'Fabric Sofa', sku: 'FUR-SOF-01', inspector: 'David Kim', status: 'Failed', defectType: 'Surface Scratch', date: '2026-06-18' },
  { id: 'QA-5003', product: 'Wooden Wardrobe', sku: 'FUR-WAR-04', inspector: 'David Kim', status: 'Passed', defectType: 'None', date: '2026-06-17' },
  { id: 'QA-5002', product: 'Office Bookshelf', sku: 'FUR-BOK-01', inspector: 'David Kim', status: 'Passed', defectType: 'None', date: '2026-06-16' }
]

const defectColors = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#EC4899']

const productsList = [
  { name: 'Wooden Chair', sku: 'FUR-CHA-01' },
  { name: 'Dining Table', sku: 'FUR-TAB-02' },
  { name: 'Fabric Sofa', sku: 'FUR-SOF-01' },
  { name: 'Wooden Wardrobe', sku: 'FUR-WAR-04' },
  { name: 'Office Bookshelf', sku: 'FUR-BOK-01' },
  { name: 'Ergonomic Chair', sku: 'FUR-CHA-05' },
  { name: 'Executive Desk', sku: 'FUR-DES-03' }
]

export default function QualityPage() {
  const { user } = useAuth()
  const [audits, setAudits] = useState<QualityAudit[]>(initialAudits)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Passed' | 'Failed'>('All')
  const [selectedAuditId, setSelectedAuditId] = useState<string>('QA-5008')

  // Hydration safety
  const [isMounted, setIsMounted] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSku, setSelectedSku] = useState(productsList[0].sku)
  const [auditStatus, setAuditStatus] = useState<'Passed' | 'Failed'>('Passed')
  const [defectType, setDefectType] = useState<QualityAudit['defectType']>('None')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeAudit = useMemo(() => {
    return audits.find(a => a.id === selectedAuditId) || audits[0]
  }, [audits, selectedAuditId])

  // Stats calculation
  const stats = useMemo(() => {
    const total = audits.length
    const passed = audits.filter(a => a.status === 'Passed').length
    const failed = audits.filter(a => a.status === 'Failed').length
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 100

    return {
      total,
      passed,
      failed,
      passRate
    }
  }, [audits])

  // Defect breakdown Pie chart data
  const defectData = useMemo(() => {
    const counts: Record<string, number> = {}
    audits.forEach(a => {
      if (a.defectType !== 'None') {
        counts[a.defectType] = (counts[a.defectType] || 0) + 1
      }
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [audits])

  // Filtered audits
  const filteredAudits = useMemo(() => {
    return audits.filter(a => {
      const matchSearch = a.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.sku.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'All' || a.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [audits, searchQuery, statusFilter])

  // Handle Add Audit
  const handleAddAudit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const matchedProd = productsList.find(p => p.sku === selectedSku)
    if (!matchedProd) return

    const newAudit: QualityAudit = {
      id: `QA-5${Math.floor(Math.random() * 900) + 100}`,
      product: matchedProd.name,
      sku: matchedProd.sku,
      inspector: user?.name || 'David Kim',
      status: auditStatus,
      defectType: auditStatus === 'Passed' ? 'None' : defectType,
      date: new Date().toISOString().split('T')[0]
    }

    setAudits(prev => [newAudit, ...prev])
    setSelectedAuditId(newAudit.id)
    setIsModalOpen(false)

    // Reset Form
    setAuditStatus('Passed')
    setDefectType('None')

    confetti({
      particleCount: 50,
      spread: 60,
      colors: auditStatus === 'Passed' ? ['#22C55E', '#06B6D4'] : ['#EF4444', '#F59E0B']
    })
  }

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
            Quality Control Core
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Quality Inspection 🛡️
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct product audits, log defect classifications, and monitor yield margins.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Issue Quality Audit
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Inspections Vetted', value: stats.total, desc: 'Logged QA checkpoint audits', color: 'border-slate-500/25', icon: <CheckCircle2 className="w-4 h-4 text-slate-400" /> },
          { title: 'Inspection Pass Index', value: `${stats.passRate}%`, desc: 'Product qualification efficiency', color: 'border-emerald-500/25', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
          { title: 'Passed Products', value: stats.passed, desc: 'Qualified asset batches', color: 'border-cyan-500/25', icon: <CheckCircle2 className="w-4 h-4 text-cyan-400 animate-pulse" /> },
          { title: 'Flagged Defects', value: stats.failed, desc: 'Scrapped/quarantined asset units', color: 'border-red-500/25', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> }
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

      {/* Defect Analytics Chart */}
      <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl mb-8 z-10 relative">
        <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Defect Classification Analytics</h3>
        <div className="h-[220px] w-full flex justify-center items-center">
          {isMounted && defectData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={defectColors[index % defectColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 text-xs font-bold">No defect logs currently active.</div>
          )}
        </div>
      </div>

      {/* Main Grid: Table & Inspector details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: QA Audits Table (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden">
          
          {/* Header Controls */}
          <div className="p-5 border-b border-white/[0.05] bg-slate-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white">Inspections Ledger</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Physical product compliance audits</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by QA ID, product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/25"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Filter</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-white/10 text-white text-[10px] py-1.5 px-2 rounded-xl focus:outline-none"
                >
                  <option value="All">All Audits</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-slate-900/10 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-4">Audit ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Auditor</th>
                  <th className="p-4">Defect Category</th>
                  <th className="p-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    onClick={() => setSelectedAuditId(audit.id)}
                    className={`hover:bg-white/[0.01] text-xs font-bold cursor-pointer transition-all ${
                      audit.id === selectedAuditId ? 'bg-purple-950/20' : ''
                    }`}
                  >
                    <td className="p-4 font-mono text-[10px] text-cyan-400">{audit.id}</td>
                    <td className="p-4 text-slate-400 font-normal">{audit.date}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-white font-extrabold">{audit.product}</span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">{audit.sku}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-normal">{audit.inspector}</td>
                    <td className="p-4">
                      <span className="text-slate-400 font-normal">{audit.defectType}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        audit.status === 'Passed'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: QA Profile Details (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Defect Risk Alerts
            </h3>

            <div className="space-y-4">
              {activeAudit?.status === 'Failed' ? (
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-[10px] text-slate-300 leading-normal font-normal flex items-start gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <strong className="text-red-400 block font-bold">Defect Spike Flagged</strong>
                    Audit {activeAudit?.id} failed due to <span className="font-bold text-white">{activeAudit?.defectType}</span>. Model suggests testing workorder parameters in Node-10 tooling systems.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-normal">
                  Quality pass rates nominal. Scrap levels within safety parameters. No active workstation defects detected.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Issue Audit Modal */}
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
                <h3 className="text-lg font-black tracking-tight text-white">Record Quality Check</h3>
                <p className="text-xs text-slate-400 mt-1">Audit physical product quality compliance benchmarks.</p>
              </div>

              <form onSubmit={handleAddAudit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Select Product</label>
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
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Audit Result</label>
                    <select
                      value={auditStatus}
                      onChange={(e) => setAuditStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="Passed">Passed (Nominal)</option>
                      <option value="Failed">Failed (Defective)</option>
                    </select>
                  </div>

                  {auditStatus === 'Failed' && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Defect Category</label>
                      <select
                        value={defectType}
                        onChange={(e) => setDefectType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      >
                        <option value="Surface Scratch">Surface Scratch</option>
                        <option value="Dimensional Variance">Dimensional Variance</option>
                        <option value="Alignment Defect">Alignment Defect</option>
                        <option value="Pneumatic Failure">Pneumatic Failure</option>
                      </select>
                    </div>
                  )}
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
                    Commit Audit
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

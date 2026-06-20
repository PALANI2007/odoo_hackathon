'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Users, Search, PlusCircle, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, X, Coins, Target, Award
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

interface Customer {
  id: string
  name: string
  company: string
  segment: 'B2B' | 'B2C'
  ltv: number
  region: 'North' | 'South' | 'East' | 'West'
  dateJoined: string
}

const initialCustomers: Customer[] = [
  { id: 'CST-001', name: 'Ramesh Nair', company: 'Tata Steel Labs', segment: 'B2B', ltv: 500000, region: 'East', dateJoined: '2026-01-15' },
  { id: 'CST-002', name: 'Ananya Sharma', company: 'Aero Logistics', segment: 'B2B', ltv: 250000, region: 'West', dateJoined: '2026-02-10' },
  { id: 'CST-003', name: 'Siddharth Sen', company: 'Reliance Retail', segment: 'B2B', ltv: 450000, region: 'West', dateJoined: '2026-02-22' },
  { id: 'CST-004', name: 'Amit Verma', company: 'Individual', segment: 'B2C', ltv: 12000, region: 'North', dateJoined: '2026-03-05' },
  { id: 'CST-005', name: 'Priya Patel', company: 'Individual', segment: 'B2C', ltv: 15500, region: 'South', dateJoined: '2026-03-12' },
  { id: 'CST-006', name: 'Ketan Patel', company: 'Green Energy Corp', segment: 'B2B', ltv: 180000, region: 'North', dateJoined: '2026-04-01' },
  { id: 'CST-007', name: 'Meera Deshmukh', company: 'Wipro Digital', segment: 'B2B', ltv: 350000, region: 'South', dateJoined: '2026-04-18' }
]

const COLORS = ['#7C3AED', '#06B6D4']

export default function CustomersPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentFilter, setSegmentFilter] = useState<'All' | 'B2B' | 'B2C'>('All')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CST-001')
  
  // Hydration safety
  const [isMounted, setIsMounted] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newSegment, setNewSegment] = useState<'B2B' | 'B2C'>('B2B')
  const [newLtv, setNewLtv] = useState('')
  const [newRegion, setNewRegion] = useState<'North' | 'South' | 'East' | 'West'>('North')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0]
  }, [customers, selectedCustomerId])

  // Stats calculation
  const stats = useMemo(() => {
    const totalLTV = customers.reduce((acc, c) => acc + c.ltv, 0)
    const avgLTV = totalLTV / customers.length
    const b2bCount = customers.filter(c => c.segment === 'B2B').length
    const b2cCount = customers.filter(c => c.segment === 'B2C').length

    return {
      total: customers.length,
      b2bShare: Math.round((b2bCount / customers.length) * 100),
      avgLtv: Math.round(avgLTV),
      activeAccounts: customers.filter(c => c.ltv > 50000).length
    }
  }, [customers])

  // Pie Chart Data
  const segmentData = useMemo(() => {
    const b2b = customers.filter(c => c.segment === 'B2B').length
    const b2c = customers.filter(c => c.segment === 'B2C').length
    return [
      { name: 'B2B Accounts', value: b2b },
      { name: 'B2C Accounts', value: b2c }
    ]
  }, [customers])

  // Bar Chart Data (LTV per Region)
  const regionalData = useMemo(() => {
    const regions = { North: 0, South: 0, East: 0, West: 0 }
    customers.forEach(c => {
      regions[c.region] += c.ltv
    })
    return Object.entries(regions).map(([name, value]) => ({ name, value }))
  }, [customers])

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchSegment = segmentFilter === 'All' || c.segment === segmentFilter
      return matchSearch && matchSegment
    })
  }, [customers, searchQuery, segmentFilter])

  // Handle Add Customer
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    const ltvVal = parseFloat(newLtv)
    if (isNaN(ltvVal) || ltvVal < 0) {
      alert('Please enter a valid Lifetime Value.')
      return
    }

    const newCust: Customer = {
      id: `CST-0${Math.floor(Math.random() * 90) + 10}`,
      name: newName,
      company: newSegment === 'B2C' ? 'Individual' : newCompany,
      segment: newSegment,
      ltv: ltvVal,
      region: newRegion,
      dateJoined: new Date().toISOString().split('T')[0]
    }

    setCustomers(prev => [newCust, ...prev])
    setSelectedCustomerId(newCust.id)
    setIsModalOpen(false)

    // Reset Form
    setNewName('')
    setNewCompany('')
    setNewLtv('')

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#7C3AED', '#06B6D4']
    })
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-8 relative select-none font-sans overflow-x-hidden">
      
      {/* Decorative background lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            CRM Database
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Customer Profile Center 🎯
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit B2B scale accounts, customer segments, lifetime valuations, and regional sales distribution.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Register Customer
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Total Customers', value: stats.total, desc: 'Registered accounts', color: 'border-slate-500/25', icon: <Users className="w-4 h-4 text-slate-400" /> },
          { title: 'B2B Revenue Share', value: `${stats.b2bShare}%`, desc: 'Enterprise accounts dominance index', color: 'border-purple-500/25', icon: <Target className="w-4 h-4 text-purple-400" /> },
          { title: 'Average LTV', value: `₹${stats.avgLtv.toLocaleString('en-IN')}`, desc: 'Mean customer lifetime value', color: 'border-cyan-500/25', icon: <Coins className="w-4 h-4 text-cyan-400" /> },
          { title: 'High Value Accounts', value: stats.activeAccounts, desc: 'Valuations exceeding ₹50K', color: 'border-emerald-500/25', icon: <Award className="w-4 h-4 text-emerald-400" /> }
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

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 z-10 relative">
        
        {/* Pie chart segment */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Customer Segments Distribution</h3>
          <div className="h-[220px] w-full flex justify-center items-center">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Regional bar chart */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">Regional Sales Distribution (LTV Net)</h3>
          <div className="h-[220px] w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: 9, fontWeight: 'bold' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090714', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }} 
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'LTV Value']}
                  />
                  <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]}>
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7C3AED' : '#06B6D4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Main Grid: Customer Table & Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Customers Table (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden">
          
          {/* Controls Header */}
          <div className="p-5 border-b border-white/[0.05] bg-slate-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white">Registered Accounts</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Corporate B2B profiles and consumer segments</p>
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

              {/* Segment Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Segment</span>
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value as any)}
                  className="bg-slate-950 border border-white/10 text-white text-[10px] py-1.5 px-2 rounded-xl focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="B2B">B2B (Corp)</option>
                  <option value="B2C">B2C (Retail)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-slate-900/10 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                  <th className="p-4">Customer ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Enterprise/Company</th>
                  <th className="p-4">Segment</th>
                  <th className="p-4">Lifetime Value</th>
                  <th className="p-4">Region</th>
                  <th className="p-4">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`hover:bg-white/[0.01] text-xs font-bold cursor-pointer transition-all ${
                      cust.id === selectedCustomerId ? 'bg-purple-950/20' : ''
                    }`}
                  >
                    <td className="p-4 font-mono text-[10px] text-cyan-400">{cust.id}</td>
                    <td className="p-4 text-white font-extrabold">{cust.name}</td>
                    <td className="p-4 text-slate-300 font-normal">{cust.company}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        cust.segment === 'B2B' 
                          ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                          : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                      }`}>
                        {cust.segment}
                      </span>
                    </td>
                    <td className="p-4 text-slate-200">₹{cust.ltv.toLocaleString('en-IN')}</td>
                    <td className="p-4 font-normal text-slate-400">{cust.region}</td>
                    <td className="p-4 font-normal text-slate-400">{cust.dateJoined}</td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-xs text-slate-500 font-normal">
                      No accounts found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Customer Details (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Customer Insight Node
            </h3>

            <div className="text-center my-4">
              <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-xl mx-auto mb-2">
                👤
              </div>
              <h4 className="text-sm font-extrabold text-white">{activeCustomer?.name}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{activeCustomer?.company}</p>
            </div>

            <div className="border-t border-white/[0.05] pt-4 mt-2 space-y-3">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black block">AI Account Prognosis</span>
              {activeCustomer?.ltv > 300000 ? (
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl text-[10px] text-slate-300 leading-normal font-normal">
                  <strong className="text-purple-400 block font-bold mb-0.5">Tier 1 Key Account</strong>
                  Ranks in the top 10% lifetime spend. Recommend prioritizing high-tier service SLAs and scheduling quarterly account optimization check-ins.
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-normal">
                  <strong className="text-cyan-400 block font-bold mb-0.5">Standard Account Profile</strong>
                  Predictive LTV model predicts a 15% increase in purchase volume by next quarter under active product recommendation campaigns.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Add Customer Modal */}
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
                <h3 className="text-lg font-black tracking-tight text-white">Register Client Profile</h3>
                <p className="text-xs text-slate-400 mt-1">Ingest new customer data into the relational sales registries.</p>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ramesh Nair"
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Segment</label>
                    <select
                      value={newSegment}
                      onChange={(e) => setNewSegment(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="B2B">B2B (Enterprise)</option>
                      <option value="B2C">B2C (Retail)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Region</label>
                    <select
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                    </select>
                  </div>
                </div>

                {newSegment === 'B2B' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Enterprise Company</label>
                    <input
                      type="text"
                      required={newSegment === 'B2B'}
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="e.g. Tata Steel Labs"
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Initial Lifetime Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={newLtv}
                    onChange={(e) => setNewLtv(e.target.value)}
                    placeholder="e.g. 500000"
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
                    Register Client
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

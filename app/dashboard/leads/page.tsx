'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Users, Search, PlusCircle, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, X, Filter, Target, Coins, TrendingUp
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Lead {
  id: string
  title: string
  company: string
  value: number
  stage: 'New' | 'Qualified' | 'Proposition' | 'Won'
  probability: number
  contact: string
  phone: string
}

const initialLeads: Lead[] = [
  { id: 'LD-401', title: 'ERP Expansion Deal', company: 'Tata Steel Labs', value: 500000, stage: 'Proposition', probability: 88, contact: 'Ramesh Nair', phone: '+91 98450 12345' },
  { id: 'LD-402', title: 'Nexus Suite Licenses', company: 'Aero Logistics', value: 250000, stage: 'Qualified', probability: 65, contact: 'Ananya Sharma', phone: '+91 99160 54321' },
  { id: 'LD-403', title: 'Supply Chain Integration', company: 'Reliance Retail', value: 450000, stage: 'Won', probability: 100, contact: 'Siddharth Sen', phone: '+91 98760 11223' },
  { id: 'LD-404', title: 'Database Cloud Migration', company: 'Infotech India', value: 80000, stage: 'New', probability: 35, contact: 'Vikram Mehta', phone: '+91 90080 99887' },
  { id: 'LD-405', title: 'CRM Portal Setup', company: 'Techcorp Systems', value: 120000, stage: 'New', probability: 45, contact: 'Pooja Hegde', phone: '+91 88840 77665' },
  { id: 'LD-406', title: 'Digital Twin Prototype', company: 'Green Energy Corp', value: 180000, stage: 'Qualified', probability: 70, contact: 'Ketan Patel', phone: '+91 77760 55443' },
  { id: 'LD-407', title: 'Enterprise Support SLA', company: 'Wipro Digital', value: 350000, stage: 'Won', probability: 100, contact: 'Meera Deshmukh', phone: '+91 99000 88776' }
]

export default function LeadsPage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState<string>('LD-401')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newContact, setNewContact] = useState('')
  const [newPhone, setNewPhone] = useState('')

  // Dynamic statistics
  const stats = useMemo(() => {
    const active = leads.filter(l => l.stage !== 'Won')
    const totalPipeline = active.reduce((acc, l) => acc + l.value, 0)
    const wonCount = leads.filter(l => l.stage === 'Won').length
    const conversionRate = Math.round((wonCount / leads.length) * 100)
    
    return {
      total: leads.length,
      pipeline: totalPipeline,
      won: wonCount,
      rate: conversionRate
    }
  }, [leads])

  const activeSelectedLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || leads[0]
  }, [leads, selectedLeadId])

  // Filter leads based on search
  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contact.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [leads, searchQuery])

  // Handle stage advancement
  const advanceStage = (id: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        let nextStage: Lead['stage'] = l.stage
        let nextProb = l.probability
        
        if (l.stage === 'New') {
          nextStage = 'Qualified'
          nextProb = 65
        } else if (l.stage === 'Qualified') {
          nextStage = 'Proposition'
          nextProb = 85
        } else if (l.stage === 'Proposition') {
          nextStage = 'Won'
          nextProb = 100
          confetti({
            particleCount: 100,
            spread: 70,
            colors: ['#7C3AED', '#06B6D4', '#22C55E']
          })
        }
        
        return { ...l, stage: nextStage, probability: nextProb }
      }
      return l
    }))
  }

  // Handle Add Lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(newValue)
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid value.')
      return
    }

    const newLead: Lead = {
      id: `LD-${Math.floor(Math.random() * 900) + 100}`,
      title: newTitle,
      company: newCompany,
      value: val,
      stage: 'New',
      probability: 30,
      contact: newContact || 'TBD',
      phone: newPhone || 'TBD'
    }

    setLeads(prev => [newLead, ...prev])
    setSelectedLeadId(newLead.id)
    setIsModalOpen(false)
    
    // Reset Form
    setNewTitle('')
    setNewCompany('')
    setNewValue('')
    setNewContact('')
    setNewPhone('')

    confetti({ particleCount: 30, spread: 40 })
  }

  // Group leads by stage
  const stages: Array<{ name: Lead['stage']; color: string; border: string }> = [
    { name: 'New', color: 'text-slate-400', border: 'border-slate-500/25' },
    { name: 'Qualified', color: 'text-cyan-400', border: 'border-cyan-500/25' },
    { name: 'Proposition', color: 'text-purple-400', border: 'border-purple-500/25' },
    { name: 'Won', color: 'text-emerald-400', border: 'border-emerald-500/25' }
  ]

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
            CRM Lead Pipeline
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Leads & Pipeline Tracker 👥
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline monitoring, customer conversions, and AI deal-win predictions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Create Lead
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Total Leads Vetted', value: stats.total, desc: 'Acquired sales opportunities', color: 'border-slate-500/25', icon: <Users className="w-4 h-4 text-slate-400" /> },
          { title: 'Pipeline Net Worth', value: `₹${stats.pipeline.toLocaleString('en-IN')}`, desc: 'Active pipeline contract value', color: 'border-purple-500/25', icon: <Coins className="w-4 h-4 text-purple-400 text-lg" /> },
          { title: 'Deals Sealed', value: stats.won, desc: 'Successful conversions', color: 'border-emerald-500/25', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
          { title: 'Conversion Index', value: `${stats.rate}%`, desc: 'Leads won conversion efficiency', color: 'border-cyan-500/25', icon: <Target className="w-4 h-4 text-cyan-400" /> }
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

      {/* Main Pipeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left 8 Columns: Pipeline Kanban Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Search Header */}
          <div className="flex justify-between items-center bg-slate-950/40 p-4 border border-white/[0.05] rounded-2xl backdrop-blur-xl">
            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/25"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Marcus Johnson (Sales Executive)</span>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {stages.map((stage) => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage.name)
              return (
                <div key={stage.name} className="flex flex-col gap-3.5">
                  {/* Column Header */}
                  <div className="flex justify-between items-center px-1">
                    <span className={`text-xs font-black uppercase tracking-wider ${stage.color}`}>{stage.name}</span>
                    <span className="bg-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="flex flex-col gap-3 min-h-[350px] bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-2xl">
                    <AnimatePresence mode="popLayout">
                      {stageLeads.map((lead) => (
                        <motion.div
                          key={lead.id}
                          layout
                          onClick={() => setSelectedLeadId(lead.id)}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 bg-slate-950/60 border rounded-xl cursor-pointer transition-all ${
                            lead.id === selectedLeadId 
                              ? 'border-purple-500/50 shadow-lg shadow-purple-500/5' 
                              : 'border-white/[0.05] hover:border-white/15'
                          }`}
                        >
                          <span className="text-[8px] font-mono text-cyan-400 block">{lead.id}</span>
                          <h4 className="text-xs font-extrabold text-white mt-1 leading-snug">{lead.title}</h4>
                          <div className="flex justify-between items-center mt-2.5">
                            <span className="text-[10px] text-slate-400 font-normal">{lead.company}</span>
                            <span className="text-[10px] font-black text-slate-200">₹{lead.value.toLocaleString('en-IN')}</span>
                          </div>

                          {/* Action button inside card */}
                          {lead.stage !== 'Won' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                advanceStage(lead.id)
                              }}
                              className="w-full mt-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 text-white font-bold text-[9px] uppercase tracking-wider py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Advance Stage
                              <ArrowRight className="w-2.5 h-2.5 text-cyan-400" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {stageLeads.length === 0 && (
                      <div className="flex-1 flex items-center justify-center text-center p-4">
                        <span className="text-[9px] text-slate-600 font-normal italic">No leads in stage</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* Right 4 Columns: Lead Details & AI Predictive Win-Rate */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Win Rate Gauge */}
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                AI Opportunity Vetting
              </h3>
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">Win-Score</span>
            </div>

            {/* Circular Win Rate representation */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Simulated circle stroke */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="url(#aiGlowGrad)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (activeSelectedLead?.probability || 30)) / 100}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="aiGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">{activeSelectedLead?.probability || 30}%</span>
                  <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest block mt-0.5">Win Prob</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <h4 className="text-sm font-extrabold text-white">{activeSelectedLead?.company}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Deal Valued: <strong className="text-emerald-400">₹{(activeSelectedLead?.value || 0).toLocaleString('en-IN')}</strong></p>
              </div>
            </div>

            <div className="border-t border-white/[0.05] pt-4 mt-2 space-y-3">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black block">AI Next Steps Proposal</span>
              {activeSelectedLead?.stage === 'Won' ? (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Deal successfully won. Requisitioning PO generation.
                </div>
              ) : activeSelectedLead?.probability > 80 ? (
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl text-[10px] text-slate-300 leading-normal font-normal">
                  <strong className="text-purple-400 block font-bold mb-0.5">High Probability Deal</strong>
                  Tata Steel proposal has completed initial vetting. Finalize terms and schedule billing signatures immediately.
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-normal">
                  <strong className="text-cyan-400 block font-bold mb-0.5">Vetting Recommended</strong>
                  Lead requires further qualifiers. Vette company scale with customer reference profiles and execute a live platform overview.
                </div>
              )}
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-3">Lead Contact Profile</h3>
            
            <div className="space-y-3 text-xs font-bold">
              <div className="flex justify-between pb-2.5 border-b border-white/[0.03]">
                <span className="text-slate-500 font-normal">Client contact name:</span>
                <span className="text-white">{activeSelectedLead?.contact}</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-white/[0.03]">
                <span className="text-slate-500 font-normal">Phone:</span>
                <span className="text-cyan-400 font-normal select-text">{activeSelectedLead?.phone}</span>
              </div>
              <div className="flex justify-between pb-2.5 border-b border-white/[0.03]">
                <span className="text-slate-500 font-normal">Target value:</span>
                <span className="text-white">₹{(activeSelectedLead?.value || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-normal">Stage:</span>
                <span className="text-purple-400 uppercase tracking-wider">{activeSelectedLead?.stage}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Create Lead Modal */}
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
                <h3 className="text-lg font-black tracking-tight text-white">Create Sales Opportunity</h3>
                <p className="text-xs text-slate-400 mt-1">Initiate a B2B lead inside the active sales database.</p>
              </div>

              <form onSubmit={handleAddLead} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deal Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. ERP Expansion Licenses"
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Tata Steel"
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      placeholder="e.g. Ramesh Nair"
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="e.g. +91 98450 12345"
                      className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
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
                    Ingest Lead
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

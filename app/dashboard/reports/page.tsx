'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  FileText, PlusCircle, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, X, FileDown, Cpu, RefreshCw
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface DocumentReport {
  id: string
  title: string
  category: string
  date: string
  fileSize: string
  status: 'Ready' | 'Compiling' | 'Draft'
  downloads: number
}

const initialReports: DocumentReport[] = [
  { id: 'REP-101', title: 'Q2 Financial Audit & Ledger', category: 'Finance', date: '2026-06-20', fileSize: '4.8 MB', status: 'Ready', downloads: 35 },
  { id: 'REP-102', title: 'Warehouse Utilization & Heatmap Plan', category: 'Inventory', date: '2026-06-20', fileSize: '12.4 MB', status: 'Ready', downloads: 12 },
  { id: 'REP-103', title: 'Supplier Risk Assessment & Vetting Score', category: 'Procurement', date: '2026-06-19', fileSize: '2.3 MB', status: 'Ready', downloads: 24 },
  { id: 'REP-104', title: 'Workstation Calibration & Cycle Analysis', category: 'Manufacturing', date: '2026-06-18', fileSize: '8.1 MB', status: 'Ready', downloads: 9 }
]

export default function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<DocumentReport[]>(initialReports)
  const [selectedReportId, setSelectedReportId] = useState<string>('REP-101')
  
  // Compiler State
  const [isCompiling, setIsCompiling] = useState(false)
  const [compilingStep, setCompilingStep] = useState(0)
  const [compilingName, setCompilingName] = useState('')

  const activeReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId) || reports[0]
  }, [reports, selectedReportId])

  // Trigger compiler
  const compileReport = (title: string) => {
    setIsCompiling(true)
    setCompilingStep(1)
    setCompilingName(title)

    const steps = [
      () => setCompilingStep(2), // Querying database logs
      () => setCompilingStep(3), // Compiling Recharts tables
      () => setCompilingStep(4), // Formatting PDF document
      () => {
        setIsCompiling(false)
        
        const newRep: DocumentReport = {
          id: `REP-${Math.floor(Math.random() * 900) + 100}`,
          title: compilingName,
          category: 'Executive',
          date: new Date().toISOString().split('T')[0],
          fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
          status: 'Ready',
          downloads: 0
        }

        setReports(prev => [newRep, ...prev])
        setSelectedReportId(newRep.id)

        confetti({
          particleCount: 150,
          spread: 80,
          colors: ['#7C3AED', '#06B6D4', '#22C55E']
        })
      }
    ]

    steps.forEach((stepFn, index) => {
      setTimeout(stepFn, (index + 1) * 1100)
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
            Executive Documents
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Reports & Audits Center 📊
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compile real-time business performance summaries, department logs, and safety stock audits.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => {
              const name = prompt('Enter Report Title:')
              if (name) compileReport(name)
            }}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Compile Custom Report
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Reports Table List (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden p-6">
          <h3 className="font-extrabold text-sm text-white mb-4">Relational Document Registry</h3>
          
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                  rep.id === selectedReportId 
                    ? 'bg-purple-950/30 border-purple-500/50 shadow-lg shadow-purple-500/5' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/25 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    📄
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-cyan-400 block">{rep.id}</span>
                    <h4 className="text-xs font-extrabold text-white mt-0.5 leading-snug">{rep.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-400 font-normal">
                      <span>Category: <strong className="text-slate-300 font-bold">{rep.category}</strong></span>
                      <span>•</span>
                      <span>Size: <strong className="text-slate-300 font-bold">{rep.fileSize}</strong></span>
                      <span>•</span>
                      <span>Date: <strong className="text-slate-300 font-bold">{rep.date}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      alert(`Downloading ${rep.title}.pdf`)
                      setReports(prev => prev.map(r => r.id === rep.id ? { ...r, downloads: r.downloads + 1 } : r))
                      confetti({ particleCount: 30, spread: 40 })
                    }}
                    className="bg-slate-900 hover:bg-slate-800 border border-white/5 text-[9px] uppercase font-bold py-1.5 px-3 rounded-lg text-cyan-400 hover:text-white cursor-pointer flex items-center gap-1"
                  >
                    <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Reports Analyzer (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Document Prognosis
            </h3>

            <div className="text-center my-4">
              <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-xl mx-auto mb-2">
                📊
              </div>
              <h4 className="text-xs font-extrabold text-white">{activeReport?.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Report size: {activeReport?.fileSize}</p>
            </div>

            <div className="border-t border-white/[0.05] pt-4 mt-2 space-y-3">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-black block">AI Abstract Digest</span>
              {activeReport?.category === 'Finance' ? (
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl text-[10px] text-slate-300 leading-normal font-normal">
                  <strong className="text-purple-400 block font-bold mb-0.5">Finance Executive Digest</strong>
                  Gross revenue is stable at ₹28.3L with Q2 profits exceeding target at ₹12.2L (+14.8% MoM). Operating expenses are optimized, and cash flows are healthy.
                </div>
              ) : activeReport?.category === 'Inventory' ? (
                <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-[10px] text-slate-300 leading-normal font-normal">
                  <strong className="text-cyan-400 block font-bold mb-0.5">Inventory Operations Digest</strong>
                  Coimbatore capacity occupancy is critical at 92%. Active reorder recommendations for 2 SKU channels have been dispatched. Proposed layout twins show a 15% space recovery potential.
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-normal">
                  General compilation index is healthy. This report has been downloaded <span className="font-bold text-white">{activeReport?.downloads} times</span>.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Compiler Overlay */}
      <AnimatePresence>
        {isCompiling && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0c071d] border border-purple-500/30 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative text-center"
            >
              <Cpu className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <h3 className="text-md font-black tracking-wider text-white uppercase mb-2">Compiling Business Summary</h3>
              
              <div className="space-y-4 mt-6 text-left">
                {[
                  { label: 'Ingesting Odoo database logs', stepNum: 1 },
                  { label: 'Compiling Recharts tables', stepNum: 2 },
                  { label: 'Formatting PDF documents', stepNum: 3 }
                ].map((s) => (
                  <div key={s.stepNum} className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-black shrink-0 ${
                      compilingStep >= s.stepNum ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/10 text-transparent'
                    }`}>
                      {compilingStep >= s.stepNum && '✓'}
                    </div>
                    <span className={compilingStep >= s.stepNum ? 'text-white' : 'text-slate-500'}>{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

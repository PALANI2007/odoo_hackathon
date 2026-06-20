'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Sparkles, Send, Mic, Volume2, X, Cpu, RefreshCw, BarChart3,
  Layers, CheckCircle2, Coins, FileText, ChevronRight, User, AlertTriangle
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  insights?: Array<{ title: string; desc: string; stat: string; color: string }>
}

const INSIGHTS_MAPPING: Record<string, Message['insights']> = {
  sales: [
    { title: 'Top Performer SKU', desc: 'Wooden Tables lead Q2 sales revenue.', stat: '₹1.20L Revenue', color: 'border-purple-500/25 text-purple-400' },
    { title: 'Conversion Boost', desc: 'Active conversions spiked to 32.5% this month.', stat: '+4.2% Boost', color: 'border-cyan-500/25 text-cyan-400' }
  ],
  procurement: [
    { title: 'Supplier Risk Vetted', desc: 'Diverting raw wood orders to Oak & Timber Co.', stat: '98% Score', color: 'border-purple-500/25 text-purple-400' },
    { title: 'Net Cost Reductions', desc: 'Transition generated ₹54,300 in savings.', stat: '₹54k Saved', color: 'border-emerald-500/25 text-emerald-400' }
  ],
  mfg: [
    { title: 'Assembly Delay Alert', desc: 'Node-10 pneumatic downtime warnings.', stat: '84% Efficiency', color: 'border-amber-500/25 text-amber-400 animate-pulse' },
    { title: 'QC Vitals Nominal', desc: 'Pass ratios maintained at 100% target.', stat: '0 defects', color: 'border-cyan-500/25 text-cyan-400' }
  ]
}

export default function AIAssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Voice Core States
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [voiceProcessing, setVoiceProcessing] = useState(false)

  // Report Generator States
  const [reportCompiling, setReportCompiling] = useState(false)
  const [compiledReport, setCompiledReport] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Initialize role-specific welcome message when user is loaded
  useEffect(() => {
    if (user) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: user.role === 'inventory'
            ? `Hello Elena Rodriguez! I am the ERP Nexus AI Assistant. I can audit warehouse stock levels, optimize multi-facility heatmaps, perform ARIMA stock shortage forecasts, and compile safety stock audits. What should we audit today?`
            : `Hello ${user.name || 'Administrator'}! I am the ERP Nexus AI Assistant. I can audit Odoo ledgers, perform ARIMA demand forecasting, vetting supplier scores, and generate executive summaries. What should we audit today?`,
          timestamp: new Date(),
          insights: user.role === 'inventory'
            ? [
                { title: 'Coimbatore Utilization', desc: 'Space optimization critical.', stat: '92% Occupied', color: 'border-red-500/25 text-red-400 animate-pulse' },
                { title: 'Reorders Pending', desc: 'Fabric Sofas and Ergonomic Chairs require restocking.', stat: '2 items', color: 'border-purple-500/25 text-purple-400' }
              ]
            : [
                { title: 'Enterprise Vitals', desc: 'Business Health Score is optimal.', stat: '92/100 Index', color: 'border-purple-500/25 text-purple-400' },
                { title: 'Inventory Warning', desc: 'Wood Top stocks critical.', stat: '5 remaining', color: 'border-red-500/25 text-red-400 animate-pulse' }
              ]
        }
      ])
    }
  }, [user])

  // Get AI Response matching command core
  const processQuery = async (query: string) => {
    setIsLoading(true)
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const q = query.toLowerCase()
    let reply = "I have audited the Odoo ledger. "
    let insights: Message['insights'] = undefined

    if (user?.role === 'inventory') {
      if (q.includes('coimbatore') || q.includes('critical') || q.includes('shortage')) {
        reply = "Coimbatore Warehouse Alert: Utilization is currently at 92%. Critical stock warnings are active on Ergonomic Chairs (0 remaining) and Fabric Sofas (3 remaining). I recommend transferring 20 Ergonomic Chairs from Bangalore's surplus stock (45 remaining) to Coimbatore."
        insights = [
          { title: 'Coimbatore Critical', desc: 'Ergonomic Chairs depleted.', stat: '0 in Stock', color: 'border-red-500/25 text-red-400' },
          { title: 'Bangalore Surplus', desc: 'Transfer source available.', stat: '45 in Stock', color: 'border-cyan-500/25 text-cyan-400' }
        ]
      } else if (q.includes('space') || q.includes('utilization') || q.includes('warehouse')) {
        reply = "Warehouse space optimization: Coimbatore is at 92% occupancy, Bangalore is at 82%, and Chennai is at 58%. The AI model recommends height-clearance re-rack layouts in Coimbatore Row-B, yielding a capacity recovery of 15%."
        insights = [
          { title: 'Optimized Layout', desc: 'Height-clearance recommendation.', stat: '+15% Space', color: 'border-emerald-500/25 text-emerald-400' }
        ]
      } else if (q.includes('forecast') || q.includes('predict') || q.includes('demand')) {
        reply = "ARIMA Shortage Forecast: Model predicts a 25% spike in Dining Table demand next month. Coimbatore stocks (18 units) will deplete by July 8th. I recommend setting the reorder level to 20 units and initiating replenishment."
        insights = [
          { title: 'Dining Tables', desc: 'Estimated depletion date.', stat: 'July 08', color: 'border-amber-500/25 text-amber-400 animate-pulse' }
        ]
      } else if (q.includes('reorder') || q.includes('restock') || q.includes('recommend')) {
        reply = "AI Reorder Recommendations: I suggest replenishing 25 Ergonomic Chairs (to Coimbatore) and 15 Fabric Sofas. Best rates found with ABC Woods (estimated savings of ₹8,500 under current procurement contract)."
        insights = [
          { title: 'Restock Target', desc: 'Chairs & Sofas.', stat: '2 Items', color: 'border-purple-500/25 text-purple-400' },
          { title: 'Procure Savings', desc: 'ABC Woods contract pricing.', stat: '₹8,500 Saved', color: 'border-emerald-500/25 text-emerald-400' }
        ]
      } else if (q.includes('report') || q.includes('audit')) {
        reply = "Compiling Inventory Audit & Safety Stock Report: Generated total asset valuation of ₹6.49L. Reorder alerts active on 2 SKU streams. Storage optimization proposal created."
        triggerReportCompilation()
      } else {
        reply = `Auditing complete. Coimbatore, Chennai, and Bangalore warehouse databases are synchronized and healthy. Let me know if you would like to run a space utilization audit or check safety stock thresholds.`
      }
    } else {
      if (q.includes('sell') || q.includes('product') || q.includes('sales')) {
        reply = "Sales Core Audit: Wooden Tables represent the highest volume driver this quarter (₹1,20,000 revenue across 154 transactions). Office Chairs rank second (₹85,000 revenue across 238 transactions). Growth is consistent at +14.8% YoY."
        insights = INSIGHTS_MAPPING.sales
      } else if (q.includes('procurement') || q.includes('items') || q.includes('restock') || q.includes('stock')) {
        reply = "Inventory & Procurement Shield: Critical stock warnings are active on Wood Tops (5 remaining) and Varnish Coatings (8 remaining). I recommend generating a cryptographic PO for 50 Wood Tops with Oak & Timber Co, saving approximately ₹6,000."
        insights = INSIGHTS_MAPPING.procurement
      } else if (q.includes('delay') || q.includes('manufacturing') || q.includes('mfg') || q.includes('factory')) {
        reply = "Digital Twin Floor Report: The Assembly Unit Node-10 is under Warning state (84% efficiency) due to pneumatic calibration delays. Painting, Packing, and QC Nodes are currently running at nominal 95%+ efficiency. No risk of order delays."
        insights = INSIGHTS_MAPPING.mfg
      } else if (q.includes('report') || q.includes('executive') || q.includes('summary')) {
        reply = "Compiling Executive Abstract: Aggregate revenue is at ₹28.3L with Q2 profits exceeding target at ₹12.2L (+14.8% MoM). Inventory capacity is at 78% capacity. Supplier delivery rating maintains a solid 96.2% on-time rate."
        triggerReportCompilation()
      } else if (q.includes('forecast') || q.includes('predict') || q.includes('demand')) {
        reply = "ARIMA Demand Forecasting: Q3 projection shows a 25% surge in Wooden Table orders (targeting 250 units) and a 15% increase in Office Chairs (targeting 180 units) due to seasonal business cycles. Reorder schedules have been adjusted."
      } else {
        reply = `Auditing complete. All databases are healthy. Let me know if you would like me to compile a comprehensive executive PDF summary report or check supplier scores.`
      }
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
      insights
    }])

    setIsLoading(false)
    confetti({
      particleCount: 25,
      spread: 40,
      colors: ['#7C3AED', '#06B6D4']
    })
  }

  // Handle Form Submit
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const query = input
    setInput('')
    processQuery(query)
  }

  // Handle Quick Prompts click
  const handleQuickPrompt = (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    processQuery(prompt)
  }

  // Simulate voice prompt click
  const handleVoiceCommand = (command: string) => {
    setIsListening(false)
    setVoiceProcessing(true)
    setVoiceText(command)

    setTimeout(() => {
      setVoiceProcessing(false)
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: command,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      processQuery(command)
    }, 1500)
  }

  // Simulate report compilation
  const triggerReportCompilation = () => {
    setReportCompiling(true)
    setCompiledReport(null)

    setTimeout(() => {
      setReportCompiling(false)
      if (user?.role === 'inventory') {
        setCompiledReport({
          id: `REP-2026-WAREHOUSE`,
          date: new Date().toISOString().split('T')[0],
          revenue: '₹6,49,000',
          orders: 2, // low stock count
          health: '94/100',
          findings: 'Warehouse operations nominal. Coimbatore storage occupancy is 92%. Proposed shelf height reorganizations.'
        })
      } else {
        setCompiledReport({
          id: `REP-2026-NEXUS`,
          date: new Date().toISOString().split('T')[0],
          revenue: '₹28,30,000',
          profit: '₹12,20,000',
          orders: 603,
          health: '92/100',
          findings: 'Nominal Q2 operations. Bottleneck in Assembly Node-10 resolved.'
        })
      }
      confetti({
        particleCount: 150,
        spread: 80,
        colors: ['#7C3AED', '#06B6D4', '#22C55E']
      })
    }, 2500)
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
            Cognitive ERP Shield
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            {user?.role === 'inventory' ? 'AI WAREHOUSE CORE ASSISTANT' : 'AI EXECUTIVE CORE ASSISTANT'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {user?.role === 'inventory' 
              ? 'Voice command cockpit, safety stock optimization, and real-time warehouse audits.'
              : 'Voice command center, automated report builder, and real-time ledger audits.'}
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerReportCompilation}
            className="bg-slate-900/60 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-[10px] text-slate-200 font-extrabold uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            Compile Summary Report
          </button>
        </div>
      </div>

      {/* Main chat window layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        
        {/* LEFT COLUMN: CHAT PORT (SPAN 8) */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-white/[0.01] border border-white/[0.05] rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
          
          {/* Header */}
          <div className="bg-slate-950/80 border-b border-white/[0.05] p-5 flex justify-between items-center z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-white">Nexus Assistant Core</h3>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block mt-0.5">Online</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsListening(true)
                setVoiceText('')
              }}
              className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              title="Voice assistant simulator"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Viewport for messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/10 border border-purple-500/25 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    🤖
                  </div>
                )}

                <div className="flex flex-col space-y-1.5 max-w-[80%]">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-[#0f172a]/60 border border-white/5 text-slate-300 rounded-tl-none'
                  }`}>
                    {message.content}
                  </div>

                  {/* Attachment card insights */}
                  {message.insights && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {message.insights.map((insight, idx) => (
                        <div key={idx} className={`p-3 bg-slate-950/80 border rounded-xl flex justify-between items-center ${insight.color}`}>
                          <div>
                            <span className="font-bold block text-[10px] text-white">{insight.title}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{insight.desc}</span>
                          </div>
                          <span className="font-black text-[10px] shrink-0 ml-2">{insight.stat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    👤
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-600/10 border border-purple-500/25 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  🤖
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl rounded-tl-none p-3.5 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form input field */}
          <div className="bg-slate-950/80 border-t border-white/[0.05] p-4 z-10">
            <form onSubmit={handleSendMessage} className="flex gap-3 relative">
              <input
                type="text"
                placeholder={user?.role === 'inventory' ? "Query AI warehouse systems..." : "Query AI core ledgers..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-white/10 focus:border-purple-500/40 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: SUGGESTED PROMPTS & COMPILED REPORTS (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Quick Command Prompts */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-purple-400" />
              Predefined AI commands
            </h2>

            <div className="flex flex-col gap-2.5">
              {(user?.role === 'inventory' 
                ? [
                    { label: 'Coimbatore Stock Alert', prompt: 'What items are critical in Coimbatore?' },
                    { label: 'Warehouse Space Audit', prompt: 'Show warehouse space utilization' },
                    { label: 'ARIMA Shortage Forecast', prompt: 'Predict next month stock shortages' },
                    { label: 'Replenishment Order', prompt: 'Recommend reorders for low stock' },
                    { label: 'Safety Stock Report', prompt: 'Generate inventory audit report' }
                  ]
                : [
                    { label: 'Sales Metrics Analysis', prompt: 'Which product sells the most?' },
                    { label: 'Procurement Safety Audit', prompt: 'What items need procurement?' },
                    { label: 'Manufacturing Delay Log', prompt: 'Show delayed orders' },
                    { label: 'Executive Summary Comp', prompt: 'Generate executive report' },
                    { label: 'ARIMA Q3 Demand Forecast', prompt: 'Predict next month demand' }
                  ]
              ).map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => handleQuickPrompt(cmd.prompt)}
                  className="w-full text-left bg-[#0f172a]/40 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 text-slate-300 hover:text-white p-3 rounded-xl cursor-pointer transition-all flex justify-between items-center"
                >
                  <div className="font-bold text-xs">
                    <span>{cmd.label}</span>
                    <span className="block text-[9px] text-slate-500 font-normal mt-0.5">"{cmd.prompt}"</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Business Report Vetting box */}
          <AnimatePresence>
            {compiledReport && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-b from-[#0b081e]/80 to-[#05060f]/80 border border-emerald-500/30 p-6 rounded-2xl relative"
              >
                <div className="flex justify-between items-start mb-4 border-b border-white/[0.06] pb-3">
                  <div>
                    <span className="text-[8px] uppercase font-black text-emerald-400 tracking-wider">Compiled Document</span>
                    <h4 className="font-extrabold text-sm text-white mt-0.5">{compiledReport.id}</h4>
                  </div>
                  <button 
                    onClick={() => setCompiledReport(null)}
                    className="text-slate-400 hover:text-white cursor-pointer bg-transparent border-none"
                  >
                    ✖
                  </button>
                </div>

                <div className="space-y-2 text-xs font-bold mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Date:</span>
                    <span className="text-white">{compiledReport.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {compiledReport.id.includes('WAREHOUSE') ? 'Total Asset Value:' : 'Total Revenue:'}
                    </span>
                    <span className="text-white">{compiledReport.revenue}</span>
                  </div>
                  {compiledReport.profit && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Profit:</span>
                      <span className="text-white">{compiledReport.profit}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {compiledReport.id.includes('WAREHOUSE') ? 'Low Stock SKUs:' : 'Total Orders:'}
                    </span>
                    <span className="text-white">{compiledReport.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      {compiledReport.id.includes('WAREHOUSE') ? 'Warehouse Health:' : 'Business Health:'}
                    </span>
                    <span className="text-emerald-400">{compiledReport.health}</span>
                  </div>
                  <div className="border-t border-white/[0.05] pt-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Findings Summary</span>
                    <p className="text-[10px] text-slate-400 font-normal mt-1 leading-relaxed">{compiledReport.findings}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading ${compiledReport.id}.pdf`)}
                  className="w-full bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold py-2 rounded-xl transition-colors cursor-pointer text-center text-xs"
                >
                  Download Ledger PDF
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Voice assistant simulation overlay */}
      <AnimatePresence>
        {isListening && (
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
              <button
                onClick={() => setIsListening(false)}
                className="text-slate-400 hover:text-white absolute top-4 right-4 cursor-pointer bg-transparent border-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center h-10 items-center gap-1.5 mb-6">
                {[1,2,3,4,5,6,7].map((i) => (
                  <div key={i} className="w-1 bg-cyan-400 rounded animate-pulse" style={{ height: `${Math.random() * 30 + 5}px`, animationDuration: `${Math.random() * 0.4 + 0.3}s` }} />
                ))}
              </div>

              <h3 className="text-md font-black tracking-wider text-white uppercase mb-2">Voice Input Core Active</h3>
              <p className="text-cyan-400 text-xs font-bold mb-6">Listening for speech triggers...</p>

              <div className="space-y-2 text-left">
                <span className="text-[8px] uppercase tracking-wider text-slate-500 font-black block">Sample triggers</span>
                {(user?.role === 'inventory'
                  ? ['What items are critical in Coimbatore?', 'Show warehouse space utilization', 'Recommend reorders for low stock']
                  : ['Which product sells the most?', 'What items need procurement?', 'Generate executive report']
                ).map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => handleVoiceCommand(cmd)}
                    className="w-full text-left bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 text-slate-300 hover:text-white p-2.5 rounded-xl cursor-pointer text-xs"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Processing overlay */}
      <AnimatePresence>
        {voiceProcessing && (
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
              className="bg-[#0b071a] border border-purple-500/35 p-8 rounded-3xl w-full max-w-md shadow-2xl relative text-center"
            >
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <h3 className="text-md font-black tracking-wider text-white uppercase mb-2">Parsing voice transcript</h3>
              <p className="text-slate-400 font-bold italic">"{voiceText}"</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report compiling overlay */}
      <AnimatePresence>
        {reportCompiling && (
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
              <Cpu className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <h3 className="text-md font-black tracking-wider text-white uppercase mb-2">Compiling Summary report</h3>
              <p className="text-slate-400 text-xs">
                {user?.role === 'inventory' 
                  ? 'Aggregating stock levels, capacities, and movements log...'
                  : 'Aggregating Sales, Inventory, and Procurement logs...'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

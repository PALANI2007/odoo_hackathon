'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, ShieldAlert, Mic, TrendingUp, TrendingDown, 
  Truck, Star, Award, Activity, CheckCircle2, AlertTriangle, 
  ArrowRight, ChevronUp, ChevronDown, Zap, BarChart3, 
  Coins, FileCheck, RefreshCw, Layers, ShieldCheck, HelpCircle, 
  User, Check, X, Volume2, Search, Info
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line 
} from 'recharts'

// ==========================================
// MOCK DATA FOR FUTURISTIC PROCUREMENT CORE
// ==========================================

interface Vendor {
  name: string
  price: number
  deliveryTime: number
  rating: number
  qualityScore: number
  savings: number
  isBest: boolean
}

interface MaterialData {
  name: string
  stock: number
  target: number
  unit: string
  status: 'critical' | 'warning' | 'safe'
  currentVendor: string
  currentPrice: number
  suggestedVendor: string
  suggestedPrice: number
  recommendedQty: number
  etaDays: number
  vendors: Vendor[]
}

const materialsData: Record<string, MaterialData> = {
  'Wood Top': {
    name: 'Wood Top',
    stock: 5,
    target: 50,
    unit: 'pcs',
    status: 'critical',
    currentVendor: 'ABC Woods',
    currentPrice: 800,
    suggestedVendor: 'Oak & Timber Co',
    suggestedPrice: 680,
    recommendedQty: 50,
    etaDays: 2,
    vendors: [
      { name: 'Oak & Timber Co', price: 680, deliveryTime: 2, rating: 4.9, qualityScore: 98, savings: 6000, isBest: true },
      { name: 'ABC Woods', price: 800, deliveryTime: 4, rating: 4.6, qualityScore: 92, savings: 0, isBest: false },
      { name: 'Global Lumber', price: 750, deliveryTime: 3, rating: 4.4, qualityScore: 90, savings: 2500, isBest: false }
    ]
  },
  'Screws': {
    name: 'Screws',
    stock: 20,
    target: 1000,
    unit: 'boxes',
    status: 'warning',
    currentVendor: 'Fastener Corp',
    currentPrice: 50,
    suggestedVendor: 'Industrial Screws',
    suggestedPrice: 42,
    recommendedQty: 1000,
    etaDays: 1,
    vendors: [
      { name: 'Industrial Screws', price: 42, deliveryTime: 1, rating: 4.8, qualityScore: 97, savings: 8000, isBest: true },
      { name: 'Fastener Corp', price: 50, deliveryTime: 3, rating: 4.5, qualityScore: 94, savings: 0, isBest: false },
      { name: 'Mega Bolt', price: 46, deliveryTime: 2, rating: 4.2, qualityScore: 91, savings: 4000, isBest: false }
    ]
  },
  'Wooden Legs': {
    name: 'Wooden Legs',
    stock: 150,
    target: 200,
    unit: 'pcs',
    status: 'safe',
    currentVendor: 'LegMasters',
    currentPrice: 300,
    suggestedVendor: 'LegMasters',
    suggestedPrice: 300,
    recommendedQty: 50,
    etaDays: 2,
    vendors: [
      { name: 'LegMasters', price: 300, deliveryTime: 2, rating: 4.7, qualityScore: 95, savings: 0, isBest: true },
      { name: 'TimberCrafters', price: 320, deliveryTime: 3, rating: 4.5, qualityScore: 96, savings: -1000, isBest: false },
      { name: 'Universal Legs', price: 310, deliveryTime: 4, rating: 4.2, qualityScore: 90, savings: -500, isBest: false }
    ]
  },
  'Varnish Coating': {
    name: 'Varnish Coating',
    stock: 8,
    target: 50,
    unit: 'liters',
    status: 'critical',
    currentVendor: 'EcoPaints',
    currentPrice: 450,
    suggestedVendor: 'Astro Coatings',
    suggestedPrice: 380,
    recommendedQty: 45,
    etaDays: 2,
    vendors: [
      { name: 'Astro Coatings', price: 380, deliveryTime: 2, rating: 4.8, qualityScore: 96, savings: 3150, isBest: true },
      { name: 'EcoPaints', price: 450, deliveryTime: 3, rating: 4.5, qualityScore: 93, savings: 0, isBest: false },
      { name: 'Premium Glaze', price: 420, deliveryTime: 1, rating: 4.3, qualityScore: 91, savings: 1350, isBest: false }
    ]
  },
  'Metal Brackets': {
    name: 'Metal Brackets',
    stock: 12,
    target: 150,
    unit: 'pcs',
    status: 'warning',
    currentVendor: 'Apex Metal',
    currentPrice: 120,
    suggestedVendor: 'Titan Steel',
    suggestedPrice: 105,
    recommendedQty: 140,
    etaDays: 1,
    vendors: [
      { name: 'Titan Steel', price: 105, deliveryTime: 1, rating: 4.9, qualityScore: 99, savings: 2100, isBest: true },
      { name: 'Apex Metal', price: 120, deliveryTime: 2, rating: 4.6, qualityScore: 94, savings: 0, isBest: false },
      { name: 'Ironworks Inc', price: 115, deliveryTime: 3, rating: 4.4, qualityScore: 95, savings: 700, isBest: false }
    ]
  }
}

// Chart Mock Data
const spendingData = [
  { month: 'Jan', spending: 280000, savings: 32000 },
  { month: 'Feb', spending: 310000, savings: 45000 },
  { month: 'Mar', spending: 290000, savings: 38000 },
  { month: 'Apr', spending: 340000, savings: 54000 },
  { month: 'May', spending: 320000, savings: 49000 },
  { month: 'Jun', spending: 380000, savings: 63000 }
]

const supplierScoreData = [
  { name: 'Oak & Timber', delivery: 98, quality: 98, cost: 92 },
  { name: 'Industrial Screws', delivery: 97, quality: 96, cost: 95 },
  { name: 'Titan Steel', delivery: 99, quality: 99, cost: 89 },
  { name: 'LegMasters', delivery: 95, quality: 95, cost: 88 },
  { name: 'EcoPaints', delivery: 91, quality: 93, cost: 84 }
]

const materialConsumptionData = [
  { name: 'Lumber & Wood', value: 45000, color: '#7C3AED' },
  { name: 'Hardware & Screws', value: 12000, color: '#06B6D4' },
  { name: 'Metals & Brackets', value: 28000, color: '#22C55E' },
  { name: 'Coatings & Paints', value: 15000, color: '#F59E0B' }
]

const costBreakdownData = [
  { category: 'Raw Materials', baseline: 180000, optimized: 152000 },
  { category: 'Logistics/ETA', baseline: 45000, optimized: 31000 },
  { category: 'Quality Failures', baseline: 25000, optimized: 8000 },
  { category: 'Admin Overhead', baseline: 15000, optimized: 12000 }
]

// ==========================================
// PRIMARY EXPORT COMPONENT
// ==========================================

export default function PurchaseDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Wood Top')
  const [isMounted, setIsMounted] = useState(false)
  
  // Interactive Stocks State
  const [materials, setMaterials] = useState<Record<string, MaterialData>>(materialsData)
  
  // Table Sorting State
  const [sortField, setSortField] = useState<keyof Vendor>('price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // One-Click PO Generation Flow State
  const [isPoGenerating, setIsPoGenerating] = useState(false)
  const [poProgressStep, setPoProgressStep] = useState(0)
  const [poSuccess, setPoSuccess] = useState(false)
  const [generatedPoId, setGeneratedPoId] = useState('')
  const [recentPOList, setRecentPOList] = useState<Array<{ id: string; item: string; qty: number; vendor: string; cost: number; date: string; status: string }>>([
    { id: 'PO-2026-004', item: 'Wooden Legs', qty: 50, vendor: 'LegMasters', cost: 15000, date: '2026-06-19', status: 'Completed' },
    { id: 'PO-2026-003', item: 'Varnish Coating', qty: 45, vendor: 'Astro Coatings', cost: 17100, date: '2026-06-18', status: 'In Transit' },
    { id: 'PO-2026-002', item: 'Metal Brackets', qty: 140, vendor: 'Titan Steel', cost: 14700, date: '2026-06-17', status: 'Completed' },
    { id: 'PO-2026-001', item: 'Screws', qty: 1000, vendor: 'Industrial Screws', cost: 42000, date: '2026-06-15', status: 'Completed' }
  ])

  // Live Tracking shipment state
  const [activeShipmentIndex, setActiveShipmentIndex] = useState(2) // 2 represents "Packed"

  // Fraud alerts state
  const [fraudAlerts, setFraudAlerts] = useState([
    { id: 'F1', type: 'danger', message: 'Unusual purchase quantity detected', desc: 'Requested 500 wood tops (exceeds monthly normal cap by 250%)', status: 'Active' },
    { id: 'F2', type: 'warning', message: 'Vendor price increased by 20%', desc: 'EcoPaints varnishing unit cost surged from ₹375 to ₹450', status: 'Active' },
    { id: 'F3', type: 'warning', message: 'Duplicate purchase order flagged', desc: 'Identical PO request for Screws (1000 boxes) sent within 15 min', status: 'Active' }
  ])

  // Voice Core State
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [voiceOutput, setVoiceOutput] = useState('')
  const [voiceProcessing, setVoiceProcessing] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto recommend updates on selected material changes
  const activeMaterial = useMemo(() => {
    return materials[selectedMaterial]
  }, [selectedMaterial, materials])

  // Handle Sort Change
  const handleSort = (field: keyof Vendor) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Sorted Vendors
  const sortedVendors = useMemo(() => {
    if (!activeMaterial) return []
    const list = [...activeMaterial.vendors]
    return list.sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]
      
      // If it's a percentage string or ratings, compare directly
      if (typeof valA === 'string') valA = parseFloat(valA.replace('%', ''))
      if (typeof valB === 'string') valB = parseFloat(valB.replace('%', ''))

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [activeMaterial, sortField, sortOrder])

  // Run PO Generation Simulation
  const triggerPoGeneration = (materialName: string) => {
    const item = materials[materialName]
    if (!item) return

    setIsPoGenerating(true)
    setPoProgressStep(0)
    setPoSuccess(false)

    // Simulate steps
    const steps = [
      () => setPoProgressStep(1), // Checking buffer ledger
      () => setPoProgressStep(2), // Vendor vetting score
      () => setPoProgressStep(3), // Fraud anomaly analysis
      () => setPoProgressStep(4), // Cryptographic handshake
      () => {
        const newPoId = `PO-2026-0${Math.floor(Math.random() * 900) + 100}`
        setGeneratedPoId(newPoId)
        setPoSuccess(true)
        setIsPoGenerating(false)

        // Confetti burst
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#06B6D4', '#22C55E', '#F59E0B']
        })

        // Update Materials local stock back to Safe
        setMaterials(prev => ({
          ...prev,
          [materialName]: {
            ...prev[materialName],
            stock: prev[materialName].target,
            status: 'safe'
          }
        }))

        // Prepend to recent POs
        setRecentPOList(prev => [
          {
            id: newPoId,
            item: item.name,
            qty: item.recommendedQty,
            vendor: item.suggestedVendor,
            cost: item.suggestedPrice * item.recommendedQty,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending Approval'
          },
          ...prev
        ])
      }
    ]

    steps.forEach((stepFn, index) => {
      setTimeout(stepFn, (index + 1) * 1100)
    })
  }

  // Handle Voice Command click simulation
  const handleVoiceCommand = (command: string) => {
    setIsListening(false)
    setVoiceProcessing(true)
    setVoiceText(command)
    setVoiceOutput('')

    setTimeout(() => {
      setVoiceProcessing(false)
      
      if (command.includes('Wood Top')) {
        setSelectedMaterial('Wood Top')
        setVoiceOutput('Synthesized: Material changed to Wood Top. Loading pricing analytics.')
      } else if (command.includes('Screws')) {
        setSelectedMaterial('Screws')
        setVoiceOutput('Synthesized: Material changed to Screws. Fetching vendor scores.')
      } else if (command.includes('pending')) {
        setVoiceOutput('Synthesized: Highlighting pending purchase order ledger.')
      } else if (command.includes('supplier')) {
        const bestVendor = activeMaterial.suggestedVendor
        setVoiceOutput(`Synthesized: Best supplier for ${activeMaterial.name} is ${bestVendor}. Savings calculated at ₹${activeMaterial.vendors.find(v => v.isBest)?.savings.toLocaleString() || 0}.`)
      } else if (command.includes('50 wood tops')) {
        triggerPoGeneration('Wood Top')
        setVoiceOutput('Synthesized: Initializing smart PO generation protocol for 50 Wood Tops.')
      }
    }, 1800)
  }

  // Handle fraud warning bypass
  const handleResolveFraud = (id: string) => {
    setFraudAlerts(prev => prev.filter(f => f.id !== id))
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ['#22C55E']
    })
  }

  // Render Custom Tooltip for charts
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
      
      {/* Decorative Glowing Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6 mb-8 z-10 relative">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Nexus AI Procurement Network
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            AI PROCUREMENT CONTROL CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous material reordering, live vendor scoring audits, & supply-chain cryptographic settlement.
          </p>
        </div>

        {/* System Active Status Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/60 border border-emerald-500/25 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">Secure Node: online</span>
          </div>
          <button 
            onClick={() => {
              setMaterials(materialsData)
              setFraudAlerts([
                { id: 'F1', type: 'danger', message: 'Unusual purchase quantity detected', desc: 'Requested 500 wood tops (exceeds monthly normal cap by 250%)', status: 'Active' },
                { id: 'F2', type: 'warning', message: 'Vendor price increased by 20%', desc: 'EcoPaints varnishing unit cost surged from ₹375 to ₹450', status: 'Active' },
                { id: 'F3', type: 'warning', message: 'Duplicate purchase order flagged', desc: 'Identical PO request for Screws (1000 boxes) sent within 15 min', status: 'Active' }
              ])
              confetti({ particleCount: 30, spread: 60 })
            }}
            className="flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 px-3 py-1.5 rounded-xl backdrop-blur-md cursor-pointer transition-all"
            title="Reset Stock States"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Reset states</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          SECTION 1: TOP PREMIUM KPI CARDS
          ========================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        
        {/* KPI 1: Total Purchase Orders */}
        <motion.div 
          whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 20px rgba(124,58,237,0.15)' }}
          className="bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total POs</span>
            <ShoppingCart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">1,428</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1.5">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% MoM</span>
          </div>
        </motion.div>

        {/* KPI 2: Pending Purchase Orders */}
        <motion.div 
          whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 20px rgba(6,182,212,0.15)' }}
          className="bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/30 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending POs</span>
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {recentPOList.filter(po => po.status.includes('Pending') || po.status.includes('Transit')).length}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Active Queue</span>
          </div>
        </motion.div>

        {/* KPI 3: Completed Orders */}
        <motion.div 
          whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}
          className="bg-white/[0.02] border border-white/[0.05] hover:border-green-500/30 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed POs</span>
            <FileCheck className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">1,394</div>
          <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold mt-1.5">
            <span>98.1% Success Rate</span>
          </div>
        </motion.div>

        {/* KPI 4: Vendor Performance Score */}
        <motion.div 
          whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}
          className="bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/30 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Supplier Performance</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">94.6%</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1.5">
            <TrendingUp className="w-3 h-3" />
            <span>+1.8% Quality</span>
          </div>
        </motion.div>

        {/* KPI 5: Monthly Purchase Cost */}
        <motion.div 
          whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 20px rgba(239,68,68,0.15)' }}
          className="bg-white/[0.02] border border-white/[0.05] hover:border-red-500/30 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Spend</span>
            <Coins className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">₹3.80L</div>
          <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold mt-1.5">
            <TrendingDown className="w-3 h-3" />
            <span>-4.2% Lower Cost</span>
          </div>
        </motion.div>

        {/* KPI 6: AI Savings Generated */}
        <motion.div 
          whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 25px rgba(6,182,212,0.3)' }}
          className="bg-gradient-to-br from-purple-950/60 to-cyan-950/60 border border-cyan-500/40 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer shadow-lg shadow-cyan-900/10"
        >
          {/* Pulsing neon highlight */}
          <div className="absolute inset-0 bg-cyan-400/5 animate-pulse" />
          <div className="flex justify-between items-start text-slate-300 mb-2 z-10 relative">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">AI Savings</span>
            <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
          </div>
          <div className="text-2xl font-black text-cyan-300 mt-1 z-10 relative">₹54,300</div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-black tracking-wide mt-1.5 z-10 relative">
            <span>💡 14.3% Optimized</span>
          </div>
        </motion.div>

      </div>

      {/* ==========================================
          MAIN LAYOUT CONTENT GRID
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        
        {/* LEFT COLUMN: LOW STOCK & VENDOR RECOMMENDATION & SECURITY (SPAN 4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Low Stock Alert Center */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Low Stock Alert Center
              </h2>
              <span className="text-[10px] font-bold text-slate-400">Real-time</span>
            </div>
            
            <div className="space-y-3">
              {Object.values(materials).map((mat) => {
                const isSelected = selectedMaterial === mat.name
                
                // Color configuration
                let badgeColor = 'bg-green-500/10 border-green-500/30 text-green-400'
                let label = 'Safe'
                if (mat.status === 'critical') {
                  badgeColor = 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                  label = 'Critical'
                } else if (mat.status === 'warning') {
                  badgeColor = 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  label = 'Warning'
                }

                return (
                  <div
                    key={mat.name}
                    onClick={() => setSelectedMaterial(mat.name)}
                    className={`flex justify-between items-center p-3.5 rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                      isSelected 
                        ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-500/5' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{mat.name}</span>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Stock: <span className="text-white font-bold">{mat.stock}</span> / {mat.target} {mat.unit}
                      </div>
                    </div>

                    {mat.status !== 'safe' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMaterial(mat.name)
                          triggerPoGeneration(mat.name)
                        }}
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md transition-all cursor-pointer border-none"
                      >
                        Auto-Order
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold">In Buffer</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Smart Vendor Recommendation Panel */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative overflow-hidden group">
            {/* Pulsing glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full filter blur-2xl group-hover:scale-125 transition-transform pointer-events-none" />
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Smart Vendor Suggestion
              </h2>
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow animate-pulse border border-cyan-500/25">
                AI Recommended
              </span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-cyan-500/25 shadow-lg relative">
              <div className="flex justify-between items-start mb-3.5">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-cyan-400">Best Match Supplier</span>
                  <h3 className="font-extrabold text-lg text-white mt-0.5">{activeMaterial.suggestedVendor}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Unit Price</span>
                  <div className="font-black text-md text-emerald-400">₹{activeMaterial.suggestedPrice}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.05] text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Delivery</div>
                  <div className="font-black text-white mt-0.5 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeMaterial.etaDays} Days</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Quality Rate</div>
                  <div className="font-black text-white mt-0.5 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span>{activeMaterial.vendors.find(v => v.isBest)?.qualityScore}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Rating</div>
                  <div className="font-black text-amber-400 mt-0.5 flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activeMaterial.vendors.find(v => v.isBest)?.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Fraud & Security Audit Control */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Security & Fraud Shield
              </h2>
              <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Audits: OK
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {fraudAlerts.length > 0 ? (
                  fraudAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-3.5 rounded-xl border flex gap-3 relative overflow-hidden bg-slate-950/65 ${
                        alert.type === 'danger' ? 'border-red-500/20' : 'border-amber-500/20'
                      }`}
                    >
                      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                        alert.type === 'danger' ? 'text-red-400 animate-bounce' : 'text-amber-400'
                      }`} />
                      
                      <div className="flex-1">
                        <div className="font-bold text-xs text-white flex justify-between items-center">
                          <span>{alert.message}</span>
                          <button
                            onClick={() => handleResolveFraud(alert.id)}
                            className="text-[9px] text-cyan-400 hover:text-white uppercase font-black tracking-wider cursor-pointer border border-cyan-500/20 hover:border-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded-md transition-colors"
                          >
                            Bypass
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{alert.desc}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 border border-dashed border-white/5 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                    <p className="text-xs font-bold">No active anomalies detected.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN: AI SMART RECOMMENDATION & COMPARISON TABLE & TIMELINE (SPAN 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Large AI Recommendation Widget */}
          <div className="bg-gradient-to-r from-purple-950/40 via-[#0a071d] to-cyan-950/40 border border-purple-500/25 p-7 rounded-3xl relative overflow-hidden shadow-xl shadow-purple-950/5">
            <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 z-10 relative">
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-md border border-cyan-500/25">
                  AI Recommendation System
                </span>
                <h2 className="text-xl font-extrabold text-white mt-2">
                  Procurement optimization for <span className="text-purple-400">{activeMaterial.name}</span>
                </h2>
              </div>
              <div className="text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 border border-white/5 rounded-xl">
                Buffer status: <span className="text-white font-bold">{Math.round((activeMaterial.stock / activeMaterial.target) * 100)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center z-10 relative">
              {/* Insight details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">⚠️</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Stock Buffer Critical</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Current inventory levels ({activeMaterial.stock} {activeMaterial.unit}) present a production hazard.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Recommended Purchase</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Order <span className="text-cyan-400 font-bold">{activeMaterial.recommendedQty} {activeMaterial.unit}</span> to re-establish nominal safe threshold.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Best Evaluated Vendor</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Smart vetting ranks <span className="text-purple-400 font-bold">{activeMaterial.suggestedVendor}</span> as optimal choice.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Calculated Cost Optimizations</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Transitioning generates savings of <span className="text-emerald-400 font-bold">₹{activeMaterial.vendors.find(v => v.isBest)?.savings.toLocaleString() || 0}</span>.</p>
                  </div>
                </div>
              </div>

              {/* Action and Summary panel */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/[0.05] flex flex-col justify-between min-h-[180px]">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[0.05] mb-4">
                  <span className="text-slate-400 uppercase font-bold">Estimated ETA</span>
                  <span className="text-cyan-400 font-black tracking-wide">{activeMaterial.etaDays} Days Delivery</span>
                </div>
                
                <div className="space-y-1 mb-6">
                  <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Purchase Cost Overview</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-400 text-xs">Standard Cost:</span>
                    <span className="text-slate-400 text-xs line-through">₹{(activeMaterial.currentPrice * activeMaterial.recommendedQty).toLocaleString()}</span>
                  </div>
                  <div className="flex items-baseline justify-between font-black text-md">
                    <span className="text-white text-sm">Suggested Cost:</span>
                    <span className="text-emerald-400">₹{(activeMaterial.suggestedPrice * activeMaterial.recommendedQty).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => triggerPoGeneration(activeMaterial.name)}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-purple-500/10 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-center gap-2 border-none"
                >
                  <Zap className="w-4 h-4 fill-white text-white" />
                  <span>One-Click Smart Restock</span>
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Vendor Comparison Table */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Interactive Vendor Auditing
              </h2>
              <span className="text-[10px] text-slate-400">Selected material: <strong className="text-white">{activeMaterial.name}</strong></span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pr-2 text-left">Vendor</th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">
                        Price {sortField === 'price' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-purple-400" /> : <ChevronDown className="w-3.5 h-3.5 text-purple-400" />)}
                      </div>
                    </th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('deliveryTime')}>
                      <div className="flex items-center gap-1">
                        ETA {sortField === 'deliveryTime' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-purple-400" /> : <ChevronDown className="w-3.5 h-3.5 text-purple-400" />)}
                      </div>
                    </th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('rating')}>
                      <div className="flex items-center gap-1">
                        Rating {sortField === 'rating' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-purple-400" /> : <ChevronDown className="w-3.5 h-3.5 text-purple-400" />)}
                      </div>
                    </th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('qualityScore')}>
                      <div className="flex items-center gap-1">
                        Quality {sortField === 'qualityScore' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-purple-400" /> : <ChevronDown className="w-3.5 h-3.5 text-purple-400" />)}
                      </div>
                    </th>
                    <th className="pb-3 cursor-pointer select-none hover:text-white text-left" onClick={() => handleSort('savings')}>
                      <div className="flex items-center gap-1">
                        Savings {sortField === 'savings' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-purple-400" /> : <ChevronDown className="w-3.5 h-3.5 text-purple-400" />)}
                      </div>
                    </th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVendors.map((vendor, idx) => (
                    <tr
                      key={vendor.name}
                      className={`border-b border-white/[0.04] transition-all hover:bg-white/[0.02] ${
                        vendor.isBest ? 'bg-purple-950/15' : ''
                      }`}
                    >
                      <td className="py-3.5 pr-2 font-bold text-white flex items-center gap-2">
                        {vendor.name}
                        {vendor.isBest && (
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" /> Winner
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-bold text-slate-200 text-left">₹{vendor.price}</td>
                      <td className="py-3.5 text-slate-300 text-left">{vendor.deliveryTime} Days</td>
                      <td className="py-3.5 text-amber-400 font-bold flex items-center gap-0.5 text-left">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {vendor.rating}
                      </td>
                      <td className="py-3.5 text-slate-300 text-left">{vendor.qualityScore}%</td>
                      <td className="py-3.5 font-bold text-emerald-400 text-left">
                        {vendor.savings > 0 ? `+₹${vendor.savings.toLocaleString()}` : vendor.savings === 0 ? '₹0' : `-₹${Math.abs(vendor.savings).toLocaleString()}`}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => triggerPoGeneration(activeMaterial.name)}
                          className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PO Logistics & Shipment Tracking and Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Purchase Order Shipment Tracker Timeline */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Live Order Tracker
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveShipmentIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeShipmentIndex === 0}
                    className="p-1 border border-white/10 bg-slate-900/60 hover:bg-slate-800 rounded-lg text-slate-400 disabled:opacity-30 cursor-pointer"
                  >
                    ◀
                  </button>
                  <button 
                    onClick={() => setActiveShipmentIndex(prev => Math.min(5, prev + 1))}
                    disabled={activeShipmentIndex === 5}
                    className="p-1 border border-white/10 bg-slate-900/60 hover:bg-slate-800 rounded-lg text-slate-400 disabled:opacity-30 cursor-pointer"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Dynamic steps timeline */}
              <div className="space-y-4 pl-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.06]">
                {[
                  'PO Created',
                  'Vendor Accepted',
                  'Packed',
                  'Shipped',
                  'In Transit',
                  'Delivered'
                ].map((step, idx) => {
                  const isCompleted = idx < activeShipmentIndex
                  const isActive = idx === activeShipmentIndex
                  
                  let circleColor = 'border-white/10 bg-[#030712]'
                  let labelColor = 'text-slate-500'

                  if (isCompleted) {
                    circleColor = 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    labelColor = 'text-emerald-400 font-bold'
                  } else if (isActive) {
                    circleColor = 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/10 animate-pulse'
                    labelColor = 'text-white font-extrabold'
                  }

                  return (
                    <div key={step} className="flex items-center gap-4 relative">
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center text-[8px] z-10 shrink-0 ${circleColor}`}>
                        {isCompleted && '✓'}
                        {isActive && '•'}
                      </div>
                      <div>
                        <span className={`text-xs ${labelColor}`}>{step}</span>
                        {isActive && (
                          <span className="text-[8px] uppercase tracking-wider text-cyan-400 ml-2 font-black">Active Stage</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Live Shipment Route Tracking map animation */}
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative flex flex-col justify-between">
              <div className="mb-4">
                <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-400" />
                  Live Fleet Tracking
                </h2>
                <p className="text-[10px] text-slate-400 mt-1">Simulated supply-chain cargo status tracker.</p>
              </div>

              {/* Map Illustration container */}
              <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl flex flex-col justify-center min-h-[140px] relative overflow-hidden">
                {/* Dotted path */}
                <div className="h-0.5 border-t border-dashed border-white/20 w-full absolute left-0 top-[60%] -translate-y-1/2 px-8" />
                
                {/* Shipment Location Dots */}
                <div className="flex justify-between items-center z-10 w-full px-6">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white/20 shadow-lg shadow-purple-500/20" />
                    <span className="text-[9px] uppercase font-bold text-slate-400">Supplier</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 border-2 border-white/20 shadow-lg shadow-cyan-500/20" />
                    <span className="text-[9px] uppercase font-bold text-slate-400">Warehouse</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white/20 shadow-lg shadow-green-500/20 animate-pulse" />
                    <span className="text-[9px] uppercase font-bold text-slate-400">Factory</span>
                  </div>
                </div>

                {/* Animated Truck */}
                <motion.div
                  className="absolute bottom-[35%] flex flex-col items-center z-10"
                  animate={{ 
                    left: activeShipmentIndex === 0 ? '12%' : 
                          activeShipmentIndex === 1 ? '24%' :
                          activeShipmentIndex === 2 ? '36%' :
                          activeShipmentIndex === 3 ? '52%' :
                          activeShipmentIndex === 4 ? '70%' : '88%'
                  }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                >
                  <Truck className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-bounce" style={{ animationDuration: '2.5s' }} />
                  <span className="text-[8px] bg-slate-900 border border-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.5 rounded mt-0.5 uppercase tracking-wide">
                    Cargo
                  </span>
                </motion.div>
              </div>

              <div className="text-[10px] text-slate-400 flex justify-between items-center mt-3 pt-3 border-t border-white/[0.05]">
                <span>Routing: ABC Woods ➔ Hub-3 ➔ Odoo Factory</span>
                <span className="text-cyan-400 font-bold">Speed: Nominal</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          SECTION 3: AI COST OPTIMIZATION & CHARTS
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 z-10 relative">
        
        {/* AI Cost Optimization Widget (Span 4) */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                AI Cost Optimizer
              </h2>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Live Audit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Baseline Cost</span>
                <div className="text-white text-md font-black mt-1">₹{(activeMaterial.currentPrice * activeMaterial.recommendedQty).toLocaleString()}</div>
                <span className="text-[9px] text-slate-400">Current Vendor</span>
              </div>
              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-400/5 animate-pulse" />
                <span className="text-emerald-400 text-[10px] uppercase font-black">AI Optimal Cost</span>
                <div className="text-emerald-400 text-md font-black mt-1">₹{(activeMaterial.suggestedPrice * activeMaterial.recommendedQty).toLocaleString()}</div>
                <span className="text-[9px] text-emerald-400 font-bold">Suggested Vendor</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-cyan-400">Potential Net Savings</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">₹{activeMaterial.vendors.find(v => v.isBest)?.savings.toLocaleString() || 0}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black border border-emerald-500/25">
                %{Math.round(((activeMaterial.currentPrice - activeMaterial.suggestedPrice) / activeMaterial.currentPrice) * 100)}
              </div>
            </div>
          </div>

          {/* Simple Recharts Cost Graph */}
          <div className="h-28 w-full mt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="savings" name="Savings" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
            )}
          </div>
        </div>

        {/* Purchase Analytics grid (Span 8) */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Advanced Procurement Analytics
            </h2>
            <span className="text-[10px] text-slate-400">Recharts Automated Dashboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Spending & Savings Trend */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wide">Monthly Spend vs Savings</h3>
              <div className="h-44 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                      <Line type="monotone" dataKey="spending" name="Purchase Spend" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="savings" name="AI Savings" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
                )}
              </div>
            </div>

            {/* Vendor Scores comparison */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wide">Supplier Quality & Delivery Audit</h3>
              <div className="h-44 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierScoreData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={8} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                      <Bar dataKey="quality" name="Quality Score" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="delivery" name="On-Time Rate" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
                )}
              </div>
            </div>

            {/* Material Allocation */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wide">Monthly Procurement Allocation</h3>
              <div className="h-44 w-full flex items-center">
                {isMounted ? (
                  <div className="w-full h-full flex flex-col md:flex-row items-center justify-around gap-2">
                    <div className="w-[120px] h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={materialConsumptionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {materialConsumptionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-[9px] font-bold text-slate-400 shrink-0">
                      {materialConsumptionData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-white">{item.name}</span>
                          <span>(₹{item.value.toLocaleString()})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
                )}
              </div>
            </div>

            {/* Quality Failure Cost Optimization */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wide">Cost Category Optimization</h3>
              <div className="h-44 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costBreakdownData} layout="vertical" margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                      <XAxis type="number" stroke="#64748b" fontSize={9} />
                      <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={8} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 9 }} />
                      <Bar dataKey="baseline" name="Baseline Cost" fill="#ffffff15" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="optimized" name="Optimized Cost" fill="#22C55E" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-white/[0.02] animate-pulse rounded-xl" />
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ==========================================
          SUPPLIER PERFORMANCE RANKINGS DASHBOARD
          ========================================== */}
      <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative mb-8 z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Supplier Performance Rankings Audit
          </h2>
          <span className="text-[10px] text-slate-400">Total Vetted Suppliers: 5</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { name: 'ABC Woods', delivery: 96, quality: 92, cost: 88, score: 92, rank: 3, color: 'from-purple-500/10' },
            { name: 'Oak & Timber Co', delivery: 98, quality: 98, score: 98, cost: 94, rank: 1, color: 'from-emerald-500/10' },
            { name: 'Industrial Screws', delivery: 97, quality: 97, score: 96, cost: 95, rank: 2, color: 'from-cyan-500/10' },
            { name: 'Titan Steel', delivery: 99, quality: 99, score: 95, cost: 86, rank: 4, color: 'from-indigo-500/10' },
            { name: 'LegMasters', delivery: 95, quality: 95, score: 91, cost: 85, rank: 5, color: 'from-amber-500/10' }
          ].sort((a,b) => a.rank - b.rank).map((supplier) => (
            <motion.div
              key={supplier.name}
              whileHover={{ scale: 1.03, translateY: -2, boxShadow: '0 0 15px rgba(255,255,255,0.02)' }}
              className={`bg-gradient-to-br ${supplier.color} to-slate-950/40 p-4 border border-white/5 rounded-2xl relative overflow-hidden transition-all`}
            >
              {/* Rank Badge */}
              <div className="absolute top-2.5 right-2.5 bg-slate-900 border border-white/10 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">
                #{supplier.rank}
              </div>

              <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400">Vetted Supplier</span>
              <h3 className="font-extrabold text-sm text-white mt-0.5">{supplier.name}</h3>

              <div className="space-y-2 mt-4 text-[10px]">
                <div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>On-Time Delivery</span>
                    <span className="text-white font-bold">{supplier.delivery}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-cyan-400" style={{ width: `${supplier.delivery}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Quality Rate</span>
                    <span className="text-white font-bold">{supplier.quality}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-purple-500" style={{ width: `${supplier.quality}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Cost Efficiency</span>
                    <span className="text-white font-bold">{supplier.cost}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-emerald-400" style={{ width: `${supplier.cost}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.05] flex justify-between items-center font-bold text-xs text-slate-200">
                  <span>Overall Score</span>
                  <span className="text-cyan-400">{supplier.score}/100</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ==========================================
          SECTION 4: RECENT COMPLETED PO LEDGER
          ========================================== */}
      <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl relative mb-8 z-10">
        <h2 className="text-md font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 mb-4">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          Recent Purchase Orders Ledger
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pr-2 text-left">PO ID</th>
                <th className="pb-3 text-left">Material</th>
                <th className="pb-3 text-left">Quantity</th>
                <th className="pb-3 text-left">Supplier</th>
                <th className="pb-3 text-left">Total Value</th>
                <th className="pb-3 text-left">Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPOList.map((po) => (
                <tr key={po.id} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors">
                  <td className="py-3 font-bold text-white pr-2 text-left">{po.id}</td>
                  <td className="py-3 text-slate-300 text-left">{po.item}</td>
                  <td className="py-3 text-slate-300 font-bold text-left">{po.qty.toLocaleString()}</td>
                  <td className="py-3 text-slate-300 text-left">{po.vendor}</td>
                  <td className="py-3 text-emerald-400 font-black text-left">₹{po.cost.toLocaleString()}</td>
                  <td className="py-3 text-slate-400 text-left">{po.date}</td>
                  <td className="py-3 text-right">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      po.status === 'Completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
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

      {/* ==========================================
          FLOATING VOICE PROCUREMENT CORE WIDGET
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => {
            setIsListening(!isListening)
            if (!isListening) {
              setVoiceText('')
              setVoiceOutput('')
            }
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/25 border border-white/20 cursor-pointer relative border-none"
        >
          {isListening ? (
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
          ) : null}
          <Mic className="w-6 h-6 fill-white text-white" />
        </motion.button>

        <AnimatePresence>
          {isListening || voiceProcessing || voiceOutput ? (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-80 bg-slate-950/95 border border-cyan-500/35 backdrop-blur-xl p-5 rounded-2xl shadow-2xl flex flex-col gap-3.5 z-50 text-xs"
            >
              <div className="flex justify-between items-center border-b border-white/[0.08] pb-2">
                <span className="font-extrabold text-[10px] uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  Nexus Voice Core
                </span>
                <button 
                  onClick={() => {
                    setIsListening(false)
                    setVoiceProcessing(false)
                    setVoiceOutput('')
                  }} 
                  className="text-slate-400 hover:text-white cursor-pointer bg-transparent border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isListening && (
                <div className="space-y-3">
                  <div className="text-center py-2 flex flex-col items-center gap-2">
                    {/* Simulated Voice wave */}
                    <div className="flex gap-1 items-center justify-center h-5">
                      {[1,2,3,4,5,6].map((i) => (
                        <div key={i} className="w-1 bg-cyan-400 rounded animate-pulse" style={{ height: `${Math.random() * 20 + 4}px`, animationDuration: `${Math.random() * 0.5 + 0.4}s` }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wide">Listening for orders...</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider text-slate-500 font-black">Sample Commands</span>
                    <div className="flex flex-col gap-1">
                      {[
                        'Recommend best supplier for Wood Top',
                        'Create purchase order for 50 wood tops',
                        'Show pending purchase orders'
                      ].map((cmd) => (
                        <button
                          key={cmd}
                          onClick={() => handleVoiceCommand(cmd)}
                          className="text-left bg-white/[0.03] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 text-slate-300 hover:text-white p-2 rounded-lg cursor-pointer transition-colors"
                        >
                          "{cmd}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {voiceProcessing && (
                <div className="text-center py-4 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                  <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider">Parsing Neural Transcript...</span>
                  <p className="text-slate-400 font-bold italic">"{voiceText}"</p>
                </div>
              )}

              {voiceOutput && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl">
                    <div className="font-extrabold text-[10px] uppercase text-purple-400 mb-1">Command Actioned</div>
                    <p className="text-slate-300 font-medium italic">"{voiceText}"</p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-white/5 rounded-xl">
                    <p className="text-emerald-400 font-bold leading-relaxed">{voiceOutput}</p>
                  </div>
                  <button
                    onClick={() => setVoiceOutput('')}
                    className="w-full bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Clear Feed
                  </button>
                </div>
              )}

            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ==========================================
          ONE-CLICK PO GENERATING SIMULATOR MODAL
          ========================================== */}
      <AnimatePresence>
        {isPoGenerating && (
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
              className="bg-[#0c071d] border border-purple-500/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              {/* Matrix glow effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 animate-pulse" />

              <h3 className="text-lg font-black tracking-wider text-white uppercase text-center mb-6 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
                PO GENERATION CORE INITIALIZED
              </h3>

              <div className="space-y-4">
                {[
                  { text: 'Verifying inventory levels & buffers...', step: 1 },
                  { text: 'Auditing supplier performance profiles...', step: 2 },
                  { text: 'Executing AI pricing comparison optimization...', step: 3 },
                  { text: 'Performing fraud & compliance validation check...', step: 4 }
                ].map((item) => {
                  const isDone = poProgressStep > item.step
                  const isActive = poProgressStep === item.step
                  
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

              <div className="text-center mt-8 pt-4 border-t border-white/[0.05]">
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">Protocol: ERP-NEXUS-PO-SIGN v2.4</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {poSuccess && (
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
              className="bg-[#070b19] border border-emerald-500/35 p-8 rounded-3xl w-full max-w-md shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400 font-black text-2xl animate-bounce">
                ✓
              </div>

              <h3 className="text-xl font-black text-white uppercase mb-2">Purchase Order Secured</h3>
              <p className="text-emerald-400 font-extrabold text-sm mb-4">{generatedPoId}</p>

              <div className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl text-left text-xs mb-6 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Material ordered:</span>
                  <span className="text-white font-bold">{activeMaterial.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Quantity:</span>
                  <span className="text-white font-bold">{activeMaterial.recommendedQty.toLocaleString()} {activeMaterial.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor Assigned:</span>
                  <span className="text-white font-bold">{activeMaterial.suggestedVendor}</span>
                </div>
                <div className="flex justify-between border-t border-white/[0.05] pt-1.5 font-bold">
                  <span className="text-slate-300">Total Purchase Cost:</span>
                  <span className="text-emerald-400">₹{(activeMaterial.suggestedPrice * activeMaterial.recommendedQty).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setPoSuccess(false)}
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

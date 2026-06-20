'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/* ══ CONFIG & COORDINATES ══ */

const MODULES = [
  { id:'sales', label:'Sales Center',    val:'₹2,83,420', unit:'Revenue',     icon:'📊', clr:'#3b82f6',
    px:'3%',  py:'8%',  s1l:'Orders',   s1v:'24',  s2l:'Growth',  s2v:'+12%' },
  { id:'proc',  label:'Procurement Hub', val:'12',     unit:'PO Active',   icon:'📦', clr:'#a855f7',
    px:'63%', py:'5%',  s1l:'Pending',  s1v:'5',   s2l:'Value',   s2v:'₹45K' },
  { id:'mfg',   label:'Manufacturing',   val:'08',     unit:'Lines Active', icon:'⚙️', clr:'#f97316',
    px:'70%', py:'52%', s1l:'Output',   s1v:'142', s2l:'Eff.',    s2v:'94%' },
  { id:'inv',   label:'Inventory Hub',   val:'1,245',  unit:'Units Stock',  icon:'🏭', clr:'#10b981',
    px:'3%',  py:'55%', s1l:'Low Stock',s1v:'3',   s2l:'Value',   s2v:'₹1.2M' },
  { id:'rep',   label:'Analytics',       val:'+18.6%', unit:'Monthly Growth',icon:'📈',clr:'#06b6d4',
    px:'36%', py:'76%', s1l:'Reports',  s1v:'12',  s2l:'KPIs',    s2v:'28' },
] as const

// Laser beam SVG % coords (viewBox 0 0 100 100)
const BEAMS = [
  { x1:13, y1:16, x2:41, y2:43, c:'#3b82f6', mx:27, my:30 },
  { x1:71, y1:12, x2:41, y2:43, c:'#a855f7', mx:56, my:28 },
  { x1:79, y1:60, x2:41, y2:43, c:'#f97316', mx:60, my:52 },
  { x1:13, y1:63, x2:41, y2:43, c:'#10b981', mx:27, my:53 },
  { x1:45, y1:86, x2:41, y2:43, c:'#06b6d4', mx:43, my:65 },
] as const

const STARS: readonly [number,number,number,number,number][] = [
  [8,3,0.9,0.5,2.5],[22,5,0.7,0.7,3.0],[36,2,1.1,0.4,2.8],[50,4,0.8,0.6,3.8],
  [64,3,0.9,0.3,2.3],[78,6,0.7,0.7,3.2],[90,2,1.1,0.5,2.7],[14,9,0.8,0.4,3.6],
  [28,7,0.9,0.6,2.1],[42,10,0.7,0.3,4.2],[56,8,1.1,0.5,3.0],[70,6,0.8,0.7,2.6],
  [84,11,0.9,0.4,3.9],[6,15,0.7,0.5,2.4],[20,13,1.1,0.6,3.5],[34,16,0.8,0.3,2.9],
  [48,14,0.9,0.5,4.0],[62,17,0.7,0.4,2.2],[76,12,1.1,0.6,3.4],[92,16,0.8,0.3,2.8],
  [10,20,0.9,0.5,3.7],[26,18,0.7,0.7,2.0],[40,22,1.1,0.4,3.1],[54,19,0.8,0.6,2.5],
]

const PARTS: readonly [number,number,number,number,number,number][] = [
  [15,30,1.8,0.3,5,0.0],[30,45,1.4,0.2,7,1.0],[45,35,1.8,0.35,4,2.0],[60,55,1.4,0.25,6,0.5],
  [75,40,1.8,0.3,5,1.5],[20,65,1.4,0.2,8,0.8],[35,72,1.8,0.3,5,1.2],[50,68,1.4,0.25,6,0.3],
  [65,78,1.8,0.35,4,1.8],[80,50,1.4,0.2,7,0.6],[90,65,1.8,0.3,5,2.0],[5,50,1.4,0.25,6,1.5],
]

const SKYLINE = [
  [3,78,5,22],[10,70,4,30],[16,74,7,26],[25,65,5,35],[32,72,6,28],[40,68,4,32],
  [47,60,5,40],[53,66,8,34],[63,62,5,38],[70,70,6,30],[78,65,4,35],[84,72,5,28],
  [90,68,6,32],[96,74,4,26],
] as const

/* ══ MICRO-VISUALS FOR MODULE CARDS ══ */

// 1. Sales Center - Area Graph
function SalesVisual() {
  return (
    <svg viewBox="0 0 120 30" className="w-full h-full p-1">
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.4)"/>
          <stop offset="100%" stopColor="rgba(59,130,246,0.0)"/>
        </linearGradient>
      </defs>
      <motion.path
        d="M 5,26 Q 25,8 45,21 T 85,6 T 115,14 L 115,28 L 5,28 Z"
        fill="url(#salesGrad)"
      />
      <motion.path
        d="M 5,26 Q 25,8 45,21 T 85,6 T 115,14"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle
        cx="115"
        cy="14"
        r="2"
        fill="#3b82f6"
        animate={{ r: [1.5, 3.2, 1.5], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  )
}

// 2. Procurement Hub - Package Flow
function ProcVisual() {
  return (
    <div className="w-full h-full flex items-center justify-between px-3.5 relative">
      <div className="w-4 h-4 rounded-full bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-[7px] z-10 select-none">🏢</div>
      <div className="absolute left-7 right-7 h-[1px] bg-purple-950/60 top-1/2 -translate-y-1/2 overflow-hidden">
        <motion.div
          className="h-full w-5 bg-purple-500/40 rounded filter blur-[1px]"
          animate={{ x: [-20, 90] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.div
        className="w-2.5 h-2.5 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.9)] absolute z-20 flex items-center justify-center text-[5px]"
        style={{ top: 'calc(50% - 5px)' }}
        animate={{ left: ['20px', '94px'], opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.1, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        📦
      </motion.div>
      <div className="w-4 h-4 rounded-full bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-[7px] z-10 select-none">🏭</div>
    </div>
  )
}

// 3. Manufacturing Unit - Robotic Arm with Sparks
function MfgVisual() {
  const [sparks, setSparks] = useState<{ id: number; cx: number; cy: number; dx: number; dy: number }[]>([])

  useEffect(() => {
    const t = setInterval(() => {
      const newSparks = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        cx: 90,
        cy: 22,
        dx: (Math.random() - 0.75) * 16,
        dy: (Math.random() - 0.5) * 16,
      }))
      setSparks(newSparks)
      setTimeout(() => setSparks([]), 700)
    }, 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 120 40" className="w-full h-full">
        <rect x="15" y="32" width="20" height="4" fill="#334155" rx="1" />
        <rect x="22" y="26" width="6" height="6" fill="#475569" />

        <motion.g
          animate={{ rotate: [15, -15, 15] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "25px 29px" }}
        >
          <line x1="25" y1="29" x2="55" y2="15" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <circle cx="25" cy="29" r="2" fill="#f97316" />

          <motion.g
            animate={{ rotate: [-30, 30, -30] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "55px 15px" }}
          >
            <line x1="55" y1="15" x2="90" y2="22" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
            <circle cx="55" cy="15" r="1.5" fill="#fb923c" />
            <path d="M 88,20 L 92,22 L 88,24 Z" fill="#64748b" />
          </motion.g>
        </motion.g>

        <rect x="85" y="24" width="22" height="12" fill="#1e293b" stroke="#f97316" strokeWidth="0.5" rx="1" />
        <line x1="80" y1="36" x2="112" y2="36" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />

        {sparks.map(s => (
          <motion.circle
            key={s.id}
            cx={s.cx}
            cy={s.cy}
            r={1.1}
            fill="#f59e0b"
            animate={{ cx: s.cx + s.dx, cy: s.cy + s.dy, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </svg>
    </div>
  )
}

// 4. Inventory Hub - Storage Racks & Scanning laser
function InvVisual() {
  const cells = [
    [0,0,1],[0,1,0],[0,2,1],[0,3,1],
    [1,0,1],[1,1,1],[1,2,0],[1,3,1],
    [2,0,0],[2,1,1],[2,2,1],[2,3,0],
  ]

  return (
    <div className="w-full h-full relative p-1.5 flex flex-col justify-between">
      <div className="grid grid-cols-4 gap-1 h-[26px]">
        {cells.map(([r, c, active], i) => (
          <motion.div
            key={i}
            className="rounded-sm flex items-center justify-center"
            style={{
              background: active ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.02)',
              border: active ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.04)',
            }}
            animate={active ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={active ? { duration: 1.8 + (i % 3) * 0.4, repeat: Infinity, ease: "easeInOut" } : {}}
          >
            {active && (
              <div className="w-1 h-1 rounded-full bg-emerald-400" />
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.9)]"
        animate={{ top: ['4px', '32px', '4px'] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

// 5. Analytics - Live Bars
function RepVisual() {
  return (
    <div className="w-full h-full flex items-end justify-center gap-3 pb-1 px-4">
      <div className="flex flex-col items-center w-3 h-full justify-end">
        <motion.div
          className="w-full rounded-t bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.5)]"
          animate={{ height: ['25%', '65%', '45%', '25%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="text-[5px] text-slate-500 mt-1 select-none">Q1</div>
      </div>
      <div className="flex flex-col items-center w-3 h-full justify-end">
        <motion.div
          className="w-full rounded-t bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]"
          animate={{ height: ['45%', '85%', '50%', '45%'] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <div className="text-[5px] text-slate-500 mt-1 select-none">Q2</div>
      </div>
      <div className="flex flex-col items-center w-3 h-full justify-end">
        <motion.div
          className="w-full rounded-t bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.5)]"
          animate={{ height: ['15%', '50%', '80%', '15%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <div className="text-[5px] text-slate-500 mt-1 select-none">Q3</div>
      </div>
    </div>
  )
}

/* ── AI CORE MODULE ── */
function AICore() {
  return (
    <div className="relative" style={{ width:174, height:174 }}>
      <div className="absolute inset-0" style={{
        background:'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
        filter:'blur(22px)', transform:'scale(1.7)',
      }}/>
      <svg viewBox="0 0 174 174" className="w-full h-full">
        <defs>
          <filter id="cf"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="hf"><feGaussianBlur stdDeviation="9"/></filter>
          <radialGradient id="sg" cx="38%" cy="32%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)"/>
            <stop offset="40%" stopColor="#818cf8"/>
            <stop offset="100%" stopColor="#3730a3"/>
          </radialGradient>
          <radialGradient id="gg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.25)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>

        {/* Ambient sphere */}
        <circle cx="87" cy="87" r="72" fill="url(#gg)" filter="url(#hf)"/>

        {/* Ring 1 — outer, slow CCW */}
        <motion.circle cx="87" cy="87" r="80" fill="none"
          stroke="rgba(99,102,241,0.4)" strokeWidth="0.8" strokeDasharray="16 11"
          animate={{ rotate:[0,-360] }} transition={{ duration:30, repeat:Infinity, ease:'linear' }}
          style={{ transformOrigin:'87px 87px' }}/>

        {/* Ring 2 — CW */}
        <motion.circle cx="87" cy="87" r="67" fill="none"
          stroke="rgba(168,85,247,0.5)" strokeWidth="1.1" strokeDasharray="9 6"
          animate={{ rotate:[0,360] }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
          style={{ transformOrigin:'87px 87px' }}/>

        {/* Ring 3 — CCW fast, cyan */}
        <motion.circle cx="87" cy="87" r="55" fill="none"
          stroke="rgba(6,182,212,0.4)" strokeWidth="0.7" strokeDasharray="4 5"
          animate={{ rotate:[0,-360] }} transition={{ duration:13, repeat:Infinity, ease:'linear' }}
          style={{ transformOrigin:'87px 87px' }}/>

        {/* Hex ring */}
        <motion.polygon points="87,44 113,59 113,89 87,104 61,89 61,59"
          fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="0.7"
          animate={{ rotate:[0,360] }} transition={{ duration:45, repeat:Infinity, ease:'linear' }}
          style={{ transformOrigin:'87px 74px' }}/>

        {/* Center core */}
        <circle cx="87" cy="87" r="30" fill="rgba(99,102,241,0.1)" filter="url(#hf)"/>
        <circle cx="87" cy="87" r="22" fill="rgba(99,102,241,0.2)" filter="url(#cf)"/>
        <circle cx="87" cy="87" r="15" fill="url(#sg)" filter="url(#cf)"/>

        {/* Pulse rings */}
        <motion.circle cx="87" cy="87" r="22" fill="none" stroke="#6366f1" strokeWidth="1.2"
          animate={{ r:[23,82], opacity:[0.9,0] }}
          transition={{ duration:3.5, repeat:Infinity, repeatDelay:0.4 }}/>
        <motion.circle cx="87" cy="87" r="22" fill="none" stroke="#a855f7" strokeWidth="0.6"
          animate={{ r:[23,65], opacity:[0.6,0] }}
          transition={{ duration:3.5, repeat:Infinity, repeatDelay:0.4, delay:1.3 }}/>

        {/* Orbiting color nodes */}
        {([0,1,2,3,4] as const).map(i => (
          <motion.g key={i}
            animate={{ rotate: [i*72, i*72+360] }}
            transition={{ duration: 9+(i%3)*2, repeat:Infinity, ease:'linear' }}
            style={{ transformOrigin:'87px 87px' }}>
            <circle cx={87+57} cy={87} r={4}
              fill={(['#6366f1','#a855f7','#f97316','#10b981','#06b6d4'] as const)[i]}
              filter="url(#cf)" opacity={0.9}/>
            <circle cx={87+57} cy={87} r={7}
              fill={(['#6366f1','#a855f7','#f97316','#10b981','#06b6d4'] as const)[i]}
              opacity={0.2} filter="url(#hf)"/>
          </motion.g>
        ))}

        {/* Label */}
        <text x="87" y="84" textAnchor="middle" fill="rgba(165,180,252,0.9)"
          fontSize="8.5" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="2.5" className="select-none">ERP</text>
        <text x="87" y="94" textAnchor="middle" fill="rgba(139,92,246,0.65)"
          fontSize="5.5" fontFamily="system-ui,sans-serif" letterSpacing="2" className="select-none">NEXUS AI</text>
      </svg>
    </div>
  )
}

/* ── MODULE HOLOGRAM CARD ── */
interface CardProps {
  m: typeof MODULES[number];
  dynamicVal: string;
  dynamicS1v: string;
}

function ModuleCard({ m, dynamicVal, dynamicS1v }: CardProps) {
  return (
    <motion.div className="w-[154px] relative"
      whileHover={{ scale:1.06, y:-5, zIndex:30 }}
      transition={{ type:'spring', stiffness:350, damping:25 }}>
      {/* Outer glow on hover */}
      <motion.div className="absolute inset-0 rounded-2xl opacity-0"
        style={{ background: `radial-gradient(circle, ${m.clr}35 0%, transparent 70%)`, filter:'blur(12px)' }}
        whileHover={{ opacity:1 }}/>
      <div className="relative rounded-2xl overflow-hidden" style={{
        background:'rgba(3,5,19,0.93)',
        border:`1px solid ${m.clr}50`,
        backdropFilter:'blur(20px)',
        boxShadow:`0 0 24px ${m.clr}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}>
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage:'repeating-linear-gradient(0deg,rgba(255,255,255,0.5) 0px,rgba(255,255,255,0.5) 1px,transparent 1px,transparent 3px)' }}/>
        {/* Top bar */}
        <div className="h-[2.5px]" style={{ background:`linear-gradient(90deg,${m.clr},transparent)` }}/>
        
        <div className="p-3 relative">
          {/* Pulse indicator */}
          <motion.div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
            style={{ background:m.clr, boxShadow:`0 0 8px ${m.clr}` }}
            animate={{ opacity:[0.4,1,0.4], scale:[1,1.5,1] }}
            transition={{ duration:2.2, repeat:Infinity }}/>
          
          {/* Icon + label */}
          <div className="flex items-center gap-1.5 mb-1.5 select-none">
            <span className="text-[14px]">{m.icon}</span>
            <span className="text-[7.5px] font-black tracking-widest uppercase" style={{ color:m.clr }}>{m.label}</span>
          </div>
          
          {/* Value */}
          <div className="text-[19px] font-black text-white leading-none tracking-tight">{dynamicVal}</div>
          <div className="text-[7.5px] text-slate-500 mb-2 mt-0.5 select-none">{m.unit}</div>
          
          {/* Stats */}
          <div className="flex gap-4 pt-1.5" style={{ borderTop:`1px solid ${m.clr}20` }}>
            <div>
              <div className="text-[9.5px] font-bold text-white leading-tight">{dynamicS1v}</div>
              <div className="text-[6.5px] text-slate-500 select-none leading-none">{m.s1l}</div>
            </div>
            <div>
              <div className="text-[9.5px] font-bold text-white leading-tight">{m.s2v}</div>
              <div className="text-[6.5px] text-slate-500 select-none leading-none">{m.s2l}</div>
            </div>
          </div>

          {/* Interactive micro-visualization */}
          <div className="mt-2.5 h-10 w-full relative overflow-hidden rounded-lg bg-black/40 border border-slate-900/60">
            {m.id === 'sales' && <SalesVisual />}
            {m.id === 'proc' && <ProcVisual />}
            {m.id === 'mfg' && <MfgVisual />}
            {m.id === 'inv' && <InvVisual />}
            {m.id === 'rep' && <RepVisual />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── MAIN SCENE ══ */
export default function ERPNexusScene() {
  const ref = useRef<HTMLDivElement>(null)
  const mx  = useMotionValue(0.5)
  const my  = useMotionValue(0.5)
  const sp  = { stiffness:55, damping:22 }

  /* ══ STATEFUL COUNTERS ══ */
  const [salesRev, setSalesRev] = useState(283420)
  const [salesOrders, setSalesOrders] = useState(24)
  const [procPO, setProcPO] = useState(12)
  const [mfgOutput, setMfgOutput] = useState(142)
  const [invStock, setInvStock] = useState(1245)
  const [repGrowth, setRepGrowth] = useState(18.6)

  useEffect(() => {
    const interval = setInterval(() => {
      // Sales Increments
      setSalesRev(prev => prev + Math.floor(Math.random() * 60) + 15)
      if (Math.random() > 0.7) setSalesOrders(prev => prev + 1)
      
      // Procurement active fluctuator
      if (Math.random() > 0.8) {
        setProcPO(prev => {
          const delta = Math.random() > 0.5 ? 1 : -1
          const next = prev + delta
          return next >= 8 && next <= 18 ? next : prev
        })
      }

      // Manufacturing Output Counter
      if (Math.random() > 0.45) setMfgOutput(prev => prev + 1)
      
      // Stock updates
      setInvStock(prev => {
        const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2)
        const next = prev + delta
        return next > 1200 && next < 1300 ? next : prev
      })

      // Growth percentage drift
      setRepGrowth(prev => {
        const delta = (Math.random() - 0.5) * 0.04
        return parseFloat((prev + delta).toFixed(2))
      })
    }, 3200)

    return () => clearInterval(interval)
  }, [])

  const formatRupees = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  }

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top)  / r.height)
  }

  const [px1,py1] = [useSpring(useTransform(mx,[0,1],[-7, 7]),sp), useSpring(useTransform(my,[0,1],[-7, 7]),sp)]
  const [px2,py2] = [useSpring(useTransform(mx,[0,1],[-15,15]),sp),useSpring(useTransform(my,[0,1],[-15,15]),sp)]
  const [px3,py3] = [useSpring(useTransform(mx,[0,1],[-25,25]),sp),useSpring(useTransform(my,[0,1],[-25,25]),sp)]

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden" onMouseMove={onMove}>

      {/* Aurora */}
      <motion.div className="absolute inset-0"
        animate={{ background:[
          'radial-gradient(ellipse at 12% 50%, rgba(99,102,241,0.13) 0%, transparent 46%), radial-gradient(ellipse at 88% 18%, rgba(168,85,247,0.09) 0%, transparent 46%), #020617',
          'radial-gradient(ellipse at 55% 30%, rgba(99,102,241,0.16) 0%, transparent 50%), radial-gradient(ellipse at 22% 70%, rgba(168,85,247,0.12) 0%, transparent 46%), #020617',
          'radial-gradient(ellipse at 12% 50%, rgba(99,102,241,0.13) 0%, transparent 46%), radial-gradient(ellipse at 88% 18%, rgba(168,85,247,0.09) 0%, transparent 46%), #020617',
        ]}}
        transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}/>

      {/* Grid */}
      <div className="absolute inset-0" style={{
        backgroundImage:'linear-gradient(rgba(99,102,241,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.045) 1px, transparent 1px)',
        backgroundSize:'56px 56px',
      }}/>

      {/* City skyline */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end pointer-events-none opacity-40">
        {SKYLINE.map(([x,y,w,h],i) => (
          <div key={i} className="absolute" style={{
            left:`${x}%`, bottom:0, width:`${w}%`, height:`${h}%`,
            background:'rgba(5,7,24,0.95)',
            borderTop:`1px solid rgba(99,102,241,0.14)`,
            borderLeft:`1px solid rgba(99,102,241,0.06)`,
          }}/>
        ))}
      </div>

      {/* SVG: stars, particles, laser beams */}
      <motion.svg className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ x:px1, y:py1 }}>
        <defs>
          <filter id="ng" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Stars */}
        {STARS.map(([x,y,r,op,dur],i) => (
          <motion.circle key={`s${i}`} cx={x} cy={y} r={r*0.11} fill="white" opacity={op}
            animate={{ opacity:[op*0.2,op,op*0.2] }}
            transition={{ duration:dur, repeat:Infinity, delay:i*0.09 }}/>
        ))}

        {/* Particles */}
        {PARTS.map(([x,y,sz,op,dur,del],i) => (
          <motion.circle key={`p${i}`} cx={x} cy={y} r={sz*0.17} fill="#818cf8" opacity={op}
            animate={{ y:[-2.5,2.5,-2.5], opacity:[op,op*0.2,op] }}
            transition={{ duration:dur, repeat:Infinity, ease:'easeInOut', delay:del }}/>
        ))}

        {/* Beam outer glow */}
        {BEAMS.map((b,i) => (
          <line key={`bg${i}`} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
            stroke={b.c} strokeWidth="0.9" opacity={0.08}/>
        ))}

        {/* Animated dashed beams */}
        {BEAMS.map((b,i) => (
          <motion.line key={`b${i}`} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
            stroke={b.c} strokeWidth="0.14" strokeDasharray="0.9 0.6"
            animate={{ strokeDashoffset:[0,-3] }}
            transition={{ duration:1.2, repeat:Infinity, ease:'linear', delay:i*0.22 }}/>
        ))}

        {/* Data packets */}
        {BEAMS.map((b,i) => (
          [0,1].map(j => (
            <motion.circle key={`dp${i}${j}`} r={0.42} fill={b.c} filter="url(#ng)"
              animate={{
                cx: [j===0 ? b.x1 : b.mx, b.x2],
                cy: [j===0 ? b.y1 : b.my, b.y2],
                opacity:[1,0.05],
              }}
              transition={{ duration:1.5+i*0.18, repeat:Infinity, ease:'linear', delay:j*0.75+i*0.3 }}/>
          ))
        ))}

        {/* Core spark streams emitting from (41, 43) */}
        {[0,1,2,3,4,5].map(i => {
          const angle = (i * 60) * (Math.PI / 180)
          const dx = Math.cos(angle) * 7
          const dy = Math.sin(angle) * 7
          return (
            <motion.circle
              key={`core-spark-${i}`}
              r="0.25"
              fill="#a855f7"
              filter="url(#ng)"
              animate={{
                cx: [41, 41 + dx],
                cy: [43, 43 + dy],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.28,
              }}
            />
          )
        })}
      </motion.svg>

      {/* AI CORE */}
      <motion.div className="absolute pointer-events-none"
        style={{ left:'41%', top:'43%', transform:'translate(-50%,-50%)', x:px2, y:py2, zIndex: 5 }}>
        <AICore/>
      </motion.div>

      {/* MODULE CARDS */}
      {MODULES.map((m,i) => {
        let dVal = m.val
        let dS1v = m.s1v
        
        if (m.id === 'sales') {
          dVal = formatRupees(salesRev)
          dS1v = String(salesOrders)
        } else if (m.id === 'proc') {
          dVal = String(procPO)
        } else if (m.id === 'mfg') {
          dS1v = String(mfgOutput)
        } else if (m.id === 'inv') {
          dVal = invStock.toLocaleString('en-IN')
        } else if (m.id === 'rep') {
          dVal = `+${repGrowth}%`
        }

        return (
          <motion.div key={m.id} className="absolute" style={{ left:m.px, top:m.py, x:px3, y:py3, zIndex:10 }}
            initial={{ opacity:0, scale:0.65 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:i*0.14+0.5, duration:0.65, ease:[0.34,1.56,0.64,1] }}>
            <ModuleCard m={m} dynamicVal={dVal} dynamicS1v={dS1v}/>
          </motion.div>
        )
      })}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'

/* ══ Pre-computed isometric data — no Math.random ══
   Formula: ix=375+(c-r)*34, iy=100+(c+r)*17-h*28   */

const BLDS = [
  { id:'s', label:'SALES CENTER',  val:'24',     unit:'Orders',
    clr:'#3b82f6',
    top:'375,50 443,84 409,101 341,67',
    lft:'341,151 341,67 409,101 409,185', rgt:'443,168 443,84 409,101 409,185',
    cx:425, bx:392, cy:58, ty:76 },
  { id:'p', label:'PURCHASE',      val:'12',     unit:'To Receive',
    clr:'#a855f7',
    top:'511,146 579,180 545,197 477,163',
    lft:'477,219 477,163 545,197 545,253', rgt:'579,236 579,180 545,197 545,253',
    cx:545, bx:528, cy:158, ty:172 },
  { id:'i', label:'INVENTORY HUB', val:'1,245',  unit:'In Stock',
    clr:'#10b981',
    top:'307,84 375,118 307,152 239,118',
    lft:'239,202 239,118 307,152 307,236', rgt:'375,202 375,118 307,152 307,236',
    cx:258, bx:307, cy:95, ty:118 },
  { id:'m', label:'MANUFACTURING', val:'08',     unit:'In Progress',
    clr:'#f97316',
    top:'409,107 477,141 409,175 341,141',
    lft:'341,253 341,141 409,175 409,287', rgt:'477,253 477,141 409,175 409,287',
    cx:409, bx:409, cy:120, ty:141 },
  { id:'r', label:'REPORTS',       val:'+18.6%', unit:'Growth',
    clr:'#06b6d4',
    top:'239,180 307,214 273,231 205,197',
    lft:'205,253 205,197 273,231 273,287', rgt:'307,270 307,214 273,231 273,287',
    cx:248, bx:256, cy:190, ty:206 },
] as const

const ROADS = [
  {x1:409,y1:185,x2:477,y2:219,c:'#6366f1'},{x1:545,y1:253,x2:477,y2:253,c:'#a855f7'},
  {x1:341,y1:151,x2:307,y2:168,c:'#3b82f6'},{x1:307,y1:236,x2:307,y2:270,c:'#10b981'},
  {x1:341,y1:253,x2:239,y2:236,c:'#f97316'},
] as const

const GRID = [
  {x1:307,y1:134,x2:579,y2:270},{x1:239,y1:168,x2:511,y2:304},{x1:171,y1:202,x2:443,y2:338},
  {x1:443,y1:134,x2:171,y2:270},{x1:511,y1:168,x2:239,y2:304},{x1:579,y1:202,x2:307,y2:338},
] as const

// City skyline [x, topY, width, height]
const SKYLINE = [
  [8,62,12,38],[25,50,9,50],[38,58,16,42],[58,44,10,56],[72,52,14,48],
  [90,42,11,58],[105,56,18,44],[128,48,9,52],[142,60,15,40],[160,46,12,54],
  [515,50,14,50],[534,42,10,58],[548,55,17,45],[568,48,12,52],[584,56,15,44],
  [604,44,9,56],[618,60,16,40],[638,50,12,50],[654,46,9,54],[668,58,14,42],
] as const

// Glowing windows on building faces [x, y, color, animated]
const WINS = [
  {x:421,y:112,c:'#60a5fa'},{x:435,y:120,c:'#60a5fa'},{x:421,y:132,c:'#93c5fd'},{x:435,y:140,c:'#93c5fd'},
  {x:554,y:202,c:'#c084fc'},{x:567,y:210,c:'#c084fc'},{x:554,y:220,c:'#d8b4fe'},{x:567,y:228,c:'#d8b4fe'},
  {x:328,y:138,c:'#34d399'},{x:350,y:150,c:'#34d399'},{x:328,y:160,c:'#6ee7b7'},{x:350,y:172,c:'#6ee7b7'},{x:328,y:182,c:'#6ee7b7'},{x:350,y:194,c:'#6ee7b7'},
  {x:432,y:168,c:'#fb923c'},{x:452,y:178,c:'#fb923c'},{x:432,y:193,c:'#fdba74'},{x:452,y:203,c:'#fdba74'},{x:432,y:218,c:'#fdba74'},{x:452,y:228,c:'#fdba74'},
  {x:281,y:226,c:'#22d3ee'},{x:296,y:234,c:'#22d3ee'},{x:281,y:247,c:'#67e8f9'},{x:296,y:255,c:'#67e8f9'},
] as const

// Manufacturing sparks [x,y,dx,dy,delay,dur]
const SPARKS = [
  [441,176, 16,-22,0.0,0.85],[448,172,-13,-17,0.5,0.75],[444,179, 23,-14,1.0,0.9],
  [437,175,-19,-21,1.5,0.8],[451,171, 11,-26,0.3,1.0],[439,177, -9,-19,0.8,0.75],
  [445,174, 26,-12,1.3,0.85],[442,178,-16,-24,0.2,0.9],
] as const

// Stars [x,y,r,opacity,dur]
const STARS = [
  [38,12,1.2,0.5,2.5],[90,8,0.8,0.7,3.2],[155,18,1.5,0.4,2.8],[220,5,1.0,0.6,4.0],
  [285,22,0.8,0.3,2.3],[340,10,1.2,0.5,3.5],[455,6,1.5,0.4,3.8],[520,20,1.0,0.6,2.1],
  [580,12,0.8,0.3,4.2],[635,8,1.2,0.5,3.0],[695,18,0.8,0.7,2.6],[60,30,1.0,0.4,3.9],
  [130,42,1.5,0.6,2.4],[200,35,0.8,0.3,3.6],[350,38,0.8,0.7,4.1],[430,50,1.0,0.4,2.2],
  [510,42,1.5,0.6,3.4],[590,32,0.8,0.3,2.8],[665,45,1.2,0.5,3.7],[720,28,1.0,0.7,2.0],
  [18,55,0.8,0.4,3.1],[740,60,1.5,0.6,2.5],[270,48,1.2,0.5,2.9],[400,15,0.8,0.7,2.7],
] as const

// Floating particles [x,y,size,opacity,dur,delay]
const PARTS = [
  [80,250,2,0.45,4.0,0.0],[185,320,2.5,0.35,5.0,0.5],[275,185,2,0.55,3.5,1.0],
  [380,290,2,0.4,4.5,1.5],[475,215,2.5,0.5,4.0,2.0],[578,270,2,0.35,5.5,0.3],
  [128,348,2,0.55,3.8,0.8],[228,202,2.5,0.3,4.2,1.3],[328,310,2,0.45,4.8,0.2],
  [428,242,2,0.4,3.5,1.8],[528,172,2.5,0.55,5.0,0.7],[628,298,2,0.3,4.3,1.2],
  [58,222,2,0.45,4.6,0.4],[162,378,2.5,0.4,3.8,0.9],[698,260,2,0.55,4.1,1.6],
] as const

export default function ERPScene() {
  return (
    <svg viewBox="0 0 750 415" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="ng" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="bg"><feGaussianBlur stdDeviation="11"/></filter>
        <filter id="sg"><feGaussianBlur stdDeviation="26"/></filter>
        <filter id="mg"><feGaussianBlur stdDeviation="2"/></filter>
        <radialGradient id="pg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.12)"/>
          <stop offset="100%" stopColor="rgba(99,102,241,0.02)"/>
        </radialGradient>
      </defs>

      {/* ── Deep space ambient glows ── */}
      <circle cx="375" cy="220" r="260" fill="rgba(99,102,241,0.04)" filter="url(#sg)"/>
      <circle cx="530" cy="155" r="150" fill="rgba(168,85,247,0.04)" filter="url(#sg)"/>
      <circle cx="215" cy="285" r="120" fill="rgba(16,185,129,0.03)" filter="url(#sg)"/>
      <circle cx="415" cy="175" r="80"  fill="rgba(249,115,22,0.03)" filter="url(#sg)"/>

      {/* ── Smart city skyline ── */}
      {SKYLINE.map(([x,ty,w,h],i) => (
        <g key={`sky${i}`}>
          <rect x={x} y={ty} width={w} height={h}
            fill="rgba(12,20,55,0.88)" stroke="rgba(99,102,241,0.18)" strokeWidth="0.5"/>
          {/* Roof antenna */}
          <line x1={x+w/2} y1={ty} x2={x+w/2} y2={ty-6} stroke="rgba(99,102,241,0.35)" strokeWidth="0.8"/>
          <circle cx={x+w/2} cy={ty-7} r="1.5" fill={i%3===0?'#6366f1':i%3===1?'#a855f7':'#06b6d4'} opacity={0.7}/>
          {/* Windows */}
          {[0,1].flatMap(row => [0,1].map(col => (
            <motion.rect key={`w${row}${col}`}
              x={x+col*(w/2)+2} y={ty+row*10+8} width="3" height="4"
              fill={i%2===0 ? 'rgba(147,197,253,0.5)' : 'rgba(216,180,254,0.4)'} rx="0.5"
              animate={{ opacity: [0.3,0.8,0.3] }}
              transition={{ duration:2+i*0.12, repeat:Infinity, delay:i*0.08 }}/>
          )))}
        </g>
      ))}

      {/* ── Stars ── */}
      {STARS.map(([x,y,r,op,dur],i) => (
        <motion.circle key={`s${i}`} cx={x} cy={y} r={r} fill="white" opacity={op}
          animate={{ opacity:[op*0.2,op,op*0.2] }}
          transition={{ duration:dur,repeat:Infinity,delay:i*0.09 }}/>
      ))}

      {/* ── Floating particles ── */}
      {PARTS.map(([x,y,sz,op,dur,del],i) => (
        <motion.circle key={`p${i}`} cx={x} cy={y} r={sz} fill="#818cf8" opacity={op}
          animate={{ y:[-18,18,-18], opacity:[op,op*0.3,op] }}
          transition={{ duration:dur,repeat:Infinity,ease:'easeInOut',delay:del }}/>
      ))}

      {/* ── Platform diamond ── */}
      <polygon points="375,100 647,236 375,372 103,236"
        fill="url(#pg)" stroke="rgba(99,102,241,0.32)" strokeWidth="1.5"/>
      {/* Inner glow border */}
      <polygon points="375,100 647,236 375,372 103,236"
        fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="22"/>
      {/* Corner dots */}
      {[[375,100],[647,236],[375,372],[103,236]].map(([x,y],i) => (
        <motion.circle key={`cd${i}`} cx={x} cy={y} r={4} fill="#6366f1"
          animate={{ r:[3,5.5,3], opacity:[0.5,1,0.5] }}
          transition={{ duration:2.5,repeat:Infinity,delay:i*0.6 }}/>
      ))}

      {/* ── Grid ── */}
      {GRID.map((g,i) => (
        <line key={`g${i}`} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
          stroke="rgba(99,102,241,0.1)" strokeWidth="0.5"/>
      ))}

      {/* ── Road glow + animated dash ── */}
      {ROADS.map((r,i) => (
        <g key={`r${i}`}>
          <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke={r.c} strokeWidth="16" opacity={0.06}/>
          <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke={r.c} strokeWidth="4" opacity={0.12}/>
          <motion.line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke={r.c} strokeWidth="1.8" strokeDasharray="6 4"
            animate={{ strokeDashoffset:[0,-20] }}
            transition={{ duration:1.4,repeat:Infinity,ease:'linear',delay:i*0.28 }}/>
        </g>
      ))}

      {/* ── Buildings ── */}
      {BLDS.map((b,i) => (
        <motion.g key={b.id}
          initial={{ opacity:0, scaleY:0 }}
          animate={{ opacity:1, scaleY:1 }}
          style={{ transformOrigin:`${b.bx}px 296px` }}
          transition={{ delay:i*0.15+0.2, duration:0.8, ease:[0.34,1.56,0.64,1] }}>
          {/* Ground shadow */}
          <ellipse cx={b.bx} cy={296} rx={42} ry={8}
            fill={b.clr} opacity={0.14} filter="url(#bg)"/>
          {/* Right face */}
          <polygon points={b.rgt} fill={b.clr} fillOpacity={0.07}
            stroke={b.clr} strokeWidth="0.8" strokeOpacity={0.38}/>
          {/* Left face */}
          <polygon points={b.lft} fill={b.clr} fillOpacity={0.13}
            stroke={b.clr} strokeWidth="0.8" strokeOpacity={0.38}/>
          {/* Top face — neon glow */}
          <polygon points={b.top} fill={b.clr} fillOpacity={0.3}
            stroke={b.clr} strokeWidth="1.6" filter="url(#ng)"/>
          {/* Roof inner highlight */}
          <polygon points={b.top} fill="rgba(255,255,255,0.06)" strokeWidth="0"/>
          {/* Pulse ring */}
          <motion.polygon points={b.top} fill="none" stroke={b.clr} strokeWidth="6" strokeOpacity={0}
            animate={{ strokeOpacity:[0,0.28,0] }}
            transition={{ duration:2.5,repeat:Infinity,delay:i*0.65+1.5 }}/>
        </motion.g>
      ))}

      {/* ── Windows ── */}
      {WINS.map((w,i) => (
        <motion.rect key={`win${i}`} x={w.x-2} y={w.y-1.5} width="4.5" height="3.5" rx="0.8"
          fill={w.c} opacity={0.75}
          animate={{ opacity:[0.35,0.9,0.35] }}
          transition={{ duration:1.8+(i%5)*0.4, repeat:Infinity, delay:i*0.08 }}/>
      ))}

      {/* ── Manufacturing sparks ── */}
      {SPARKS.map(([x,y,dx,dy,del,dur],i) => (
        <motion.g key={`sp${i}`}>
          <motion.circle cx={x} cy={y} r={2.5} fill="#fbbf24" filter="url(#mg)"
            animate={{ cx:[x,x+dx], cy:[y,y+dy], opacity:[1,0], r:[2.5,0.3] }}
            transition={{ duration:dur, repeat:Infinity, ease:'easeOut', delay:del, repeatDelay:1.2 }}/>
          <motion.circle cx={x} cy={y} r={4} fill="#f59e0b" opacity={0.3}
            animate={{ cx:[x,x+dx*0.7], cy:[y,y+dy*0.7], opacity:[0.3,0] }}
            transition={{ duration:dur*0.8, repeat:Infinity, ease:'easeOut', delay:del, repeatDelay:1.2 }}/>
        </motion.g>
      ))}

      {/* ── Data orbs on roads ── */}
      {ROADS.map((r,i) => (
        <motion.g key={`d${i}`}>
          <motion.circle r={4.5} fill={r.c} filter="url(#ng)"
            animate={{ cx:[r.x1,r.x2], cy:[r.y1,r.y2] }}
            transition={{ duration:1.8+i*0.28, repeat:Infinity, repeatType:'reverse', ease:'easeInOut', delay:i*0.4 }}/>
          <motion.circle r={9} fill={r.c} opacity={0.14}
            animate={{ cx:[r.x1,r.x2], cy:[r.y1,r.y2] }}
            transition={{ duration:1.8+i*0.28, repeat:Infinity, repeatType:'reverse', ease:'easeInOut', delay:i*0.4 }}/>
        </motion.g>
      ))}

      {/* ── Department hologram cards ── */}
      {BLDS.map((b,i) => (
        <motion.g key={`c${b.id}`}
          initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:i*0.18+1.0, duration:0.6 }}>
          {/* Float animation */}
          <motion.g animate={{ y:[0,-8,0] }}
            transition={{ duration:3.5+i*0.4, repeat:Infinity, ease:'easeInOut', delay:i*0.55+2 }}>
            {/* Outer glow */}
            <rect x={b.cx-68} y={b.cy-54} width="136" height="64" rx="12"
              fill={b.clr} opacity={0.14} filter="url(#bg)"/>
            {/* Card bg */}
            <rect x={b.cx-68} y={b.cy-54} width="136" height="64" rx="12"
              fill="rgba(3,5,18,0.95)" stroke={b.clr} strokeWidth="1.2" strokeOpacity={0.78}/>
            {/* Inner white stroke */}
            <rect x={b.cx-68} y={b.cy-54} width="136" height="64" rx="12"
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            {/* Top accent bar */}
            <rect x={b.cx-68} y={b.cy-54} width="136" height="3.5" rx="2" fill={b.clr} opacity={1}/>
            {/* Dot indicator */}
            <circle cx={b.cx+56} cy={b.cy-46} r="3" fill={b.clr} opacity={0.9}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            {/* Label */}
            <text x={b.cx-55} y={b.cy-33} fill={b.clr} fontSize="7.5" fontWeight="700"
              fontFamily="system-ui,sans-serif" letterSpacing="1.3">{b.label}</text>
            {/* Value */}
            <text x={b.cx-55} y={b.cy-15} fill="white" fontSize="18" fontWeight="900"
              fontFamily="system-ui,sans-serif">{b.val}</text>
            {/* Unit */}
            <text x={b.cx-55} y={b.cy-3} fill="rgba(180,185,220,0.45)" fontSize="7.5"
              fontFamily="system-ui,sans-serif">{b.unit}</text>
            {/* Sparkline */}
            <polyline
              points={`${b.cx+8},${b.cy-14} ${b.cx+20},${b.cy-23} ${b.cx+32},${b.cy-18} ${b.cx+44},${b.cy-27} ${b.cx+56},${b.cy-22} ${b.cx+63},${b.cy-31}`}
              fill="none" stroke={b.clr} strokeWidth="1.6" opacity={0.82} strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx={b.cx+63} cy={b.cy-31} r="2.8" fill={b.clr} opacity={0.96}/>
            {/* Hologram ring */}
            <motion.ellipse cx={b.cx} cy={b.cy+11} rx={32} ry={7}
              fill="none" stroke={b.clr} strokeWidth="0.8"
              animate={{ opacity:[0,0.45,0], ry:[4,9,4] }}
              transition={{ duration:2.8, repeat:Infinity, delay:i*0.5+2.5 }}/>
          </motion.g>
          {/* Connector */}
          <motion.line x1={b.cx} y1={b.cy+11} x2={b.bx} y2={b.ty}
            stroke={b.clr} strokeWidth="1.1" strokeDasharray="3 2.5"
            animate={{ opacity:[0.2,0.75,0.2] }}
            transition={{ duration:2.2, repeat:Infinity, delay:i*0.35 }}/>
          <motion.circle cx={b.bx} cy={b.ty} r={2.8} fill={b.clr}
            animate={{ opacity:[0.4,1,0.4], r:[2,3.8,2] }}
            transition={{ duration:2.2, repeat:Infinity, delay:i*0.35 }}/>
        </motion.g>
      ))}
    </svg>
  )
}

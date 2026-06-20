"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Layers, 
  Cpu, 
  ShoppingCart, 
  Truck, 
  Activity, 
  Settings, 
  Archive, 
  IndianRupee,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  RefreshCw
} from "lucide-react";

interface ModuleNodeProps {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  active: boolean;
  onHover: (id: string | null) => void;
  status: string;
}

const ModuleNode: React.FC<ModuleNodeProps> = ({ 
  id, 
  name, 
  x, 
  y, 
  icon, 
  active, 
  onHover,
  status
}) => {
  return (
    <g 
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
      className="group"
    >
      {/* Outer Glow on hover */}
      <circle 
        cx="0" 
        cy="0" 
        r="44" 
        fill={active ? "rgba(139, 92, 246, 0.15)" : "rgba(6, 182, 212, 0.03)"}
        className="blur-md transition-all duration-500"
      />

      {/* Isometric Cube Visual Base */}
      {/* Bottom plate */}
      <polygon 
        points="0,-22 38,0 0,22 -38,0" 
        fill={active ? "rgba(124, 58, 237, 0.35)" : "rgba(17, 24, 39, 0.75)"} 
        stroke={active ? "#8B5CF6" : "rgba(255,255,255,0.08)"}
        strokeWidth="1.5"
        className="transition-all duration-500"
      />
      {/* Left Wall */}
      <polygon 
        points="-38,0 0,22 0,42 -38,20" 
        fill={active ? "rgba(109, 40, 217, 0.5)" : "rgba(10, 15, 30, 0.9)"}
        stroke={active ? "#7C3AED" : "rgba(255,255,255,0.06)"}
        strokeWidth="1.5"
        className="transition-all duration-500"
      />
      {/* Right Wall */}
      <polygon 
        points="0,22 38,0 38,20 0,42" 
        fill={active ? "rgba(91, 33, 182, 0.6)" : "rgba(3, 7, 18, 0.95)"}
        stroke={active ? "#7C3AED" : "rgba(255,255,255,0.06)"}
        strokeWidth="1.5"
        className="transition-all duration-500"
      />

      {/* Pulsing ring around node */}
      {active && (
        <path
          d="M -54 0 A 54 27 0 1 0 54 0 A 54 27 0 1 0 -54 0"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="glow-path-cyan"
          style={{ transform: "translateY(12px)", transformOrigin: "center" }}
        />
      )}

      {/* Floating Center Node Pillar */}
      <g transform="translate(0, -18)">
        {/* Floating cylinder */}
        <polygon 
          points="0,-20 22,-9 0,2 -22,-9" 
          fill={active ? "#06B6D4" : "#4B5563"}
          className="transition-all duration-500"
        />
        <polygon 
          points="-22,-9 0,2 0,12 -22,1" 
          fill={active ? "#0891B2" : "#374151"}
          className="transition-all duration-500"
        />
        <polygon 
          points="0,2 22,-9 22,1 0,12" 
          fill={active ? "#0e7490" : "#1F2937"}
          className="transition-all duration-500"
        />

        {/* Icon Floating Above */}
        <g transform="translate(0, -18)">
          <circle cx="0" cy="0" r="15" fill="rgba(10, 10, 22, 0.9)" stroke={active ? "#06B6D4" : "rgba(255, 255, 255, 0.15)"} strokeWidth="1.5" className="transition-all duration-500" />
          <g transform="translate(-7.5, -7.5) scale(0.62)">
            {icon}
          </g>
        </g>
      </g>

      {/* Text label underneath */}
      <g transform="translate(0, 64)">
        {/* Text background bubble */}
        <rect 
          x="-55" 
          y="-12" 
          width="110" 
          height="32" 
          rx="6" 
          fill="rgba(3, 7, 18, 0.85)" 
          stroke={active ? "rgba(139, 92, 246, 0.4)" : "rgba(255, 255, 255, 0.04)"}
          strokeWidth="1"
        />
        <text 
          textAnchor="middle" 
          fill={active ? "#06B6D4" : "#D1D5DB"} 
          fontSize="10" 
          fontWeight="700" 
          fontFamily="var(--font-display)"
          letterSpacing="0.8"
        >
          {name.toUpperCase()}
        </text>
        <text 
          y="15"
          textAnchor="middle" 
          fill={active ? "#8B5CF6" : "#6B7280"} 
          fontSize="8" 
          fontWeight="500" 
          fontFamily="var(--font-sans)"
        >
          {status}
        </text>
      </g>
    </g>
  );
};

export const IsometricFactory: React.FC = () => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  
  // Live business values
  const [revenue, setRevenue] = useState(1483920);
  const [inventoryOccupancy, setInventoryOccupancy] = useState(72.5);
  const [lowStockRemaining, setLowStockRemaining] = useState(12);
  const [roboticAngle, setRoboticAngle] = useState(0);
  const [activeBatchProgress, setActiveBatchProgress] = useState(64);
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  const businessInsights = [
    {
      title: "Logistics Routing Optimization",
      desc: "AI suggested route consolidations to save $4,200 in procurement costs this week.",
      badge: "Procurement Efficiency",
      color: "border-cyan-500/20 text-cyan-400 bg-cyan-950/25"
    },
    {
      title: "Assembly Scheduling Alert",
      desc: "Smart reallocation shifted production queue for Batch #409, boosting throughput by 14%.",
      badge: "Manufacturing Scale",
      color: "border-purple-500/20 text-purple-400 bg-purple-950/25"
    },
    {
      title: "Demand Forecast Spike",
      desc: "Order influx predicted for inventory modules. Warehouses preparing load distribution.",
      badge: "Predictive Sales",
      color: "border-violet-500/20 text-violet-400 bg-violet-950/25"
    }
  ];

  useEffect(() => {
    // Ticking revenue counter
    const revenueTimer = setInterval(() => {
      setRevenue((prev) => prev + Math.floor(Math.random() * 25) + 3);
    }, 1200);

    // Live inventory & batch simulation
    const telemetryTimer = setInterval(() => {
      setInventoryOccupancy((prev) => {
        const change = (Math.random() - 0.5) * 0.3;
        return parseFloat(Math.min(94, Math.max(30, prev + change)).toFixed(1));
      });
      setActiveBatchProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 2000);

    // Robot rotation
    const rotationTimer = setInterval(() => {
      setRoboticAngle((prev) => (prev + 3) % 360);
    }, 50);

    // Insight rotation
    const insightTimer = setInterval(() => {
      setActiveInsightIndex((prev) => (prev + 1) % businessInsights.length);
    }, 7000);

    return () => {
      clearInterval(revenueTimer);
      clearInterval(telemetryTimer);
      clearInterval(rotationTimer);
      clearInterval(insightTimer);
    };
  }, []);

  const formatRevenue = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 relative" style={{ minHeight: "100%" }}>
      
      {/* Floating AI Assistant Orb (Top-Right of left panel) */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        className="absolute top-2 right-4 z-20 max-w-[230px]"
      >
        <div className="glass-panel p-3.5 rounded-2xl border border-violet-500/35 relative group flex items-start gap-3 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          {/* AI Pulsing Orb Sphere */}
          <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-60"></div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider font-display">Nexus Assistant</span>
              <span className="bg-emerald-950 text-emerald-400 text-[7px] font-extrabold px-1 rounded">LIVE</span>
            </div>
            <p className="text-[9px] leading-relaxed text-slate-300 font-medium">
              "procurement lines optimized. Expected margins increased by <span className="text-cyan-400 font-bold">+$12.4k</span>."
            </p>
          </div>
        </div>
      </motion.div>

      {/* SVG Smart Factory Scene Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-[620px] aspect-[4/3] flex items-center justify-center"
      >
        <svg 
          viewBox="0 0 720 520" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_25px_45px_rgba(124,58,237,0.12)]"
        >
          {/* Floor Isometric Grid Overlay */}
          <g opacity="0.12">
            <path d="M 60 360 L 360 60 M 110 390 L 460 90 M 160 420 L 560 120 M 210 450 L 660 150" stroke="white" strokeWidth="0.5" />
            <path d="M 660 360 L 360 60 M 610 390 L 260 90 M 560 420 L 160 120 M 510 450 L 60 150" stroke="white" strokeWidth="0.5" />
          </g>

          {/* Active Data Streams (Paths) */}
          {/* Sales to Manufacturing */}
          <path d="M 530 180 Q 430 160 360 215" fill="none" className="glow-path-base" />
          <path 
            d="M 530 180 Q 430 160 360 215" 
            fill="none" 
            className={hoveredModule === "sales" || hoveredModule === "manufacturing" ? "glow-path-cyan" : "glow-path-purple"} 
          />

          {/* Manufacturing to Inventory */}
          <path d="M 360 265 Q 270 290 190 320" fill="none" className="glow-path-base" />
          <path 
            d="M 360 265 Q 270 290 190 320" 
            fill="none" 
            className={hoveredModule === "manufacturing" || hoveredModule === "inventory" ? "glow-path-cyan" : "glow-path-purple"} 
          />

          {/* Procurement to Purchase */}
          <path d="M 230 150 Q 390 150 590 280" fill="none" className="glow-path-base" />
          <path 
            d="M 230 150 Q 390 150 590 280" 
            fill="none" 
            className={hoveredModule === "procurement" || hoveredModule === "purchase" ? "glow-path-cyan" : "glow-path-purple"} 
          />

          {/* Purchase to Inventory */}
          <path d="M 590 280 Q 390 350 190 320" fill="none" className="glow-path-base" />
          <path 
            d="M 590 280 Q 390 350 190 320" 
            fill="none" 
            className={hoveredModule === "purchase" || hoveredModule === "inventory" ? "glow-path-cyan" : "glow-path-purple"} 
          />

          {/* Manufacturing to Procurement */}
          <path d="M 360 215 Q 290 170 230 150" fill="none" className="glow-path-base" />
          <path 
            d="M 360 215 Q 290 170 230 150" 
            fill="none" 
            className={hoveredModule === "manufacturing" || hoveredModule === "procurement" ? "glow-path-cyan" : "glow-path-purple"} 
          />

          {/* Conveyor Belt & Moving Box */}
          <g transform="translate(190, 320)">
            {/* Belt Base */}
            <path d="M -30 20 L 50 60" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
            <path d="M -30 20 L 50 60" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" opacity="0.6" />
            
            {/* Conveyer Box */}
            <g transform="translate(10, 40)">
              {/* Top Face */}
              <polygon points="0,-8 10,-3 0,2 -10,-3" fill="#D97706" />
              {/* Left Face */}
              <polygon points="-10,-3 0,2 0,7 -10,2" fill="#B45309" />
              {/* Right Face */}
              <polygon points="0,2 10,-3 10,2 0,7" fill="#92400E" />
            </g>
          </g>

          {/* Robotic Manufacturing Arm */}
          <g transform="translate(360, 220)">
            <polygon points="-15,0 15,0 10,6 -10,6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
            {/* Swiveling Arm */}
            <g transform={`rotate(${Math.sin(roboticAngle * Math.PI / 180) * 20}, 0, 0)`}>
              <line x1="0" y1="0" x2="-8" y2="-22" stroke="#8B5CF6" strokeWidth="3" />
              <circle cx="-8" cy="-22" r="3.5" fill="#06B6D4" />
              <line x1="-8" y1="-22" x2="8" y2="-36" stroke="#8B5CF6" strokeWidth="2.5" />
              <polygon points="6,-38 10,-38 8,-33" fill="#06B6D4" />
              
              {/* Pulsing Spark */}
              {Math.abs(Math.sin(roboticAngle * Math.PI / 180)) > 0.8 && (
                <circle cx="8" cy="-37" r="2.5" fill="#FFFFFF" className="animate-pulse" />
              )}
            </g>
          </g>

          {/* Logistics Delivery Truck */}
          <g transform="translate(120, 360)">
            {/* Truck Container */}
            <polygon points="0,-16 22,-5 0,6 -22,-5" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255,255,255,0.2)" />
            <polygon points="-22,-5 0,6 0,21 -22,10" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.2)" />
            <polygon points="0,6 22,-5 22,10 0,21" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255,255,255,0.2)" />
            
            {/* Cab */}
            <polygon points="22,-5 34,0 22,5 10,0" fill="#7C3AED" opacity="0.8" />
            <polygon points="10,0 22,5 22,15 10,10" fill="#6D28D9" opacity="0.8" />
            <polygon points="22,5 34,0 34,10 22,15" fill="#5B21B6" opacity="0.9" />

            {/* Headlights Glow */}
            <polygon points="34,8 58,16 48,22 34,12" fill="url(#truck-glow)" opacity="0.45" />
          </g>

          {/* Module Nodes */}
          
          {/* 1. SALES */}
          <ModuleNode 
            id="sales"
            name="Sales"
            x={530}
            y={180}
            icon={<ShoppingCart className="text-purple-400" />}
            active={hoveredModule === "sales"}
            onHover={setHoveredModule}
            status="Order Queued"
          />

          {/* 2. PROCUREMENT */}
          <ModuleNode 
            id="procurement"
            name="Procurement"
            x={230}
            y={150}
            icon={<Truck className="text-cyan-400" />}
            active={hoveredModule === "procurement"}
            onHover={setHoveredModule}
            status="Shipments OK"
          />

          {/* 3. MANUFACTURING */}
          <ModuleNode 
            id="manufacturing"
            name="Manufacturing"
            x={360}
            y={240}
            icon={<Cpu className="text-violet-400" />}
            active={hoveredModule === "manufacturing"}
            onHover={setHoveredModule}
            status="Robots: Active"
          />

          {/* 4. PURCHASE */}
          <ModuleNode 
            id="purchase"
            name="Purchase"
            x={590}
            y={280}
            icon={<IndianRupee className="text-emerald-400" />}
            active={hoveredModule === "purchase"}
            onHover={setHoveredModule}
            status="Awaiting PO"
          />

          {/* 5. INVENTORY */}
          <ModuleNode 
            id="inventory"
            name="Inventory"
            x={190}
            y={320}
            icon={<Archive className="text-cyan-400" />}
            active={hoveredModule === "inventory"}
            onHover={setHoveredModule}
            status={`${inventoryOccupancy}% Stock`}
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="truck-glow" x1="34" y1="8" x2="58" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Grid of Business Metrics & Live Widgets */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-1.5 px-2 z-10">
        
        {/* Widget 1: Revenue Counter Widget */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold tracking-wider font-display uppercase">Gross Revenue Flow</span>
            <span className="flex items-center text-emerald-400 font-bold gap-0.5">
              <TrendingUp size={12} /> +18.2%
            </span>
          </div>

          <div className="text-2xl font-black text-white tracking-tight mt-2 flex items-center font-display">
            <IndianRupee className="text-cyan-400 w-5 h-5 mr-0.5" />
            {formatRevenue(revenue)}
          </div>

          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
            <span className="text-[9px] text-slate-500 font-medium">Auto-synced with Stripe & Ledger API</span>
          </div>
        </motion.div>

        {/* Widget 2: Low Stock Alert Widget */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col justify-between border-l-2 border-l-amber-500"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold tracking-wider font-display uppercase">Critical Inventory Alerts</span>
            <span className="bg-amber-950 text-amber-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">Action Required</span>
          </div>

          <div className="mt-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-400 w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-semibold text-white font-display">Microchip CPU-M2</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Only <span className="text-amber-400 font-bold">{lowStockRemaining} units</span> remaining. Minimum threshold set at 30.
            </p>
          </div>

          <div className="flex justify-between items-center mt-2 text-[9px]">
            <span className="text-slate-500 font-medium">Suggested: Dispatch order to supplier</span>
            <button 
              onClick={() => {
                setLowStockRemaining(150);
              }}
              className="text-cyan-400 hover:text-white transition-colors font-bold uppercase flex items-center gap-0.5 cursor-pointer"
            >
              <span>Auto-Reorder</span>
              <ChevronRight size={10} />
            </button>
          </div>
        </motion.div>

        {/* Widget 3: Manufacturing Status Widget */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold tracking-wider font-display uppercase">Robotics Assembly Line</span>
            <span className="text-purple-400 font-bold text-xs font-display">98.4% EFF</span>
          </div>

          <div className="mt-2.5">
            <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-semibold">
              <span>BATCH #409: ASSEMBLY CYCLE</span>
              <span>{activeBatchProgress}%</span>
            </div>
            <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-300"
                style={{ width: `${activeBatchProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5">
            <Activity className="text-purple-500 w-3 h-3 animate-pulse" />
            <span className="text-[9px] text-slate-500 font-medium">Node M2-Arm operating within thermal bounds</span>
          </div>
        </motion.div>

        {/* Widget 4: Animated Business Insights Cards */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[105px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeInsightIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col justify-between h-full w-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-display">AI System Insights</span>
                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${businessInsights[activeInsightIndex].color}`}>
                  {businessInsights[activeInsightIndex].badge}
                </span>
              </div>

              <div className="mt-2.5">
                <h4 className="text-xs font-bold text-white font-display">
                  {businessInsights[activeInsightIndex].title}
                </h4>
                <p className="text-[9px] leading-relaxed text-slate-400 mt-1">
                  {businessInsights[activeInsightIndex].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

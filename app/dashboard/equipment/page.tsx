'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { 
  Wrench, PlusCircle, X, ShieldCheck, Sparkles, 
  Activity, Thermometer, AlertTriangle, CheckCircle2
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Machine {
  id: string
  name: string
  status: 'Nominal' | 'Idle' | 'Warning' | 'Critical'
  temp: number // °C
  load: number // %
  vibration: number // Hz
  lastMaintenance: string
}

interface MaintenanceTask {
  id: string
  machine: string
  task: string
  assignedTo: string
  date: string
  status: 'Scheduled' | 'In Progress' | 'Completed'
}

const initialMachines: Machine[] = [
  { id: 'MC-001', name: 'CNC Wood Router Node-A', status: 'Nominal', temp: 58, load: 82, vibration: 450, lastMaintenance: '2026-06-10' },
  { id: 'MC-002', name: 'Hydraulic Press Node-B', status: 'Nominal', temp: 62, load: 75, vibration: 380, lastMaintenance: '2026-06-12' },
  { id: 'MC-003', name: 'Pneumatic Assembly Node-10', status: 'Warning', temp: 88, load: 92, vibration: 610, lastMaintenance: '2026-05-18' },
  { id: 'MC-004', name: 'Edge Banding System-C', status: 'Nominal', temp: 54, load: 45, vibration: 300, lastMaintenance: '2026-06-08' },
  { id: 'MC-005', name: 'Varnish Spray Unit-D', status: 'Idle', temp: 40, load: 0, vibration: 0, lastMaintenance: '2026-06-15' }
]

const initialTasks: MaintenanceTask[] = [
  { id: 'TSK-101', machine: 'Pneumatic Assembly Node-10', task: 'Pneumatic Valve Calibrations', assignedTo: 'David Kim', date: '2026-06-21', status: 'Scheduled' },
  { id: 'TSK-102', machine: 'CNC Wood Router Node-A', task: 'Spindle Lubrication', assignedTo: 'David Kim', date: '2026-06-22', status: 'Scheduled' },
  { id: 'TSK-103', machine: 'Varnish Spray Unit-D', task: 'Nozzle Flushing', assignedTo: 'David Kim', date: '2026-06-19', status: 'Completed' }
]

export default function EquipmentPage() {
  const { user } = useAuth()
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [tasks, setTasks] = useState<MaintenanceTask[]>(initialTasks)
  const [selectedMachineId, setSelectedMachineId] = useState<string>('MC-001')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMachineName, setSelectedMachineName] = useState(initialMachines[0].name)
  const [newTitle, setNewTitle] = useState('')

  const activeMachine = useMemo(() => {
    return machines.find(m => m.id === selectedMachineId) || machines[0]
  }, [machines, selectedMachineId])

  // Stats calculation
  const stats = useMemo(() => {
    const total = machines.length
    const healthyCount = machines.filter(m => m.status === 'Nominal' || m.status === 'Idle').length
    const warningCount = machines.filter(m => m.status === 'Warning' || m.status === 'Critical').length
    const activeTasks = tasks.filter(t => t.status !== 'Completed').length

    return {
      total,
      healthy: healthyCount,
      warnings: warningCount,
      activeTasks
    }
  }, [machines, tasks])

  // Advance Task Stage
  const advanceTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let nextStatus: MaintenanceTask['status'] = t.status
        if (t.status === 'Scheduled') {
          nextStatus = 'In Progress'
        } else if (t.status === 'In Progress') {
          nextStatus = 'Completed'
          
          // Clear machine warning state
          setMachines(prevM => prevM.map(m => {
            if (m.name === t.machine) {
              return { ...m, status: 'Nominal', temp: 55, vibration: 400 }
            }
            return m
          }))

          confetti({
            particleCount: 70,
            spread: 50,
            colors: ['#22C55E', '#06B6D4']
          })
        }
        return { ...t, status: nextStatus }
      }
      return t
    }))
  }

  // Handle Add Maintenance Task
  const handleScheduleTask = (e: React.FormEvent) => {
    e.preventDefault()

    const newTask: MaintenanceTask = {
      id: `TSK-${Math.floor(Math.random() * 900) + 100}`,
      machine: selectedMachineName,
      task: newTitle,
      assignedTo: user?.name || 'David Kim',
      date: new Date().toISOString().split('T')[0],
      status: 'Scheduled'
    }

    setTasks(prev => [newTask, ...prev])
    setIsModalOpen(false)
    setNewTitle('')

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#7C3AED', '#06B6D4']
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
            Asset Telemetry Core
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
            Equipment Command Center 🔧
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time machine telemetries, temperature indexes, and dispatch preventive maintenance tasks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow transition-all cursor-pointer border-none flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Schedule Service
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {[
          { title: 'Total Machines Managed', value: stats.total, desc: 'Registered production workstations', color: 'border-slate-500/25', icon: <Wrench className="w-4 h-4 text-slate-400" /> },
          { title: 'Healthy Status Index', value: stats.healthy, desc: 'Workstations running nominally', color: 'border-emerald-500/25', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" /> },
          { title: 'Telemetry Warnings', value: stats.warnings, desc: 'Workstations with critical warnings', color: 'border-red-500/25', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
          { title: 'Service Workorders', value: stats.activeTasks, desc: 'Active maintenance tasks dispatched', color: 'border-cyan-500/25', icon: <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> }
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

      {/* Main Grid: Machine list & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative items-start">
        
        {/* Left Column: Machines Telemetry List (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden p-6">
            <h3 className="font-extrabold text-sm text-white mb-4">Workstation Telemetries</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map((machine) => {
                const isSelected = machine.id === selectedMachineId
                let badgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                if (machine.status === 'Warning') badgeColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                if (machine.status === 'Critical') badgeColor = 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse'
                if (machine.status === 'Idle') badgeColor = 'bg-slate-500/10 border-white/5 text-slate-400'

                return (
                  <div
                    key={machine.id}
                    onClick={() => setSelectedMachineId(machine.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'bg-purple-950/30 border-purple-500/50 shadow-lg shadow-purple-500/5' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono text-cyan-400 block">{machine.id}</span>
                        <h4 className="text-xs font-extrabold text-white mt-1 leading-snug">{machine.name}</h4>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {machine.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-400 border-t border-white/[0.04] pt-3">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-red-400" />
                        <span>{machine.temp}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{machine.load}% Load</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        <span>{machine.vibration}Hz</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Maintenance Tasks list */}
          <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-2xl overflow-hidden p-6">
            <h3 className="font-extrabold text-sm text-white mb-4">Maintenance Schedule</h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="p-3.5 bg-slate-950/60 border border-white/[0.05] rounded-xl flex justify-between items-center text-xs font-bold">
                  <div>
                    <span className="text-[8px] font-mono text-cyan-400 block">{task.id}</span>
                    <h4 className="text-white font-extrabold mt-0.5">{task.task}</h4>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">{task.machine} | Assigned to {task.assignedTo}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : task.status === 'In Progress'
                          ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 animate-pulse'
                          : 'bg-white/5 border border-white/10 text-slate-400'
                    }`}>
                      {task.status}
                    </span>

                    {task.status !== 'Completed' && (
                      <button
                        onClick={() => advanceTask(task.id)}
                        className="bg-slate-900 hover:bg-slate-800 border border-white/5 text-[9px] uppercase font-bold py-1.5 px-3 rounded-lg text-cyan-400 hover:text-white cursor-pointer"
                      >
                        {task.status === 'Scheduled' ? 'Start' : 'Resolve'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Predictive Maintenance Insights (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-gradient-to-br from-purple-950/40 to-cyan-950/40 border border-purple-500/20 p-6 rounded-3xl backdrop-blur-2xl relative">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              AI Predictive Maintenance
            </h3>

            <div className="space-y-4">
              {activeMachine?.status === 'Warning' ? (
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-[10px] text-slate-300 leading-normal font-normal flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <strong className="text-red-400 block font-bold">Failure Risk: High</strong>
                    Vibrations on {activeMachine?.name} have exceeded the warning threshold (610Hz vs 500Hz normal). Scheduled calibrations are required to prevent spindle failure.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-normal">
                  No telemetry anomalies flagged for {activeMachine?.name}. Calculated machine failure risk is under 0.5% for the next 72 hours.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Add Maintenance Modal */}
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
                <h3 className="text-lg font-black tracking-tight text-white">Schedule Workstation Service</h3>
                <p className="text-xs text-slate-400 mt-1">Issue a preventive maintenance task inside the operational planner.</p>
              </div>

              <form onSubmit={handleScheduleTask} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Select Workstation</label>
                  <select
                    value={selectedMachineName}
                    onChange={(e) => setSelectedMachineName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 hover:border-white/20 focus:border-purple-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all"
                  >
                    {machines.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Service Task Description</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Recalibrate Pneumatic Assembly Node"
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
                    Dispatch Service
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

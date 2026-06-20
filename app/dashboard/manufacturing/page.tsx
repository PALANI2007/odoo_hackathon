'use client'

import { motion } from 'framer-motion'
import KPICard from '@/components/kpi-card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { kpiTargets, productionData } from '@/lib/mock-data'

export default function ManufacturingDashboard() {
  const kpis = kpiTargets.manufacturing
  const kpiArray = Object.entries(kpis).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace('_', ' '),
    ...value,
  }))

  return (
    <motion.div
      className="p-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Manufacturing Operations ⚙️</h1>
        <p className="text-muted-foreground mt-2">Monitor production efficiency and quality metrics</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {kpiArray.map((kpi, idx) => (
          <KPICard key={idx} kpi={kpi} index={idx} />
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-foreground mb-4">Production Output</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 13, 29, 0.95)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="production" fill="#7c3aed" name="Production" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#06b6d4" name="Target" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-foreground mb-4">Quality Control</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 13, 29, 0.95)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                dataKey="defects" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Defects"
                dot={{ fill: '#f59e0b', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  )
}

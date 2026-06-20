'use client'

import { motion } from 'framer-motion'
import KPICard from '@/components/kpi-card'
import InventoryChart from '@/components/charts/inventory-chart'
import { kpiTargets, inventoryData } from '@/lib/mock-data'

export default function InventoryDashboard() {
  const kpis = kpiTargets.inventory
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
        <h1 className="text-4xl font-bold text-foreground">Inventory Management 📦</h1>
        <p className="text-muted-foreground mt-2">Monitor stock levels and warehouse operations</p>
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
          <h2 className="text-lg font-bold text-foreground mb-4">Stock Distribution</h2>
          <InventoryChart />
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-foreground mb-4">Categories Overview</h2>
          <div className="space-y-3">
            {inventoryData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <span className="text-sm text-secondary font-bold">${item.value.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.stock / 3000) * 100}%` }}
                    transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.stock} units (Reorder: {item.reorder})
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import KPICard from '@/components/kpi-card'
import { kpiTargets, purchaseMetrics } from '@/lib/mock-data'

export default function PurchaseDashboard() {
  const kpis = kpiTargets.purchase
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
        <h1 className="text-4xl font-bold text-foreground">Procurement Dashboard 💼</h1>
        <p className="text-muted-foreground mt-2">Manage suppliers and purchase orders</p>
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
        className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-bold text-foreground mb-4">Supplier Performance</h2>
        <div className="space-y-3">
          {purchaseMetrics.map((supplier, idx) => (
            <motion.div
              key={idx}
              className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{supplier.supplier}</h3>
                  <p className="text-sm text-muted-foreground">
                    Total PO Value: ${supplier.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    supplier.status === 'on_time' ? 'text-green-400' : 'text-amber-400'
                  }`}>
                    {supplier.status === 'on_time' ? '✓ On Time' : '⚠ Delayed'}
                  </div>
                  <p className="text-sm text-secondary">{supplier.rating}/5.0</p>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${(supplier.rating / 5) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

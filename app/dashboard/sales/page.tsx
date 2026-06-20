'use client'

import { motion } from 'framer-motion'
import KPICard from '@/components/kpi-card'
import SalesChart from '@/components/charts/sales-chart'
import { kpiTargets, recentOrders } from '@/lib/mock-data'

export default function SalesDashboard() {
  const kpis = kpiTargets.sales
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
        <h1 className="text-4xl font-bold text-foreground">Sales Dashboard 📈</h1>
        <p className="text-muted-foreground mt-2">Track your sales performance and pipeline</p>
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
          <h2 className="text-lg font-bold text-foreground mb-4">Revenue Trends</h2>
          <SalesChart />
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Orders</h2>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-3 bg-muted/30 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">${order.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import KPICard from '@/components/kpi-card'
import SalesChart from '@/components/charts/sales-chart'
import InventoryChart from '@/components/charts/inventory-chart'
import ActivityFeed from '@/components/activity-feed'
import { kpiTargets, activityLog } from '@/lib/mock-data'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const kpis = kpiTargets[user.role] || kpiTargets.admin
  const kpiArray = Object.entries(kpis).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace('_', ' '),
    ...value,
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-foreground">
          Welcome, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your {user.role.replace('_', ' ')} dashboard overview
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {kpiArray.map((kpi, idx) => (
          <KPICard key={idx} kpi={kpi} index={idx} />
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Sales Metrics</h2>
          <SalesChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Inventory Distribution</h2>
          <InventoryChart />
        </motion.div>
      </motion.div>

      {/* Activity and Summary */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div
          className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
          <ActivityFeed activities={activityLog} />
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Status</span>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AI Engine</span>
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">All systems operational ✓</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

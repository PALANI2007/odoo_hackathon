'use client'
import { motion } from 'framer-motion'
export default function OrdersPage() {
  return (
    <motion.div className="p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold text-foreground mb-4">Orders 📋</h1>
      <div className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl">
        <p className="text-muted-foreground">Order management system coming soon...</p>
      </div>
    </motion.div>
  )
}

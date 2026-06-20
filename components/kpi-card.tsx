'use client'

import { motion } from 'framer-motion'

interface KPI {
  name: string
  current: number
  target: number
  unit: string
}

interface KPICardProps {
  kpi: KPI
  index: number
}

export default function KPICard({ kpi, index }: KPICardProps) {
  const percentage = (kpi.current / kpi.target) * 100
  const isExceeding = kpi.current > kpi.target
  const difference = isExceeding 
    ? kpi.current - kpi.target 
    : kpi.target - kpi.current

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      className="bg-card border border-border/50 rounded-xl p-6 backdrop-blur-xl overflow-hidden relative group hover:border-primary/50 transition-colors"
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground capitalize">
            {kpi.name}
          </h3>
          <motion.div
            animate={{ rotate: isExceeding ? 12 : -12 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
            className={`text-2xl ${isExceeding ? '📈' : '📊'}`}
          />
        </div>

        {/* Value */}
        <div>
          <motion.div
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {kpi.current.toLocaleString()}{kpi.unit}
          </motion.div>
          <p className="text-xs text-muted-foreground mt-1">
            Target: {kpi.target.toLocaleString()}{kpi.unit}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isExceeding 
                  ? 'bg-gradient-to-r from-primary to-secondary' 
                  : 'bg-gradient-to-r from-secondary to-primary'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${
              isExceeding ? 'text-green-400' : 'text-amber-400'
            }`}>
              {isExceeding ? '+' : ''}{difference.toLocaleString()}{kpi.unit}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

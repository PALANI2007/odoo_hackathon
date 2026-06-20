'use client'

import { motion } from 'framer-motion'

interface Activity {
  id: number
  action: string
  timestamp: string
  icon: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          variants={itemVariants}
          className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
        >
          <div className="text-2xl flex-shrink-0 mt-1">{activity.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground line-clamp-2">
              {activity.action}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activity.timestamp}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-primary text-lg flex-shrink-0"
          >
            →
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

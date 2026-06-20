'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const menuConfig = {
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Sales Overview', href: '/dashboard/sales', icon: '📈' },
    { label: 'Inventory', href: '/dashboard/inventory', icon: '📦' },
    { label: 'Manufacturing', href: '/dashboard/manufacturing', icon: '🏭' },
    { label: 'Procurement', href: '/dashboard/purchase', icon: '💼' },
    { label: 'Analytics', href: '/dashboard/analytics', icon: '📉' },
    { label: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
  ],
  sales: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Leads', href: '/dashboard/leads', icon: '👥' },
    { label: 'Orders', href: '/dashboard/orders', icon: '📋' },
    { label: 'Customers', href: '/dashboard/customers', icon: '🎯' },
    { label: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
  ],
  purchase: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Suppliers', href: '/dashboard/suppliers', icon: '🏢' },
    { label: 'POs', href: '/dashboard/purchase-orders', icon: '📄' },
    { label: 'Inventory', href: '/dashboard/inventory', icon: '📦' },
    { label: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
  ],
  manufacturing: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Production', href: '/dashboard/production', icon: '⚙️' },
    { label: 'Quality', href: '/dashboard/quality', icon: '✅' },
    { label: 'Equipment', href: '/dashboard/equipment', icon: '🔧' },
    { label: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
  ],
  inventory: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Stock Levels', href: '/dashboard/stock', icon: '📦' },
    { label: 'Warehouses', href: '/dashboard/warehouses', icon: '🏗️' },
    { label: 'Movements', href: '/dashboard/movements', icon: '↔️' },
    { label: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
  ],
  business_owner: [
    { label: 'Executive Dashboard', href: '/dashboard', icon: '👑' },
    { label: 'Business Health', href: '/dashboard/health', icon: '💚' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📊' },
    { label: 'Performance', href: '/dashboard/performance', icon: '⚡' },
    { label: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (!user) return null

  const menuItems = menuConfig[user.role] || menuConfig.admin
  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <motion.div
      className="w-64 bg-card border-r border-border/50 flex flex-col overflow-hidden"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ERP Nexus</h2>
          <p className="text-xs text-muted-foreground">AI Edition</p>
        </div>
        <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-xs text-primary font-semibold">Role: {user.role.replace('_', ' ').toUpperCase()}</p>
          <p className="text-xs text-muted-foreground mt-1">{user.name}</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <motion.button
              className={`w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.label}
            </motion.button>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border/50 space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl">{user.avatar}</div>
          <div className="text-right text-xs">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-muted-foreground">{user.department}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          Logout
        </Button>
      </div>
    </motion.div>
  )
}

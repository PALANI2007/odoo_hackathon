'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export const menuConfig = {
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Sales Overview', href: '/dashboard/sales', icon: '📈' },
    { label: 'Inventory', href: '/dashboard/inventory', icon: '📦' },
    { label: 'Manufacturing', href: '/dashboard/manufacturing', icon: '🏭' },
    { label: 'Procurement', href: '/dashboard/purchase', icon: '💼' },
    { label: 'Analytics', href: '/dashboard/analytics', icon: '📉' },
    { label: 'User Management', href: '/dashboard/users', icon: '👥' },
  ],
  sales: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Leads', href: '/dashboard/leads', icon: '👥' },
    { label: 'Orders', href: '/dashboard/orders', icon: '📋' },
    { label: 'Customers', href: '/dashboard/customers', icon: '🎯' },
  ],
  purchase: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Suppliers', href: '/dashboard/suppliers', icon: '🏢' },
    { label: 'POs', href: '/dashboard/purchase-orders', icon: '📄' },
    { label: 'Inventory', href: '/dashboard/inventory', icon: '📦' },
  ],
  manufacturing: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Production', href: '/dashboard/production', icon: '⚙️' },
    { label: 'Quality', href: '/dashboard/quality', icon: '✅' },
    { label: 'Equipment', href: '/dashboard/equipment', icon: '🔧' },
  ],
  inventory: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Stock Levels', href: '/dashboard/stock', icon: '📦' },
    { label: 'Warehouses', href: '/dashboard/warehouses', icon: '🏗️' },
    { label: 'Movements', href: '/dashboard/movements', icon: '↔️' },
  ],
  business_owner: [
    { label: 'Executive Dashboard', href: '/dashboard', icon: '👑' },
    { label: 'Business Health', href: '/dashboard/health', icon: '💚' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📊' },
    { label: 'Performance', href: '/dashboard/performance', icon: '⚡' },
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
        <div className="p-3.5 bg-muted/50 border border-border/40 rounded-xl space-y-2">
          <div className="flex items-center gap-3">
            <div className="text-2xl shrink-0">{user.avatar}</div>
            <div className="text-left text-xs min-w-0">
              <p className="font-extrabold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-primary font-black uppercase tracking-wider">
                {user.role === 'business_owner' ? 'Owner' : user.role}
              </p>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground border-t border-border/40 pt-1.5 truncate font-medium" title={user.email}>
            {user.email}
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-destructive/10 border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground text-destructive font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-all"
        >
          Logout
        </Button>
      </div>
    </motion.div>
  )
}

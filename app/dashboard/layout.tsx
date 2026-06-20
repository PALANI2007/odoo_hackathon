'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Sidebar, { menuConfig } from '@/components/sidebar'
import { motion } from 'framer-motion'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Check authorization
  const allowedItems = menuConfig[user.role] || []
  const isAuthorized = pathname === '/dashboard' || allowedItems.some(item => item.href === pathname)

  if (!isAuthorized) {
    return (
      <div className="flex h-screen bg-[#030712] text-slate-100 relative overflow-hidden select-none font-sans">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-6 relative">
          {/* Neo glow backgrounds */}
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full bg-slate-900/40 border border-red-500/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
              Access Denied
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Your security clearance level ({user.role.toUpperCase()}) does not authorize access to the resource node <code className="text-red-400 font-extrabold bg-red-950/40 px-2 py-0.5 rounded border border-red-500/10">{pathname}</code>.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Safe Hub
            </motion.button>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

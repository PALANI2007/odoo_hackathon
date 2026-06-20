'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Title */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-foreground mb-2">ERP Nexus AI</h1>
          <p className="text-muted-foreground text-sm">Enterprise Resource Planning Command Core</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-card border border-border/50 rounded-xl p-8 backdrop-blur-xl shadow-2xl"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="w-full bg-background/50 border-border/50 text-foreground placeholder-muted-foreground focus:bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="w-full bg-background/50 border-border/50 text-foreground placeholder-muted-foreground focus:bg-background"
              />
            </div>

            {error && (
              <motion.div
                className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-xs">
            <span className="text-slate-400 mr-1.5">Don't have an account?</span>
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-extrabold transition-all uppercase tracking-wider hover:underline">
              Create Account
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p className="text-center text-xs text-muted-foreground mt-8" variants={itemVariants}>
          AI-Powered Enterprise Resource Planning System Connected to Supabase
        </motion.p>
      </motion.div>
    </div>
  )
}

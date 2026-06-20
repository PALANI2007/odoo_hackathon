'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  User, Mail, Lock, ShieldCheck, CheckCircle2, AlertTriangle, 
  ArrowRight, ShoppingCart, ShoppingBag, Cpu, Layers 
} from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<'sales' | 'purchase' | 'manufacturing' | 'inventory'>('sales')
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const roles = [
    { 
      id: 'sales', 
      title: 'Sales Department', 
      desc: 'Lead pipelines, customers & orders', 
      icon: <ShoppingCart className="w-5 h-5" />, 
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/5' 
    },
    { 
      id: 'purchase', 
      title: 'Procurement', 
      desc: 'Suppliers, purchase orders & vetting', 
      icon: <ShoppingBag className="w-5 h-5" />, 
      color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' 
    },
    { 
      id: 'manufacturing', 
      title: 'Operations / Mfg', 
      desc: 'Production loads, quality & equipment', 
      icon: <Cpu className="w-5 h-5" />, 
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' 
    },
    { 
      id: 'inventory', 
      title: 'Warehouse / Inv', 
      desc: 'Stock counts, heatmaps & movements', 
      icon: <Layers className="w-5 h-5" />, 
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' 
    }
  ]

  const validateForm = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are mandatory.')
      return false
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return false
    }

    // Password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return false
    }

    // Passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return false
    }

    // Check duplicate email
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        setError('This email address is already registered.')
        return false
      }
    } catch (err) {
      console.error('Email check failed:', err)
      setError('Failed to verify email uniqueness. Try again.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    setIsLoading(true)

    // Run validations
    const isValid = await validateForm()
    if (!isValid) {
      setIsLoading(false)
      return
    }

    try {
      // 1. Insert user details into the custom Supabase 'users' table
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          name,
          email,
          password,
          role: selectedRole
        }])

      if (insertError) throw insertError

      // 2. Set success animation state
      setIsSuccess(true)

      // 3. Auto-login session in the background
      await login(email, password)

      // 4. Redirect after animation delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)

    } catch (err) {
      console.error('Registration failed:', err)
      setError(err instanceof Error ? err.message : 'Registration failed. Try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 md:p-8 overflow-hidden relative select-none font-sans">
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      <div className="w-full max-w-4xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: SaaS Taglines & Features */}
        <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 text-left pr-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-purple-400 flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              SaaS Registration Core
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent leading-tight">
              Create Your Security Node
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Register your workspace profile and immediately access Odoo-connected telemetry, charts, and digital twins.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/[0.06] pt-6 text-xs">
            {[
              { title: 'Instant Account Provisioning', desc: 'Secure SQL insertion and fast session allocation.' },
              { title: 'Automatic Authentication Handshake', desc: 'Access your specialized dashboard immediately.' },
              { title: 'Encrypted Credential Cache', desc: 'Protected data layers using Supabase DB backend.' }
            ].map((feat, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 text-purple-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white">{feat.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Registration Card Form */}
        <div className="lg:col-span-7 w-full relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-black text-white uppercase tracking-wider">Register Profile</h2>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Enter credentials to provision your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold">
                  {/* Name & Email Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" /> Full Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-slate-950/60 border-white/10 text-white placeholder-slate-600 focus:border-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-purple-400" /> Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="name@erp.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-slate-950/60 border-white/10 text-white placeholder-slate-600 focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-purple-400" /> Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-slate-950/60 border-white/10 text-white placeholder-slate-600 focus:border-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-purple-400" /> Confirm Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-slate-950/60 border-white/10 text-white placeholder-slate-600 focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  {/* Role Cards Area */}
                  <div>
                    <label className="block text-slate-400 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Select Workspace Department
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => {
                        const isSelected = selectedRole === role.id
                        return (
                          <div
                            key={role.id}
                            onClick={() => !isLoading && setSelectedRole(role.id as any)}
                            className={`p-3 border rounded-xl cursor-pointer text-left transition-all duration-300 ${
                              isSelected 
                                ? `${role.color} scale-[1.02] shadow-lg shadow-black/20` 
                                : 'bg-slate-950/20 border-white/5 hover:border-white/10 hover:bg-slate-950/40 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`p-1 bg-white/[0.02] border border-white/5 rounded-lg ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                {role.icon}
                              </div>
                              <h4 className="font-extrabold text-white text-[11px] leading-none">{role.title}</h4>
                            </div>
                            <p className="text-[9px] text-slate-500 font-semibold leading-tight">{role.desc}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold h-11 uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10 transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating security node...' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="pt-2 border-t border-white/[0.04] text-center text-xs">
                    <span className="text-slate-500 mr-1.5">Already have a credentials node?</span>
                    <Link href="/" className="text-purple-400 hover:text-purple-300 font-extrabold hover:underline">
                      Log In
                    </Link>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center flex flex-col items-center justify-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                  className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </motion.div>
                
                <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                  Account Created Successfully
                </h2>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Provisioning credentials node and syncing security certificates.
                </p>
                <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-bold uppercase">
                  <div className="inline-block w-4 h-4 border-2 border-slate-700 border-t-emerald-400 rounded-full animate-spin" />
                  Redirecting to Dashboard...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ERPNexusScene from '@/components/erp-nexus-scene'


/* ══ Inline icons ══ */
const MailIc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px]">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const LockIc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px]">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const EyeOn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px]">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const ArrowIc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

/* ══ Social button data ══ */
const SOCIAL = [
  { id:'google', label:'Google', icon:(
    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )},
  { id:'microsoft', label:'Microsoft', icon:(
    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24">
      <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022"/><path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00"/>
      <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF"/><path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900"/>
    </svg>
  )},
] as const

/* ══════════════════════════════════════════════════
   MAIN LOGIN PAGE
   ══════════════════════════════════════════════════ */
export default function LoginPage() {
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [rem,     setRem]     = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router    = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { 
      await login(email, pass)
      router.push('/dashboard') 
    }
    catch (err) { 
      setError(err instanceof Error ? err.message : 'Login failed') 
    }
    finally { 
      setLoading(false) 
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
      background: `
        linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px),
        radial-gradient(ellipse at 20% 25%, rgba(99,102,241,0.07) 0%, transparent 45%),
        radial-gradient(ellipse at 80% 75%, rgba(168,85,247,0.06) 0%, transparent 45%),
        #020617`,
      backgroundSize: '60px 60px, 60px 60px, 100% 100%, 100% 100%, 100% 100%',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

      {/* ─── TOAST ERROR NOTIFICATION (Apple Vision Pro spatial style) ─── */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.92 }}
            className="fixed top-6 right-6 z-50 flex items-start gap-3.5 px-4.5 py-3.5 rounded-2xl bg-slate-950/85 border border-red-500/35 text-xs text-red-400 shadow-[0_12px_36px_rgba(239,68,68,0.18),0_0_24px_rgba(0,0,0,0.85)] backdrop-blur-lg max-w-sm"
          >
            <span className="text-base select-none mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-bold text-white leading-tight">Authentication Failed</p>
              <p className="text-slate-400 mt-1 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => setError('')} 
              className="text-slate-500 hover:text-slate-300 transition-colors font-black text-base leading-none select-none ml-1.5 p-0.5"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN SPLIT ─── */}
      <div className="flex flex-1 min-h-0 relative z-10">

        {/* LEFT 65% — Immersive 3D Parallax Scene */}
        <div className="hidden lg:block relative flex-shrink-0" style={{ width:'65%' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-72 h-72 rounded-full" style={{ top:'5%',  left:'15%', background:'rgba(99,102,241,0.04)',  filter:'blur(70px)' }}/>
            <div className="absolute w-56 h-56 rounded-full" style={{ top:'45%', left:'50%', background:'rgba(16,185,129,0.03)',  filter:'blur(60px)' }}/>
            <div className="absolute w-48 h-48 rounded-full" style={{ top:'55%', left:'5%',  background:'rgba(249,115,22,0.03)', filter:'blur(55px)' }}/>
          </div>
          <div className="relative w-full h-full p-2">
            <ERPNexusScene />
          </div>
        </div>

        {/* RIGHT 35% — Login Form Card */}
        <div className="flex w-full lg:w-[35%] items-center justify-center px-8 py-4 relative"
          style={{ borderLeft:'1px solid rgba(99,102,241,0.1)' }}>
          
          {/* Ambient card back-glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
              style={{ background:'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter:'blur(30px)' }}/>
          </div>

          <motion.div className="w-full max-w-[355px] relative"
            initial={{ opacity:0, x:30, y:8 }} animate={{ opacity:1, x:0, y:0 }}
            transition={{ duration:0.75, ease:[0.22,1,0.36,1] }}>

            {/* ── SPATIAL APPLE VISION PRO CARD WITH GLOWING BORDER ── */}
            <div className="relative rounded-[28px] p-[1.5px] overflow-hidden" style={{
              boxShadow: '0 30px 70px rgba(0,0,0,0.85), 0 0 30px rgba(139,92,246,0.1)',
            }}>
              
              {/* Rotating conic border highlight */}
              <motion.div className="absolute -inset-[50%] opacity-65 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 20%, #8b5cf6 38%, #06b6d4 58%, transparent 80%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner Glass Box */}
              <div className="rounded-[27px] p-8 relative overflow-hidden bg-slate-950/75 backdrop-blur-[36px] border border-white/5">
                
                {/* Visual Glass Refraction sweep */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-20 pointer-events-none"
                  style={{ background:'radial-gradient(ellipse, rgba(168,85,247,0.14) 0%, transparent 75%)', filter:'blur(8px)' }}/>

                {/* Card Header */}
                <div className="mb-7 relative">
                  <h2 className="text-[23px] font-black text-white leading-tight tracking-tight">Welcome Back! 👋</h2>
                  <p className="text-xs text-slate-400 mt-2 select-none">
                    Sign in to continue to{' '}
                    <span className="font-semibold text-purple-400">ERP Nexus</span>
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-4.5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 select-none">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10"><MailIc/></span>
                      <input 
                        id="email-input" 
                        type="email" 
                        placeholder="name@enterprise.com"
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        required 
                        disabled={loading} 
                        className="w-full bg-white/3 border border-indigo-500/20 text-white rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-purple-500/80 focus:bg-white/6 focus:shadow-[0_0_16px_rgba(168,85,247,0.14)] placeholder:text-slate-500 caret-purple-500"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 select-none">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10"><LockIc/></span>
                      <input 
                        id="password-input" 
                        type={showPw ? 'text' : 'password'} 
                        placeholder="••••••••"
                        value={pass} 
                        onChange={e => setPass(e.target.value)}
                        required 
                        disabled={loading}
                        className="w-full bg-white/3 border border-indigo-500/20 text-white rounded-xl py-3 pl-11 pr-11 text-sm outline-none transition-all duration-300 focus:border-purple-500/80 focus:bg-white/6 focus:shadow-[0_0_16px_rgba(168,85,247,0.14)] placeholder:text-slate-500 caret-purple-500"
                      />
                      <button 
                        type="button" 
                        id="toggle-pw" 
                        onClick={() => setShowPw(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors z-10 p-0.5"
                      >
                        {showPw ? <EyeOn/> : <EyeOff/>}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <button 
                        type="button" 
                        id="remember-btn" 
                        onClick={() => setRem(r => !r)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 flex-shrink-0 border ${
                          rem 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.45)]' 
                            : 'bg-white/5 border-white/15'
                        }`}
                      >
                        {rem && (
                          <motion.svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" className="w-3 h-3">
                            <motion.polyline 
                              points="20 6 9 17 4 12"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                            />
                          </motion.svg>
                        )}
                      </button>
                      <span className="text-xs text-slate-400">Remember me</span>
                    </label>
                    <button 
                      type="button"
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    id="signin-btn" 
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-black text-[14px] text-white flex items-center justify-center gap-2.5 relative overflow-hidden mt-4"
                    style={{ background:'linear-gradient(135deg, #4f46e5 0%, #7c3aed 45%, #a855f7 100%)', boxShadow:'0 0 20px rgba(99,102,241,0.4)' }}
                    whileHover={{ scale:1.02, boxShadow:'0 0 30px rgba(168,85,247,0.6)' }}
                    whileTap={{ scale:0.98 }}
                  >
                    {/* Sweeping Shimmer Reflection */}
                    <motion.div className="absolute inset-0"
                      style={{ background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)' }}
                      animate={{ x:['-100%','200%'] }}
                      transition={{ duration:2.3, repeat:Infinity, ease:'easeInOut', repeatDelay:1.5 }}/>
                    
                    {loading ? (
                      <><motion.span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}/>
                        Authenticating…</>
                    ) : (
                      <>Sign In <ArrowIc/></>
                    )}
                  </motion.button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center gap-3.5 my-5.5 select-none">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[9px] text-slate-600 uppercase tracking-widest whitespace-nowrap font-bold">OR CONTINUE WITH</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Social Login Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL.map(s => (
                    <motion.button 
                      key={s.id} 
                      type="button" 
                      id={`${s.id}-btn`}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-slate-300 border border-white/5 bg-white/3 hover:border-white/15 transition-all"
                      whileHover={{ scale:1.03, background:'rgba(255,255,255,0.06)' }}
                      whileTap={{ scale:0.97 }}
                    >
                      {s.icon}{s.label}
                    </motion.button>
                  ))}
                </div>

                {/* Create Account Link */}
                <div className="mt-5.5 text-center select-none">
                  <span className="text-xs text-slate-500">New here? </span>
                  <Link 
                    href="/register" 
                    id="create-acct-link"
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Create an account →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  )
}

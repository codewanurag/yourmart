import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login }    = useAuth()
  const { isDark }   = useTheme()
  const navigate     = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none
    ${isDark
      ? `bg-ink3 border text-cream placeholder:text-smoke ${errors[field] ? 'border-blush/50' : 'border-white/[0.07] focus:border-gold/40 focus:shadow-gold'}`
      : `bg-white border text-lt_text placeholder:text-lt_muted ${errors[field] ? 'border-red-300' : 'border-lt_border focus:border-gold/40'}`
    }`

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-ink' : 'bg-lt_bg'}`}>
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: isDark
          ? 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(201,168,76,0.1) 0%, transparent 70%)'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`relative w-full max-w-md rounded-3xl border p-8 shadow-2xl
          ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-3xl font-bold tracking-widest text-gradient-gold uppercase">
              YourMart
            </h1>
          </Link>
          <p className={`mt-2 text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className={`block text-[0.8rem] font-medium mb-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-smoke' : 'text-lt_muted'}`} />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={inputClass('email')}
              />
            </div>
            {errors.email && <p className="text-blush text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-[0.8rem] font-medium mb-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
              Password
            </label>
            <div className="relative">
              <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-smoke' : 'text-lt_muted'}`} />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className={inputClass('password')}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-smoke hover:text-dim' : 'text-lt_muted'}`}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-blush text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Demo credentials hint */}
          <div className={`rounded-xl p-3 border text-xs ${isDark ? 'bg-gold/5 border-gold/15 text-dim' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <p className="font-semibold mb-1">🔑 Demo Account</p>
            <p>Email: <span className="font-mono">demo@yourmart.com</span></p>
            <p>Password: <span className="font-mono">demo123</span></p>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 mt-2">
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              : <> Sign In <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
          Don't have an account?{' '}
          <Link to="/register" className="text-gold hover:text-gold2 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

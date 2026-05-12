import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const { isDark }   = useTheme()
  const navigate     = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name || form.name.trim().length < 2)   e.name     = 'Name must be at least 2 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password || form.password.length < 6)  e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm)              e.confirm  = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (field) =>
    `w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none
    ${isDark
      ? `bg-ink3 border text-cream placeholder:text-smoke ${errors[field] ? 'border-blush/50' : 'border-white/[0.07] focus:border-gold/40'}`
      : `bg-white border text-lt_text placeholder:text-lt_muted ${errors[field] ? 'border-red-300' : 'border-lt_border focus:border-gold/40'}`
    }`

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-ink' : 'bg-lt_bg'}`}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: isDark
          ? 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(201,168,76,0.04) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative w-full max-w-md rounded-3xl border p-8 shadow-2xl
          ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}
      >
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-serif text-3xl font-bold tracking-widest text-gradient-gold uppercase">YourMart</h1>
          </Link>
          <p className={`mt-2 text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { field: 'name',     label: 'Full Name',      icon: User,  type: 'text',     ph: 'Your full name' },
            { field: 'email',    label: 'Email Address',  icon: Mail,  type: 'email',    ph: 'you@example.com' },
            { field: 'password', label: 'Password',       icon: Lock,  type: showPw ? 'text' : 'password', ph: 'Min 6 characters', showToggle: true },
            { field: 'confirm',  label: 'Confirm Password', icon: Lock, type: showPw ? 'text' : 'password', ph: 'Repeat password' },
          ].map(({ field, label, icon: Icon, type, ph, showToggle }) => (
            <div key={field}>
              <label className={`block text-[0.8rem] font-medium mb-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                {label}
              </label>
              <div className="relative">
                <Icon size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-smoke' : 'text-lt_muted'}`} />
                <input type={type} placeholder={ph} value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className={fieldClass(field)} />
                {showToggle && (
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-smoke hover:text-dim' : 'text-lt_muted'}`}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
              </div>
              {errors[field] && <p className="text-blush text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 mt-2">
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Creating account...</>
              : <> Create Account <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold2 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

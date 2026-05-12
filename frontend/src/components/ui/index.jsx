import { Loader2 } from 'lucide-react'

// ─── Button ───────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-gradient-to-r from-gold to-gold2 text-ink hover:opacity-90 active:scale-95 shadow-gold',
    secondary: 'bg-white/[0.05] border border-white/[0.1] text-cream hover:bg-white/[0.08] active:scale-95',
    ghost: 'text-dim hover:text-cream hover:bg-white/[0.04] active:scale-95',
    danger: 'bg-blush/10 border border-blush/30 text-blush hover:bg-blush/20 active:scale-95',
    outline: 'border border-gold/30 text-gold hover:bg-gold hover:text-ink active:scale-95',
  }
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    xl: 'text-base px-8 py-3.5',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}

// ─── Badge ────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gold/10 text-gold border border-gold/20',
    red:     'bg-red-500/10 text-red-400 border border-red-500/20',
    green:   'bg-sage/10 text-sage border border-sage/20',
    blue:    'bg-sky/10 text-sky border border-sky/20',
    live:    'bg-red-500 text-white',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ─── Spinner ──────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-gold ${className}`} />
}

// ─── LoadingState ─────────────────────────────────────────
export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner size={32} />
      <p className="text-dim text-sm">{message}</p>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────
export function EmptyState({ icon = '🛍️', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-5xl">{icon}</span>
      <div>
        <h3 className="text-lg font-semibold text-cream mb-1">{title}</h3>
        <p className="text-dim text-sm max-w-xs">{message}</p>
      </div>
      {action}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[0.8rem] font-medium text-dim">{label}</label>}
      <input
        className={`w-full bg-ink3 border border-white/[0.07] rounded-xl px-4 py-3 text-cream text-sm
          placeholder:text-smoke focus:outline-none focus:border-gold/40 focus:shadow-gold transition-all
          ${error ? 'border-blush/50' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-blush text-xs">{error}</span>}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────
export function Modal({ open, onClose, children, title, className = '' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className={`bg-ink2 border border-white/[0.07] rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-lg animate-slide-up ${className}`}
        onClick={e => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-white/[0.07]">
            <h2 className="font-serif text-xl font-bold text-cream">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-muted hover:text-cream transition-colors">
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

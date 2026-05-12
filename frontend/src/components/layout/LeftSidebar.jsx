import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, ShoppingBag, Radio, Store, ShoppingCart, Heart,
  Package, User, MessageCircle, LayoutDashboard, LogIn, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { MOCK_LIVE_SESSIONS } from '../../utils/mockData'

const MAIN_LINKS = [
  { icon: Home,         label: 'Discover',    path: '/' },
  { icon: ShoppingBag,  label: 'Shop',        path: '/products' },
  { icon: Radio,        label: 'Live',        path: '/live' },
  { icon: Store,        label: 'Sellers',     path: '/sellers' },
]
const USER_LINKS = [
  { icon: ShoppingCart, label: 'My Cart',     path: '/cart' },
  { icon: Heart,        label: 'Wishlist',    path: '/wishlist' },
  { icon: Package,      label: 'Orders',      path: '/orders' },
  { icon: MessageCircle,label: 'Messages',    path: '/messages' },
  { icon: User,         label: 'Profile',     path: '/profile' },
]

export default function LeftSidebar({ onClose }) {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.85rem] font-normal tracking-wide transition-all duration-150 cursor-pointer relative
    ${isActive
      ? isDark
        ? 'bg-gold/10 text-gold2 border border-gold/20 before:absolute before:left-0 before:top-[25%] before:h-[50%] before:w-0.5 before:rounded-sm before:bg-gold'
        : 'bg-gold/10 text-gold border border-gold/20'
      : isDark
        ? 'text-dim hover:bg-white/[0.06] hover:text-cream'
        : 'text-lt_muted hover:bg-black/[0.04] hover:text-lt_text'
    }`

  return (
    <div className="flex flex-col gap-7 p-3 h-full">
      {/* Close on mobile */}
      {onClose && (
        <button onClick={onClose} className="self-end lg:hidden p-1 opacity-50 hover:opacity-100">
          <X size={18} />
        </button>
      )}

      {/* Main nav */}
      <div>
        <div className={`text-[0.62rem] font-semibold tracking-[0.2em] uppercase px-3 mb-2
          ${isDark ? 'text-smoke' : 'text-lt_muted'}`}>Navigate</div>
        <nav className="flex flex-col gap-0.5">
          {MAIN_LINKS.map(({ icon: Icon, label, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={linkClass} onClick={onClose}>
              <Icon size={16} className="opacity-80" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User links */}
      {user && (
        <div>
          <div className={`text-[0.62rem] font-semibold tracking-[0.2em] uppercase px-3 mb-2
            ${isDark ? 'text-smoke' : 'text-lt_muted'}`}>My Account</div>
          <nav className="flex flex-col gap-0.5">
            {USER_LINKS.map(({ icon: Icon, label, path }) => (
              <NavLink key={path} to={path} className={linkClass} onClick={onClose}>
                <Icon size={16} className="opacity-80" />
                {label}
                {label === 'My Cart' && cartCount > 0 && (
                  <span className="ml-auto bg-blush text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            ))}
            {user.isSeller && (
              <NavLink to="/seller/dashboard" className={linkClass} onClick={onClose}>
                <LayoutDashboard size={16} className="opacity-80" />
                Seller Dashboard
              </NavLink>
            )}
          </nav>
        </div>
      )}

      {/* Live sessions */}
      <div>
        <div className={`text-[0.62rem] font-semibold tracking-[0.2em] uppercase px-3 mb-2
          ${isDark ? 'text-smoke' : 'text-lt_muted'}`}>🔴 Live Now</div>
        <div className="flex flex-col gap-1.5">
          {MOCK_LIVE_SESSIONS.slice(0, 3).map(session => (
            <button key={session._id} onClick={() => { navigate('/live'); onClose?.() }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all
                ${isDark ? 'bg-red-900/10 border border-red-800/20 hover:bg-red-900/15'
                         : 'bg-red-50 border border-red-200/50 hover:bg-red-100/50'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot flex-shrink-0" />
              <span className="text-[0.78rem] font-semibold text-red-400 flex-1 truncate">
                {session.seller.sellerInfo.storeName}
              </span>
              <span className={`text-[0.68rem] font-mono ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                {(session.viewers / 1000).toFixed(1)}k
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Login prompt if not logged in */}
      {!user && (
        <div className={`mt-auto rounded-2xl p-3 border text-center
          ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            Sign in for a personalized shopping experience
          </p>
          <button onClick={() => navigate('/login')}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-xs font-semibold flex items-center justify-center gap-1.5">
            <LogIn size={13} /> Login / Register
          </button>
        </div>
      )}
    </div>
  )
}

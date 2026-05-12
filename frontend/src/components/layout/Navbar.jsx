import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Bell, Sun, Moon, Menu, Search, MessageCircle, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Discover', path: '/' },
  { label: 'Shop',     path: '/products' },
  { label: 'Live',     path: '/live' },
  { label: 'Sellers',  path: '/sellers' },
]

export default function Navbar({ onCartOpen, onMenuToggle }) {
  const { user, logout } = useAuth()
  const { cartCount }    = useCart()
  const { isDark, toggleTheme } = useTheme()
  const location   = useLocation()
  const navigate   = useNavigate()
  const [showUser, setShowUser] = useState(false)

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'YM'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[800] h-[60px] flex items-center justify-between px-4 lg:px-7
      ${isDark
        ? 'bg-[rgba(10,9,8,0.92)] border-b border-white/[0.07]'
        : 'bg-[rgba(245,240,232,0.92)] border-b border-lt_border'}
      backdrop-blur-[32px]`}>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg opacity-60 hover:opacity-100">
          <Menu size={18} />
        </button>
        <Link to="/" className="font-serif text-xl font-bold tracking-widest text-gold2 hover:text-gold3 transition-colors uppercase">
          Your<span className={isDark ? 'text-muted' : 'text-lt_muted'}>Mart</span>
        </Link>
      </div>

      {/* Center nav pills — desktop */}
      <div className={`hidden md:flex items-center gap-[1px] rounded-full px-[3px] py-[3px] relative
        ${isDark ? 'bg-ink3 border border-white/[0.07]' : 'bg-white border border-lt_border'}`}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative px-4 py-[6px] rounded-full text-[0.8rem] font-medium tracking-wide transition-all duration-200 whitespace-nowrap
              ${isActive(link.path)
                ? 'bg-gradient-to-r from-gold to-gold2 text-ink font-semibold'
                : isDark ? 'text-muted hover:text-cream' : 'text-lt_muted hover:text-lt_text'
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => navigate('/products')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
            ${isDark ? 'bg-ink3 border border-white/[0.07] text-dim hover:text-gold2 hover:border-gold/30'
                     : 'bg-white border border-lt_border text-lt_muted hover:text-gold'}`}>
          <Search size={16} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
            ${isDark ? 'bg-ink3 border border-white/[0.07] text-dim hover:text-gold2 hover:border-gold/30'
                     : 'bg-white border border-lt_border text-lt_muted hover:text-gold'}`}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Cart */}
        <button
          onClick={onCartOpen}
          className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all
            ${isDark ? 'bg-ink3 border border-white/[0.07] text-dim hover:text-gold2 hover:border-gold/30'
                     : 'bg-white border border-lt_border text-lt_muted hover:text-gold'}`}>
          <ShoppingCart size={16} />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blush border-2 border-ink text-[0.55rem] font-bold text-white flex items-center justify-center">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        {/* Messages */}
        {user && (
          <button
            onClick={() => navigate('/messages')}
            className={`hidden sm:flex w-9 h-9 rounded-full items-center justify-center transition-all
              ${isDark ? 'bg-ink3 border border-white/[0.07] text-dim hover:text-gold2 hover:border-gold/30'
                       : 'bg-white border border-lt_border text-lt_muted hover:text-gold'}`}>
            <MessageCircle size={16} />
          </button>
        )}

        {/* Avatar / Login */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUser(v => !v)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-xs font-bold border-2 border-gold hover:scale-105 transition-transform shadow-gold">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                : initials}
            </button>

            {showUser && (
              <div
                className={`absolute right-0 top-11 w-52 rounded-2xl shadow-2xl border py-2 z-50
                  ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-white border-lt_border'}`}
                onMouseLeave={() => setShowUser(false)}>
                <div className={`px-4 py-2 text-xs border-b mb-1 ${isDark ? 'text-muted border-white/[0.07]' : 'text-lt_muted border-lt_border'}`}>
                  <div className="font-semibold text-sm text-cream dark:text-cream">{user.name}</div>
                  <div>{user.email}</div>
                </div>
                {[
                  { label: 'My Profile',  path: '/profile' },
                  { label: 'My Orders',   path: '/orders' },
                  { label: 'Wishlist',    path: '/wishlist' },
                  ...(user.isSeller ? [{ label: 'Seller Dashboard', path: '/seller/dashboard' }] : []),
                ].map(item => (
                  <button key={item.path} onClick={() => { navigate(item.path); setShowUser(false) }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors
                      ${isDark ? 'text-dim hover:text-cream hover:bg-white/[0.04]'
                               : 'text-lt_muted hover:text-lt_text hover:bg-gray-50'}`}>
                    {item.label}
                  </button>
                ))}
                <div className={`border-t mt-1 pt-1 ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
                  <button onClick={() => { logout(); setShowUser(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-blush hover:bg-blush/10 transition-colors">
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login"
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

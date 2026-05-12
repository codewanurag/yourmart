import { NavLink, useNavigate } from 'react-router-dom'
import { Home, ShoppingBag, Radio, ShoppingCart, User } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'

const LINKS = [
  { icon: Home,        label: 'Home',    path: '/',         end: true },
  { icon: ShoppingBag, label: 'Shop',    path: '/products' },
  { icon: Radio,       label: 'Live',    path: '/live' },
  { icon: User,        label: 'Profile', path: '/profile' },
]

export default function MobileNav({ onCartOpen }) {
  const { isDark } = useTheme()
  const { cartCount } = useCart()

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-[700] flex md:hidden h-16 items-center justify-around px-2
      ${isDark
        ? 'bg-[rgba(10,9,8,0.96)] border-t border-white/[0.07]'
        : 'bg-[rgba(245,240,232,0.96)] border-t border-lt_border'}
      backdrop-blur-xl`}>
      {LINKS.map(({ icon: Icon, label, path, end }) => (
        <NavLink key={path} to={path} end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all
            ${isActive ? 'text-gold2' : isDark ? 'text-muted' : 'text-lt_muted'}`
          }>
          {({ isActive }) => (
            <>
              <Icon size={18} className={isActive ? 'text-gold2' : ''} />
              <span className="text-[0.6rem] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Cart tab */}
      <button onClick={onCartOpen}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative
          ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
        <ShoppingCart size={18} />
        {cartCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-blush text-[0.5rem] font-bold text-white flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span className="text-[0.6rem] font-medium">Cart</span>
      </button>
    </nav>
  )
}

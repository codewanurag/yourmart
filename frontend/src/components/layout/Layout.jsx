import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import MobileNav from './MobileNav'
import CartDrawer from '../cart/CartDrawer'
import { useTheme } from '../../context/ThemeContext'

export default function Layout() {
  const { isDark } = useTheme()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={isDark ? 'dark' : 'light'}>
      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `radial-gradient(ellipse 60% 40% at 15% 20%, rgba(201,168,76,0.04) 0%, transparent 60%),
                 radial-gradient(ellipse 50% 50% at 85% 80%, rgba(224,92,42,0.03) 0%, transparent 60%)`
              : `radial-gradient(ellipse 60% 40% at 15% 20%, rgba(201,168,76,0.08) 0%, transparent 60%)`,
          }}
        />
      </div>

      <Navbar onCartOpen={() => setCartOpen(true)} onMenuToggle={() => setMobileMenuOpen(v => !v)} />

      <div className="flex min-h-screen pt-[60px] relative z-10">
        {/* Left Sidebar — hidden on mobile */}
        <aside className={`hidden lg:block w-[220px] flex-shrink-0 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto
          ${isDark ? 'bg-ink border-r border-white/[0.07]' : 'bg-lt_surface border-r border-lt_border'}`}>
          <LeftSidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className={`w-[260px] h-full overflow-y-auto p-4 ${isDark ? 'bg-ink' : 'bg-lt_surface'}`}
              onClick={e => e.stopPropagation()}
            >
              <LeftSidebar onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className={`flex-1 min-w-0 overflow-y-auto h-[calc(100vh-60px)]
          ${isDark ? '' : 'bg-lt_bg'}`}>
          <div className="p-4 lg:p-7 animate-slide-up">
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar — hidden on mobile/tablet */}
        <aside className={`hidden xl:block w-[280px] flex-shrink-0 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto
          ${isDark ? 'bg-ink border-l border-white/[0.07]' : 'bg-lt_surface border-l border-lt_border'}`}>
          <RightSidebar />
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav onCartOpen={() => setCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

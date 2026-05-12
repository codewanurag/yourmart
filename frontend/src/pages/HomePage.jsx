import NearbySellers from '../components/NearbySellers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Zap, ArrowRight, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import ProductCard from '../components/product/ProductCard'
import LiveModal from '../components/live/LiveModal'
import { MOCK_PRODUCTS, MOCK_LIVE_SESSIONS, MOCK_SELLERS } from '../utils/mockData'

const CATEGORIES = ['All', 'Fashion', 'Beauty', 'Home Decor', 'Jewellery', 'Food', 'Art']

const STORIES = [
  { name: 'Add Story', isAdd: true },
  ...MOCK_SELLERS.map(s => ({ name: s.sellerInfo.storeName.split(' ')[0], seller: s, isLive: true })),
  { name: 'Rajwadi', color: '#C9A84C' },
  { name: 'TeaTime', color: '#4A8C6F' },
  { name: 'Veda', color: '#3A7FB5' },
  { name: 'JaipurPots', color: '#C94B6A' },
]

export default function HomePage() {
  const { isDark } = useTheme()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLive, setActiveLive] = useState(null)
  const [activeTab, setActiveTab] = useState('forYou')

  const filtered =
    activeCategory === 'All'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeCategory)

  const heroSession = MOCK_LIVE_SESSIONS[0]

  return (
    <div className="animate-slide-up max-w-3xl mx-auto xl:max-w-none">

      {/* ── Feed tabs ─────────────────────────────────── */}
      <div
        className={`flex gap-0 mb-6 border-b ${
          isDark ? 'border-white/[0.07]' : 'border-lt_border'
        }`}
      >
        {['forYou', 'trending', 'newArrivals', 'following'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-[0.83rem] font-medium tracking-wide relative transition-colors whitespace-nowrap
              ${
                activeTab === tab
                  ? isDark
                    ? 'text-cream after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-gold after:to-gold2'
                    : 'text-lt_text after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-gold after:to-gold2'
                  : isDark
                  ? 'text-muted hover:text-cream'
                  : 'text-lt_muted hover:text-lt_text'
              }`}
          >
            {{
              forYou: 'For You',
              trending: 'Trending',
              newArrivals: 'New Arrivals',
              following: 'Following',
            }[tab]}
          </button>
        ))}
      </div>

      {/* ── Stories row ───────────────────────────────── */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {STORIES.map((story, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
            onClick={() => story.isLive && setActiveLive(MOCK_LIVE_SESSIONS[0])}
          >
            <div
              className={`w-14 h-14 rounded-full p-[2px] transition-transform hover:scale-105
              ${
                story.isAdd
                  ? isDark
                    ? 'border-2 border-dashed border-smoke'
                    : 'border-2 border-dashed border-lt_border'
                  : story.isLive
                  ? 'ring-spin'
                  : ''
              }`}
              style={
                !story.isAdd && !story.isLive
                  ? {
                      background:
                        'conic-gradient(#C9A84C 0%, #E8C96A 40%, #E05C2A 70%, #C9A84C 100%)',
                      padding: '2px',
                    }
                  : story.isLive
                  ? {
                      background:
                        'conic-gradient(#E05050 0%, #FF8080 50%, #E05050 100%)',
                      padding: '2px',
                      borderRadius: '50%',
                    }
                  : {}
              }
            >
              <div
                className={`w-full h-full rounded-full flex items-center justify-center text-base font-bold border-2
                ${isDark ? 'bg-ink3 border-ink' : 'bg-lt_bg border-lt_bg'}`}
                style={
                  story.color
                    ? { background: story.color + '22', color: story.color }
                    : {}
                }
              >
                {story.isAdd
                  ? '+'
                  : story.seller
                  ? story.seller.avatar
                    ? (
                      <img
                        src={story.seller.avatar}
                        className="w-full h-full rounded-full object-cover"
                        alt={story.name}
                      />
                    )
                    : story.name[0]
                  : story.name[0]}
              </div>
            </div>

            <span
              className={`text-[0.65rem] w-14 text-center truncate ${
                isDark ? 'text-muted' : 'text-lt_muted'
              }`}
            >
              {story.isAdd ? 'Add' : story.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── Hero live banner ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-3xl overflow-hidden mb-6 cursor-pointer border transition-all duration-300 group
          ${
            isDark
              ? 'bg-gradient-to-r from-[#0E0A06] via-[#1A1008] to-[#0E0A06] border-gold/20 hover:border-gold/40 hover:shadow-2xl hover:-translate-y-1'
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-gold/20 hover:border-gold/40 hover:shadow-xl hover:-translate-y-1'
          }`}
        onClick={() => setActiveLive(heroSession)}
      >
        <div className="flex items-stretch relative">

          <div className="w-40 sm:w-52 flex-shrink-0 relative overflow-hidden min-h-[140px] sm:min-h-[160px]">
            <img
              src={heroSession.thumbnail}
              alt={heroSession.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-red-500/40 rounded px-2 py-1 text-[0.6rem] font-bold text-red-400 tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
              LIVE
            </div>
          </div>

          <div className="flex-1 p-5 flex flex-col justify-center">
            <div className="text-[0.65rem] font-bold text-gold tracking-[0.2em] uppercase mb-2">
              ✦ Featured Live Session
            </div>

            <h2
              className={`font-serif text-base sm:text-lg font-bold leading-tight mb-3 ${
                isDark ? 'text-parchment' : 'text-lt_text'
              }`}
            >
              {heroSession.title}
            </h2>

            <div className="flex gap-4 flex-wrap mb-4">
              <span
                className={`text-xs flex items-center gap-1 ${
                  isDark ? 'text-dim' : 'text-lt_muted'
                }`}
              >
                <span className="text-red-400">●</span>
                {heroSession.viewers.toLocaleString()} watching
              </span>

              <span
                className={`text-xs flex items-center gap-1 ${
                  isDark ? 'text-dim' : 'text-lt_muted'
                }`}
              >
                🏪 {heroSession.seller.sellerInfo.storeName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-xs font-bold">
                <Play size={12} fill="currentColor" />
                Join Live
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Nearby Sellers ───────────────────────────── */}
      <NearbySellers />

      {/* ── Category filter ───────────────────────────── */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all border
              ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-gold to-gold2 text-ink border-transparent'
                  : isDark
                  ? 'bg-transparent border-white/[0.1] text-muted hover:text-cream hover:border-gold/30'
                  : 'bg-transparent border-lt_border text-lt_muted hover:text-lt_text hover:border-gold/30'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Products ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filtered.map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>

      {/* ── Live Sessions ───────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 live-dot" />

            <h2
              className={`font-serif text-lg font-bold ${
                isDark ? 'text-cream' : 'text-lt_text'
              }`}
            >
              Live Sessions
            </h2>
          </div>

          <button
            onClick={() => navigate('/live')}
            className="flex items-center gap-1 text-gold text-sm font-medium hover:gap-2 transition-all"
          >
            See all
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_LIVE_SESSIONS.map((session, i) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl overflow-hidden border cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-xl
                ${
                  isDark
                    ? 'border-gold/15 hover:border-gold/30'
                    : 'border-lt_border hover:border-gold/30'
                }`}
              onClick={() => setActiveLive(session)}
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={session.thumbnail}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Live modal ───────────────────────── */}
      {activeLive && (
        <LiveModal
          session={activeLive}
          onClose={() => setActiveLive(null)}
        />
      )}
    </div>
  )
}
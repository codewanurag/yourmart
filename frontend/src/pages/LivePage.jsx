import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Radio, Filter } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { MOCK_LIVE_SESSIONS } from '../utils/mockData'
import LiveModal from '../components/live/LiveModal'

const CATEGORIES = ['All', 'Fashion', 'Beauty', 'Home Decor', 'Food', 'Jewellery', 'Art']

export default function LivePage() {
  const { isDark } = useTheme()
  const [activeLive, setActiveLive]     = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [liveViewers, setLiveViewers]   = useState(
    MOCK_LIVE_SESSIONS.map(s => s.viewers)
  )

  // Simulate viewer counts fluctuating
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev =>
        prev.map(v => Math.max(100, v + Math.floor(Math.random() * 30) - 10))
      )
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const filtered = activeCategory === 'All'
    ? MOCK_LIVE_SESSIONS
    : MOCK_LIVE_SESSIONS.filter(s => s.category === activeCategory)

  const totalViewers = liveViewers.reduce((a, b) => a + b, 0)

  return (
    <div className="animate-slide-up max-w-3xl mx-auto xl:max-w-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 live-dot" />
            <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
              Live Sessions
            </h1>
          </div>
          <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            {MOCK_LIVE_SESSIONS.length} sessions live ·{' '}
            <span className="text-gold font-medium">{totalViewers.toLocaleString()} watching now</span>
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex gap-3">
          {[
            { label: 'Live Now',    value: MOCK_LIVE_SESSIONS.length, color: 'text-red-400' },
            { label: 'Viewers',     value: `${(totalViewers / 1000).toFixed(1)}k`, color: 'text-gold' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl border px-4 py-2.5 text-center ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
              <div className={`font-serif text-xl font-bold ${color}`}>{value}</div>
              <div className={`text-[0.65rem] font-medium ${isDark ? 'text-muted' : 'text-lt_muted'}`}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border
              ${activeCategory === cat
                ? 'bg-gradient-to-r from-gold to-gold2 text-ink border-transparent'
                : isDark ? 'border-white/[0.1] text-muted hover:text-cream hover:border-gold/30' : 'border-lt_border text-lt_muted hover:border-gold/30'
              }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured / Hero session */}
      {filtered[0] && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl overflow-hidden border mb-6 cursor-pointer group transition-all hover:shadow-2xl hover:-translate-y-0.5
            ${isDark ? 'border-gold/20 hover:border-gold/40' : 'border-lt_border hover:border-gold/30'}`}
          onClick={() => setActiveLive(filtered[0])}
        >
          <div className="relative h-52 sm:h-64 overflow-hidden">
            <video
              src="C:\Users\anjan\OneDrive\Desktop\WhatsApp Video 2026-05-13 at 12.35.09 AM.mp4"
              autoPlay muted loop playsInline
              poster={filtered[0].thumbnail}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* LIVE badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[0.7rem] font-bold text-white tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" /> LIVE
            </div>

            {/* Viewer count */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 text-[0.72rem] text-dim font-mono">
              <Users size={12} /> {liveViewers[0]?.toLocaleString()}
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Play size={28} className="text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <h2 className="text-parchment font-serif font-bold text-lg leading-tight mb-1">
                  {filtered[0].title}
                </h2>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-xs font-bold border border-gold">
                    {filtered[0].seller?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-parchment text-xs font-semibold leading-tight">{filtered[0].seller?.sellerInfo?.storeName}</p>
                    <p className="text-muted text-[0.65rem]">{filtered[0].seller?.sellerInfo?.storeTag}</p>
                  </div>
                </div>
              </div>

              {/* Featured products preview */}
              <div className="flex -space-x-2">
                {filtered[0].products?.slice(0, 3).map((p, i) => (
                  <img key={i} src={p.images?.[0]} alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover border-2 border-black/40"
                    onError={e => { e.target.src = 'https://via.placeholder.com/40' }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Session grid */}
      {filtered.length > 1 && (
        <>
          <h2 className={`font-serif text-lg font-bold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            More Live Sessions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filtered.slice(1).map((session, i) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl overflow-hidden border cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-xl
                  ${isDark ? 'border-white/[0.07] hover:border-gold/25' : 'border-lt_border hover:border-gold/25'}`}
                onClick={() => setActiveLive(session)}
              >
                {/* Video thumbnail */}
                <div className="relative h-36 overflow-hidden bg-ink3">
                  <img src={session.thumbnail} alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-red-600/90 rounded px-2 py-1 text-[0.6rem] font-bold text-white tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-white live-dot" /> LIVE
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-black/60 rounded px-2 py-1 text-[0.68rem] font-mono text-dim flex items-center gap-1">
                    <Users size={9} /> {liveViewers[i + 1]?.toLocaleString() || session.viewers.toLocaleString()}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-parchment text-xs font-semibold line-clamp-1">{session.title}</p>
                  </div>
                </div>

                {/* Info */}
                <div className={`p-3 ${isDark ? 'bg-ink2' : 'bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-xs font-bold flex-shrink-0">
                      {session.seller?.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                        {session.seller?.sellerInfo?.storeName}
                      </p>
                      <p className={`text-[0.65rem] truncate ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                        {session.category}
                      </p>
                    </div>
                    <span className={`text-[0.62rem] px-2 py-0.5 rounded-full font-semibold flex-shrink-0
                      ${isDark ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-500'}`}>
                      ● LIVE
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <Radio size={40} className="text-muted" />
          <h3 className={`font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>No live sessions in this category</h3>
          <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Check back later or explore other categories</p>
          <button onClick={() => setActiveCategory('All')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold">
            View All Sessions
          </button>
        </div>
      )}

      {/* Live modal */}
      {activeLive && <LiveModal session={activeLive} onClose={() => setActiveLive(null)} />}
    </div>
  )
}

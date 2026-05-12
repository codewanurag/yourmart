import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { MOCK_LIVE_SESSIONS, MOCK_PRODUCTS } from '../../utils/mockData'
import { useState, useEffect } from 'react'
import { ShoppingCart, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RightSidebar() {
  const { isDark } = useTheme()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [viewers, setViewers] = useState(2847)
  const [chatMsgs, setChatMsgs] = useState([
    { user: 'Priya', text: 'Amazing quality! 😍', color: '#C9B070' },
    { user: 'Rahul', text: 'Is size M available?', color: '#70B0A0' },
    { user: 'Meena', text: '🔥🔥 Love this!', color: '#C09050' },
  ])

  const CHAT_NAMES = ['Ananya', 'Vikram', 'Sunita', 'Rohan', 'Divya', 'Karan']
  const CHAT_MSGS  = ['Quality looks amazing!', 'Ordering now 🎉', '😍 So pretty', 'Fast delivery?', 'COD available?', '🔥🔥🔥']
  const COLORS     = ['#C9B070', '#70B0A0', '#C09050', '#9080C0', '#B07080']

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => Math.max(v + Math.floor(Math.random() * 7) - 2, 2000))
      const nm = CHAT_NAMES[Math.floor(Math.random() * CHAT_NAMES.length)]
      const txt = CHAT_MSGS[Math.floor(Math.random() * CHAT_MSGS.length)]
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      setChatMsgs(prev => [...prev.slice(-6), { user: nm, text: txt, color }])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const session = MOCK_LIVE_SESSIONS[0]
  const trending = MOCK_PRODUCTS.slice(0, 4)

  return (
    <div className="flex flex-col gap-3.5 p-3.5 h-full">
      {/* Live preview panel */}
      <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-gold/15' : 'border-lt_border'}`}>
        {/* Video preview */}
        <div
          className="relative h-40 cursor-pointer group overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #100C06, #1C1408)' }}
          onClick={() => navigate('/live')}
        >
          <img src={session.thumbnail} alt={session.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" />

          {/* Live badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-red-500/40 rounded px-2 py-1 text-[0.6rem] font-semibold text-red-400 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
            LIVE
          </div>

          {/* Viewer count */}
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded px-2 py-1 text-[0.68rem] font-mono text-dim">
            👁 {viewers.toLocaleString()}
          </div>

          {/* Seller strip */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-[0.6rem] font-bold border border-gold flex-shrink-0">
              {session.seller.name[0]}
            </div>
            <div>
              <div className="text-[0.76rem] font-semibold text-parchment leading-tight">
                {session.seller.sellerInfo.storeName}
              </div>
              <div className="text-[0.65rem] text-muted">{session.seller.sellerInfo.storeTag}</div>
            </div>
          </div>
        </div>

        {/* Session products */}
        <div className={`p-3 ${isDark ? 'bg-ink2' : 'bg-white'}`}>
          {session.products?.slice(0, 1).map(product => (
            <div key={product._id}
              className={`flex items-center gap-2.5 rounded-xl p-2.5 mb-2.5 border cursor-pointer transition-all
                ${isDark ? 'bg-ink3 border-gold/15 hover:border-gold/30' : 'bg-gray-50 border-lt_border hover:border-gold/30'}`}
              onClick={() => navigate(`/products/${product._id}`)}>
              <img src={product.images[0]} alt={product.name}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className={`text-[0.78rem] font-semibold truncate ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                  {product.name}
                </div>
                <div className="text-[0.82rem] font-semibold text-gold2 font-serif">
                  ₹{product.price.toLocaleString()}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); addToCart(product) }}
                className="ml-auto px-2.5 py-1 rounded-lg bg-gradient-to-r from-gold to-gold2 text-ink text-[0.7rem] font-bold hover:scale-105 transition-transform flex-shrink-0">
                Buy
              </button>
            </div>
          ))}

          {/* Live chat preview */}
          <div className="flex flex-col gap-1.5 mb-2.5 h-20 overflow-hidden">
            {chatMsgs.slice(-3).map((msg, i) => (
              <div key={i} className="flex gap-1.5 items-start animate-fade-in">
                <span className="text-[0.68rem] font-semibold flex-shrink-0" style={{ color: msg.color }}>
                  {msg.user}:
                </span>
                <span className={`text-[0.68rem] leading-tight ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/live')}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-[0.75rem] font-bold tracking-wide hover:opacity-90 transition-opacity">
            Join Live Session →
          </button>
        </div>
      </div>

      {/* Trending products */}
      <div className={`rounded-2xl p-3.5 border ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-gold" />
          <span className={`text-[0.78rem] font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Trending Now</span>
        </div>
        <div className="flex flex-col gap-2">
          {trending.map((product, idx) => (
            <div key={product._id}
              className={`flex items-center gap-2.5 cursor-pointer group py-1.5`}
              onClick={() => navigate(`/products/${product._id}`)}>
              <span className={`text-[0.65rem] font-mono font-bold w-4 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <img src={product.images[0]} alt={product.name}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className={`text-[0.76rem] font-medium truncate group-hover:text-gold transition-colors
                  ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                  {product.name}
                </div>
                <div className="text-[0.7rem] font-semibold text-gold2">₹{product.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

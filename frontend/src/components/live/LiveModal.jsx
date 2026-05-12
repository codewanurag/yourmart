import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ShoppingCart, Users, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { CHAT_NAMES, CHAT_MSGS } from '../../utils/mockData'

export default function LiveModal({ session, onClose }) {
  const { addToCart } = useCart()
  const { isDark }    = useTheme()
  const { user }      = useAuth()
  const chatRef       = useRef(null)
  const [chatInput, setChatInput]   = useState('')
  const [viewers, setViewers]       = useState(session?.viewers || 1200)
  const [messages, setMessages]     = useState([
    { user: 'Priya',  text: 'Amazing collection! 😍', color: '#C9B070' },
    { user: 'Rahul',  text: 'Is COD available?',       color: '#70B0A0' },
    { user: 'Meena',  text: '🔥🔥🔥',                   color: '#C09050' },
    { user: 'Vikram', text: 'Just ordered! Thank you', color: '#9080C0' },
  ])
  const COLORS = ['#C9B070', '#70B0A0', '#C09050', '#9080C0', '#B07080']

  useEffect(() => {
    const interval = setInterval(() => {
      const nm    = CHAT_NAMES[Math.floor(Math.random() * CHAT_NAMES.length)]
      const txt   = CHAT_MSGS[Math.floor(Math.random() * CHAT_MSGS.length)]
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      setMessages(prev => [...prev.slice(-20), { user: nm, text: txt, color }])
      setViewers(v => Math.max(v + Math.floor(Math.random() * 7) - 2, 500))
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const sendMsg = () => {
    if (!chatInput.trim()) return
    const initials = user?.name?.slice(0, 2).toUpperCase() || 'You'
    setMessages(prev => [...prev, { user: initials, text: chatInput.trim(), color: '#E8C96A', isMe: true }])
    setChatInput('')
  }

  if (!session) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[950] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-3xl bg-ink2 rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Video side */}
          <div className="relative md:w-[55%] bg-black flex-shrink-0 min-h-[260px] md:min-h-0">
            <video
              src={session.videoUrl}
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
              poster={session.thumbnail}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-red-500/40 rounded-lg px-2.5 py-1.5 text-[0.65rem] font-bold text-red-400 tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
                LIVE
              </div>
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5 text-[0.7rem] text-dim font-mono">
                <Users size={11} /> {viewers.toLocaleString()}
              </div>
            </div>

            {/* Seller info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-sm font-bold border-2 border-gold flex-shrink-0">
                  {session.seller?.name?.[0] || 'S'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-parchment leading-tight">
                    {session.seller?.sellerInfo?.storeName || 'YourMart Seller'}
                  </div>
                  <div className="text-[0.68rem] text-muted">
                    {session.seller?.sellerInfo?.storeTag} · ★ {session.seller?.sellerInfo?.rating}
                  </div>
                </div>
              </div>
              <h3 className="text-parchment font-serif font-bold text-base leading-tight mb-1">{session.title}</h3>
              <p className="text-dim text-xs">{session.category} · Limited Stock Available</p>
            </div>

            {/* Close button */}
            <button onClick={onClose}
              className="absolute top-3 right-14 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Chat + products side */}
          <div className="flex-1 flex flex-col max-h-[50vh] md:max-h-full overflow-hidden">
            {/* Featured products */}
            <div className={`p-3 border-b border-white/[0.07] flex-shrink-0`}>
              <p className="text-[0.68rem] font-semibold text-muted tracking-widest uppercase mb-2">Featured Products</p>
              <div className="flex flex-col gap-2">
                {session.products?.slice(0, 2).map(product => (
                  <div key={product._id}
                    className="flex items-center gap-2.5 bg-ink3 rounded-xl border border-gold/15 p-2.5">
                    <img src={product.images?.[0]} alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.76rem] font-semibold text-cream truncate">{product.name}</div>
                      <div className="text-gold2 font-serif text-sm font-bold">₹{product.price?.toLocaleString()}</div>
                    </div>
                    <button onClick={() => addToCart(product)}
                      className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-gold to-gold2 text-ink text-[0.7rem] font-bold flex-shrink-0 flex items-center gap-1 hover:scale-105 transition-transform">
                      <ShoppingCart size={11} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: msg.color, color: '#0A0908' }}>
                    {msg.user[0]}
                  </div>
                  <div>
                    <span className="text-[0.68rem] font-semibold mr-1.5" style={{ color: msg.color }}>
                      {msg.user}
                    </span>
                    <span className="text-[0.72rem] text-dim">{msg.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reaction row */}
            <div className="px-3 py-1.5 flex gap-2">
              {['🔥', '❤️', '😍', '👏', '💸'].map(em => (
                <button key={em} onClick={() => setMessages(prev => [...prev, { user: 'You', text: em, color: '#E8C96A', isMe: true }])}
                  className="text-lg hover:scale-125 transition-transform">
                  {em}
                </button>
              ))}
            </div>

            {/* Chat input */}
            <div className={`p-3 border-t border-white/[0.07] flex gap-2`}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMsg()}
                placeholder="Say something..."
                className="flex-1 bg-ink3 border border-white/[0.07] rounded-xl px-3 py-2 text-cream text-xs placeholder:text-smoke focus:outline-none focus:border-gold/40 transition-colors"
              />
              <button onClick={sendMsg}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-gold to-gold2 flex items-center justify-center text-ink hover:opacity-90 transition-opacity">
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

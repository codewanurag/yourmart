import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Search, ArrowLeft, MessageCircle, MoreVertical } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'
import toast from 'react-hot-toast'

// Demo conversations for showcase
const DEMO_CONVERSATIONS = [
  {
    _id: 'conv1',
    participants: [
      { _id: 's1', name: 'Rajwadi Fabrics', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c91c?w=60&q=80', sellerInfo: { storeName: 'Rajwadi Fabrics' } },
    ],
    lastMessage: 'Yes, we have size M available! Would you like to order?',
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000),
    messages: [
      { _id: 'm1', sender: { _id: 's1', name: 'Rajwadi Fabrics' }, content: 'Hello! How can I help you?', createdAt: new Date(Date.now() - 30 * 60 * 1000) },
      { _id: 'm2', sender: { _id: 'me', name: 'Me' }, content: 'Hi! Is the Kashmiri Pashmina shawl available in size M?', createdAt: new Date(Date.now() - 25 * 60 * 1000) },
      { _id: 'm3', sender: { _id: 's1', name: 'Rajwadi Fabrics' }, content: 'Yes, we have size M available! Would you like to order?', createdAt: new Date(Date.now() - 10 * 60 * 1000) },
    ],
  },
  {
    _id: 'conv2',
    participants: [
      { _id: 's2', name: 'Pure Botanics', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80', sellerInfo: { storeName: 'Pure Botanics' } },
    ],
    lastMessage: 'Thank you for your purchase! Your order is on the way.',
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: [
      { _id: 'm4', sender: { _id: 's2', name: 'Pure Botanics' }, content: 'Thank you for your purchase! Your order is on the way.', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { _id: 'm5', sender: { _id: 'me', name: 'Me' }, content: 'Great! Could you share the tracking number?', createdAt: new Date(Date.now() - 90 * 60 * 1000) },
      { _id: 'm6', sender: { _id: 's2', name: 'Pure Botanics' }, content: 'Sure! Tracking number: YM87654321. Estimated delivery: 3-4 days.', createdAt: new Date(Date.now() - 80 * 60 * 1000) },
    ],
  },
  {
    _id: 'conv3',
    participants: [
      { _id: 's3', name: 'ArtisanCraft Co.', avatar: null, sellerInfo: { storeName: 'ArtisanCraft Co.' } },
    ],
    lastMessage: 'We offer bulk discounts for orders above ₹5000!',
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    messages: [
      { _id: 'm7', sender: { _id: 'me', name: 'Me' }, content: 'Do you offer any bulk discounts?', createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) },
      { _id: 'm8', sender: { _id: 's3', name: 'ArtisanCraft Co.' }, content: 'We offer bulk discounts for orders above ₹5000!', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ],
  },
]

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)     return 'just now'
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function MessagesPage() {
  const { isDark } = useTheme()
  const { user }   = useAuth()
  const chatEndRef = useRef(null)

  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS)
  const [activeConv, setActiveConv]       = useState(null)
  const [messages, setMessages]           = useState([])
  const [input, setInput]                 = useState('')
  const [search, setSearch]               = useState('')

  // Load real conversations on mount
  useEffect(() => {
    API.get('/messages/conversations')
      .then(({ data }) => { if (data.conversations?.length) setConversations(data.conversations) })
      .catch(() => {/* use demo data */})
  }, [])

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConv) return
    setMessages(activeConv.messages || [])
    API.get(`/messages/${activeConv._id}`)
      .then(({ data }) => { if (data.messages?.length) setMessages(data.messages) })
      .catch(() => {/* use demo messages */})
  }, [activeConv])

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return
    const newMsg = {
      _id:      `local_${Date.now()}`,
      sender:   { _id: user?._id || 'me', name: user?.name || 'Me' },
      content:  input.trim(),
      createdAt: new Date(),
    }
    setMessages(prev => [...prev, newMsg])
    setConversations(prev => prev.map(c =>
      c._id === activeConv._id ? { ...c, lastMessage: input.trim(), lastMessageAt: new Date() } : c
    ))
    const sent = input.trim()
    setInput('')

    // Try API
    API.post(`/messages/${activeConv._id}`, { content: sent }).catch(() => {})

    // Demo: simulate reply
    setTimeout(() => {
      const replies = [
        'Thank you for reaching out! How can I help?',
        'Sure, let me check that for you.',
        'We have that item in stock. Would you like to order?',
        'Shipping takes 3-5 days to your location.',
        'Yes, COD is available for this product!',
      ]
      const reply = {
        _id:      `reply_${Date.now()}`,
        sender:   { _id: 'seller', name: activeConv.participants?.[0]?.name || 'Seller' },
        content:  replies[Math.floor(Math.random() * replies.length)],
        createdAt: new Date(),
      }
      setMessages(prev => [...prev, reply])
    }, 1500)
  }

  const getOther = (conv) => conv.participants?.find(p => p._id !== user?._id) || conv.participants?.[0]

  const filteredConvs = conversations.filter(c => {
    const other = getOther(c)
    return other?.name?.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <h1 className={`font-serif text-2xl font-bold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Messages</h1>

      <div className={`rounded-3xl border overflow-hidden flex h-[calc(100vh-220px)] min-h-[400px]
        ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>

        {/* Conversation list */}
        <div className={`flex flex-col border-r w-full sm:w-72 flex-shrink-0 transition-all
          ${activeConv ? 'hidden sm:flex' : 'flex'}
          ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>

          {/* Search */}
          <div className={`p-3 border-b ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-ink3 border border-white/[0.07]' : 'bg-gray-50 border border-lt_border'}`}>
              <Search size={13} className={isDark ? 'text-muted' : 'text-lt_muted'} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className={`flex-1 bg-transparent text-xs outline-none ${isDark ? 'text-cream placeholder:text-smoke' : 'text-lt_text placeholder:text-lt_muted'}`} />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-4">
                <MessageCircle size={28} className="text-muted" />
                <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>No conversations yet</p>
              </div>
            ) : (
              filteredConvs.map(conv => {
                const other = getOther(conv)
                return (
                  <button key={conv._id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left border-b
                      ${activeConv?._id === conv._id
                        ? isDark ? 'bg-gold/5 border-gold/15' : 'bg-amber-50 border-amber-100'
                        : isDark ? 'hover:bg-white/[0.03] border-white/[0.04]' : 'hover:bg-gray-50 border-lt_border/50'
                      }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-ink text-sm font-bold flex-shrink-0 bg-gradient-to-br from-gold to-ember overflow-hidden`}>
                      {other?.avatar
                        ? <img src={other.avatar} alt={other.name} className="w-full h-full object-cover" />
                        : other?.name?.[0] || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className={`text-sm font-semibold truncate ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                          {other?.sellerInfo?.storeName || other?.name}
                        </span>
                        <span className={`text-[0.62rem] ml-2 flex-shrink-0 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                          {timeAgo(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat view */}
        <div className={`flex flex-col flex-1 ${!activeConv ? 'hidden sm:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className={`flex items-center gap-3 px-4 py-3 border-b flex-shrink-0
                ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
                <button onClick={() => setActiveConv(null)}
                  className={`sm:hidden p-1 ${isDark ? 'text-muted hover:text-cream' : 'text-lt_muted'}`}>
                  <ArrowLeft size={18} />
                </button>
                {(() => {
                  const other = getOther(activeConv)
                  return (
                    <>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-sm font-bold overflow-hidden flex-shrink-0">
                        {other?.avatar
                          ? <img src={other.avatar} alt={other.name} className="w-full h-full object-cover" />
                          : other?.name?.[0] || 'S'}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                          {other?.sellerInfo?.storeName || other?.name}
                        </p>
                        <p className={`text-[0.65rem] flex items-center gap-1 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
                          Online
                        </p>
                      </div>
                    </>
                  )
                })()}
                <button className={`ml-auto p-1.5 rounded-lg ${isDark ? 'text-muted hover:text-cream' : 'text-lt_muted'}`}>
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((msg, i) => {
                  const isMe = msg.sender?._id === user?._id || msg.sender?._id === 'me'
                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-xs font-bold mr-2 flex-shrink-0 mt-auto">
                          {msg.sender?.name?.[0] || 'S'}
                        </div>
                      )}
                      <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 ${
                        isMe
                          ? 'bg-gradient-to-r from-gold to-gold2 text-ink rounded-br-sm'
                          : isDark
                            ? 'bg-ink3 border border-white/[0.07] text-cream rounded-bl-sm'
                            : 'bg-gray-100 text-lt_text rounded-bl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-[0.6rem] mt-1 ${isMe ? 'text-ink/60' : isDark ? 'text-muted' : 'text-lt_muted'}`}>
                          {timeAgo(msg.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className={`flex gap-2 p-3 border-t flex-shrink-0 ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message…"
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all
                    ${isDark ? 'bg-ink3 border border-white/[0.07] text-cream placeholder:text-smoke focus:border-gold/40' : 'bg-gray-50 border border-lt_border text-lt_text placeholder:text-lt_muted focus:border-gold/40'}`}
                />
                <button onClick={sendMessage}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-gold to-gold2 flex items-center justify-center text-ink hover:opacity-90 transition-opacity flex-shrink-0">
                  <Send size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-gold/10 border border-gold/20' : 'bg-amber-50 border border-amber-200'}`}>
                <MessageCircle size={28} className="text-gold" />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Select a conversation</h3>
                <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                  Choose from your conversations to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

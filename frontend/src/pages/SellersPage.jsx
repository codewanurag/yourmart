import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, Star, Users, ShieldCheck, Search, MessageCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { MOCK_SELLERS, MOCK_PRODUCTS } from '../utils/mockData'
import ProductCard from '../components/product/ProductCard'
import toast from 'react-hot-toast'

export default function SellersPage() {
  const { isDark } = useTheme()
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [search, setSearch]         = useState('')
  const [followed, setFollowed]     = useState(new Set())
  const [activeSeller, setActiveSeller] = useState(null)

  const filtered = MOCK_SELLERS.filter(s =>
    s.sellerInfo.storeName.toLowerCase().includes(search.toLowerCase()) ||
    s.sellerInfo.storeTag.toLowerCase().includes(search.toLowerCase())
  )

  const toggleFollow = (sellerId) => {
    if (!user) { toast.error('Please login to follow sellers'); return }
    setFollowed(prev => {
      const next = new Set(prev)
      if (next.has(sellerId)) { next.delete(sellerId); toast.success('Unfollowed seller') }
      else { next.add(sellerId); toast.success('Following seller! 🎉') }
      return next
    })
  }

  const sellerProducts = activeSeller
    ? MOCK_PRODUCTS.filter(p => p.sellerName === activeSeller.sellerInfo.storeName)
    : []

  return (
    <div className="animate-slide-up max-w-3xl mx-auto xl:max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            Discover Sellers
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            {MOCK_SELLERS.length} verified artisan sellers
          </p>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 w-full sm:w-64
          ${isDark ? 'bg-ink3 border-white/[0.07] focus-within:border-gold/40' : 'bg-white border-lt_border focus-within:border-gold/40'}`}>
          <Search size={14} className={isDark ? 'text-muted' : 'text-lt_muted'} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search sellers…"
            className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-cream placeholder:text-smoke' : 'text-lt_text placeholder:text-lt_muted'}`} />
        </div>
      </div>

      {/* Seller cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filtered.map((seller, i) => {
          const isFollowing = followed.has(seller._id)
          const followerCount = seller.followers?.length + (isFollowing ? 1 : 0)
          const sellerProds = MOCK_PRODUCTS.filter(p => p.sellerName === seller.sellerInfo.storeName)

          return (
            <motion.div
              key={seller._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-[32px] border border-[#eee3d6] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              
              <div className="px-5 pt-5 pb-5">
                {/* Avatar */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-16 h-16 rounded-full bg-[#f4f4f4] flex items-center justify-center overflow-hidden shadow-sm border border-[#eee]"> border-3 border-ink2 flex items-center justify-center text-ink text-lg font-bold overflow-hidden"
                    style={{ border: '3px solid', borderColor: isDark ? '#111010' : '#FFFFFF' }}>
                    {seller.avatar
                      ? <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                      : seller.name[0]}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast.success('Opening chat... (Connect backend for real messages)')}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border
                        ${isDark ? 'border-white/[0.1] text-muted hover:text-cream hover:border-gold/30' : 'border-lt_border text-lt_muted hover:border-gold/30'}`}>
                      <MessageCircle size={13} />
                    </button>
                    <button
                      onClick={() => toggleFollow(seller._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border
                        ${isFollowing
                          ? 'bg-gold/10 border-gold/30 text-gold'
                          : isDark ? 'bg-transparent border-white/[0.15] text-dim hover:border-gold/30 hover:text-cream' : 'bg-transparent border-lt_border text-lt_muted hover:border-gold/30'
                        }`}>
                      {isFollowing ? '✓ Following' : '+ Follow'}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-serif font-bold text-base ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                      {seller.sellerInfo.storeName}
                    </h3>
                    <ShieldCheck size={13} className="text-sage" />
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                    {seller.sellerInfo.storeTag}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Rating',    value: seller.sellerInfo.rating, icon: '★', color: 'text-gold' },
                    { label: 'Products',  value: sellerProds.length, icon: '📦', color: isDark ? 'text-cream' : 'text-lt_text' },
                    { label: 'Followers', value: followerCount, icon: '👥', color: isDark ? 'text-cream' : 'text-lt_text' },
                  ].map(({ label, value, icon, color }) => (
                    <div key={label} className="rounded-2xl p-3 text-center border border-[#eee3d6] bg-white">
                      <div className={`text-sm font-bold ${color}`}>{icon} {value}</div>
                      <div className={`text-[0.6rem] ${isDark ? 'text-muted' : 'text-lt_muted'}`}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Product preview */}
                <div className="flex gap-1.5 mb-3">
                  {sellerProds.slice(0, 3).map(p => (
                    <img key={p._id} src={p.images?.[0]} alt={p.name}
                      className="flex-1 h-12 rounded-lg object-cover"
                      onError={e => { e.target.style.display = 'none' }} />
                  ))}
                </div>

                <button
                  onClick={() => setActiveSeller(activeSeller?._id === seller._id ? null : seller)}
                  className="w-full py-3 rounded-2xl text-sm font-semibold border border-[#eee3d6] text-[#7b6d62] hover:bg-[#faf7f2] transition-all"
                    ${activeSeller?._id === seller._id
                      ? 'bg-gradient-to-r from-gold to-gold2 text-ink border-transparent'
                      : isDark ? 'border-white/[0.1] text-dim hover:border-gold/30 hover:text-cream' : 'border-lt_border text-lt_muted hover:border-gold/30'
                    }`}>
                  {activeSeller?._id === seller._id ? 'Hide Products ↑' : `View All Products (${sellerProds.length})`}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Expanded seller products */}
      {activeSeller && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className={`font-serif text-xl font-bold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            {activeSeller.sellerInfo.storeName}'s Products
          </h2>
          {sellerProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {sellerProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          ) : (
            <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
              No products listed yet
            </p>
          )}
        </motion.div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <Store size={40} className="text-muted" />
          <h3 className={`font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>No sellers found</h3>
          <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Try searching for something else</p>
          <button onClick={() => setSearch('')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold">
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}

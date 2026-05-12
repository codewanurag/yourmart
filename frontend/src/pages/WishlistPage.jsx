import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { MOCK_PRODUCTS } from '../utils/mockData'

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist()
  const { addToCart }  = useCart()
  const { isDark }     = useTheme()
  const navigate       = useNavigate()

  // Merge real wishlisted items with mock data for demo
  const displayItems = wishlist.length > 0
    ? wishlist.map(item => typeof item === 'object' ? item : MOCK_PRODUCTS.find(p => p._id === item)).filter(Boolean)
    : MOCK_PRODUCTS.slice(0, 3) // Show some demo items

  if (displayItems.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-20 h-20 rounded-full bg-blush/10 border border-blush/20 flex items-center justify-center">
        <Heart size={32} className="text-blush" />
      </div>
      <div>
        <h2 className={`font-serif text-2xl font-bold mb-2 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Your wishlist is empty</h2>
        <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Save items you love to buy later</p>
      </div>
      <button onClick={() => navigate('/products')}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center gap-2">
        Explore Products <ArrowRight size={16} />
      </button>
    </div>
  )

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
          My Wishlist <span className="text-gold text-lg">({displayItems.length})</span>
        </h1>
        <button onClick={() => navigate('/products')}
          className="text-gold text-sm font-medium hover:underline flex items-center gap-1">
          Browse more <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg
              ${isDark ? 'bg-ink2 border-white/[0.07] hover:border-gold/25' : 'bg-white border-lt_border hover:border-gold/25'}`}
          >
            <div className="relative h-44 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/products/${product._id}`)}>
              <img src={product.images?.[0]} alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <button
                onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blush flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="p-3.5">
              <h3 className={`text-sm font-medium line-clamp-2 mb-2 cursor-pointer hover:text-gold transition-colors ${isDark ? 'text-cream' : 'text-lt_text'}`}
                onClick={() => navigate(`/products/${product._id}`)}>
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif font-semibold text-gold2">₹{product.price?.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className={`text-xs line-through ${isDark ? 'text-smoke' : 'text-lt_muted'}`}>
                      ₹{product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                <button onClick={() => addToCart(product)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold to-gold2 text-ink text-xs font-semibold hover:opacity-90 transition-opacity">
                  <ShoppingCart size={12} /> Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Move all to cart */}
      <div className="mt-6 flex justify-end">
        <button onClick={() => { displayItems.forEach(p => addToCart(p)); navigate('/cart') }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold hover:opacity-90 transition-opacity">
          <ShoppingCart size={15} /> Move All to Cart
        </button>
      </div>
    </div>
  )
}

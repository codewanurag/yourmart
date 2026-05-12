import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Star, ShieldCheck } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart }       = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { isDark }          = useTheme()
  const navigate            = useNavigate()
  const [imgError, setImgError] = useState(false)

  const wishlisted = isWishlisted(product._id)
  const discount   = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-2xl overflow-hidden border transition-all duration-300 group cursor-pointer
        ${isDark
          ? 'bg-ink2 border-white/[0.07] hover:border-gold/25 hover:shadow-2xl hover:-translate-y-1'
          : 'bg-white border-lt_border hover:border-gold/30 hover:shadow-xl hover:-translate-y-1'
        }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52 bg-ink3"
        onClick={() => navigate(`/products/${product._id}`)}>
        {!imgError ? (
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-ink3">🛍️</div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-blush text-white text-[0.65rem] font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${wishlisted
              ? 'bg-blush text-white'
              : 'bg-black/40 backdrop-blur-sm text-white hover:bg-blush'
            }`}>
          <Heart size={14} fill={wishlisted ? 'white' : 'none'} />
        </button>

        {/* Live indicator */}
        {product.isLive && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-red-500/40 rounded px-2 py-1 text-[0.6rem] font-semibold text-red-400 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
            LIVE
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5" onClick={() => navigate(`/products/${product._id}`)}>
        {/* Seller */}
        <div className={`text-[0.68rem] mb-1 flex items-center gap-1 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
          {product.sellerName}
          {product.sellerVerified && <ShieldCheck size={10} className="text-sage" />}
        </div>

        {/* Name */}
        <h3 className={`text-[0.88rem] font-medium leading-snug mb-2 line-clamp-2 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className={`flex items-center gap-1 mb-3 text-[0.7rem] ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
          <Star size={11} className="text-gold2 fill-gold2" />
          <span className="text-gold2 font-medium">{product.rating}</span>
          <span>({product.numReviews?.toLocaleString()})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-semibold text-gold2">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className={`text-xs line-through ${isDark ? 'text-smoke' : 'text-lt_muted'}`}>
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={e => { e.stopPropagation(); addToCart(product) }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold2 flex items-center justify-center text-ink hover:scale-110 transition-transform shadow-gold">
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

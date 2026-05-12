import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShieldCheck, Heart, ShoppingCart, ArrowLeft, Share2, Package, Truck, RefreshCw } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useTheme } from '../context/ThemeContext'
import { MOCK_PRODUCTS } from '../utils/mockData'
import ProductCard from '../components/product/ProductCard'

const FAKE_REVIEWS = [
  { name: 'Priya P.', rating: 5, comment: 'Great quality, fast delivery! Exactly as described. Very happy with the purchase.', date: '2 weeks ago' },
  { name: 'Rahul S.', rating: 5, comment: 'Perfect for gifting. Very authentic product. The seller was responsive and helpful.', date: '1 month ago' },
  { name: 'Meena K.', rating: 4, comment: 'Seller was super helpful. Will buy again! Slight delay in shipping but worth it.', date: '1 month ago' },
]

export default function ProductDetailPage() {
  const { id }         = useParams()
  const { isDark }     = useTheme()
  const { addToCart }  = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const navigate       = useNavigate()

  const product = MOCK_PRODUCTS.find(p => p._id === id)
  const related = MOCK_PRODUCTS.filter(p => p._id !== id && p.category === product?.category).slice(0, 4)

  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty]             = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  if (!product) return (
    <div className="flex flex-col items-center py-20 gap-4">
      <span className="text-5xl">😕</span>
      <h3 className={`font-semibold text-lg ${isDark ? 'text-cream' : 'text-lt_text'}`}>Product not found</h3>
      <button onClick={() => navigate('/products')}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold">
        Browse Products
      </button>
    </div>
  )

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-sm mb-6 transition-colors ${isDark ? 'text-dim hover:text-cream' : 'text-lt_muted hover:text-lt_text'}`}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden bg-ink3 aspect-square">
            <img src={product.images[activeImg]} alt={product.name}
              className="w-full h-full object-cover" />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-blush text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                -{discount}% OFF
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-gold' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {/* Seller */}
          <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
            <span>{product.sellerName}</span>
            {product.sellerVerified && <ShieldCheck size={13} className="text-sage" />}
          </div>

          <h1 className={`font-serif text-2xl font-bold leading-snug ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14}
                  className={s <= Math.round(product.rating) ? 'text-gold2 fill-gold2' : isDark ? 'text-smoke' : 'text-lt_border'} />
              ))}
            </div>
            <span className="text-gold2 font-semibold text-sm">{product.rating}</span>
            <span className={`text-sm ${isDark ? 'text-muted' : 'text-lt_muted'}`}>({product.numReviews?.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-gold2">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className={`text-lg line-through ${isDark ? 'text-smoke' : 'text-lt_muted'}`}>
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            )}
            {discount > 0 && <span className="text-sage text-sm font-semibold">{discount}% off</span>}
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {product.tags?.map(tag => (
              <span key={tag}
                className={`px-3 py-1 rounded-full text-xs border ${isDark ? 'bg-ink3 border-white/[0.1] text-dim' : 'bg-gray-100 border-lt_border text-lt_muted'}`}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Qty + buttons */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center border rounded-xl overflow-hidden ${isDark ? 'border-white/[0.1]' : 'border-lt_border'}`}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className={`px-3 py-2.5 text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/[0.06] text-dim' : 'hover:bg-gray-100 text-lt_muted'}`}>
                −
              </button>
              <span className={`px-4 py-2.5 text-sm font-semibold min-w-[40px] text-center ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                {qty}
              </span>
              <button onClick={() => setQty(q => q + 1)}
                className={`px-3 py-2.5 text-sm font-bold transition-colors ${isDark ? 'hover:bg-white/[0.06] text-dim' : 'hover:bg-gray-100 text-lt_muted'}`}>
                +
              </button>
            </div>
            <span className={`text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
              {product.stock} in stock
            </span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => addToCart({ ...product, qty: undefined })}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all
                ${isWishlisted(product._id)
                  ? 'bg-blush/10 border-blush/30 text-blush'
                  : isDark ? 'border-white/[0.1] text-muted hover:text-blush hover:border-blush/30' : 'border-lt_border text-lt_muted hover:text-blush'
                }`}>
              <Heart size={18} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Perks */}
          <div className={`grid grid-cols-3 gap-3 rounded-2xl p-4 border ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-gray-50 border-lt_border'}`}>
            {[
              { icon: Truck,      text: 'Free shipping on ₹999+' },
              { icon: Package,    text: 'Secure packaging' },
              { icon: RefreshCw,  text: '7-day returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                <Icon size={16} className="text-gold" />
                <span className={`text-[0.65rem] leading-tight ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-b mb-6 ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
        <div className="flex gap-0">
          {['description', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium capitalize relative transition-colors
                ${activeTab === tab
                  ? `${isDark ? 'text-cream' : 'text-lt_text'} after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-gold after:to-gold2`
                  : isDark ? 'text-muted hover:text-cream' : 'text-lt_muted hover:text-lt_text'
                }`}>
              {tab === 'reviews' ? `Reviews (${FAKE_REVIEWS.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'description' ? (
        <p className={`text-sm leading-relaxed mb-10 max-w-2xl ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
          {product.description}
        </p>
      ) : (
        <div className="flex flex-col gap-4 mb-10">
          {FAKE_REVIEWS.map((rev, i) => (
            <div key={i} className={`rounded-2xl p-5 border ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-xs font-bold">
                  {rev.name[0]}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>{rev.name}</div>
                  <div className={`text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>{rev.date}</div>
                </div>
                <div className="ml-auto flex">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= rev.rating ? 'text-gold2 fill-gold2' : 'text-smoke'} />)}
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className={`font-serif text-xl font-bold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}

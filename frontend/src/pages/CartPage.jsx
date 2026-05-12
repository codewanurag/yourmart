import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

export default function CartPage() {
  const { cart, cartSubtotal, removeFromCart, updateQty, clearCart } = useCart()
  const { isDark } = useTheme()
  const navigate   = useNavigate()

  const shipping = cartSubtotal > 999 ? 0 : 49
  const tax      = Math.round(cartSubtotal * 0.18)
  const total    = cartSubtotal + shipping + tax

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
        <ShoppingBag size={32} className="text-gold" />
      </div>
      <div>
        <h2 className={`font-serif text-2xl font-bold mb-2 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Your cart is empty</h2>
        <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Discover amazing products and add them to your cart</p>
      </div>
      <button onClick={() => navigate('/products')}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center gap-2">
        <ShoppingBag size={16} /> Start Shopping
      </button>
    </div>
  )

  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
          My Cart <span className="text-gold text-lg">({cart.length})</span>
        </h1>
        <button onClick={clearCart} className="text-blush text-sm hover:underline">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cart.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              exit={{ opacity: 0, x: -30 }}
              className={`flex gap-4 p-4 rounded-2xl border ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}
            >
              <img src={item.images?.[0]} alt={item.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/products/${item._id}`)}
                onError={e => { e.target.src = 'https://via.placeholder.com/80' }}
              />
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium leading-snug mb-1 line-clamp-2 cursor-pointer hover:text-gold transition-colors ${isDark ? 'text-cream' : 'text-lt_text'}`}
                  onClick={() => navigate(`/products/${item._id}`)}>
                  {item.name}
                </h3>
                <p className={`text-xs mb-3 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>{item.sellerName}</p>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center border rounded-lg overflow-hidden ${isDark ? 'border-white/[0.1]' : 'border-lt_border'}`}>
                    <button onClick={() => updateQty(item._id, item.qty - 1)}
                      className={`px-2.5 py-1.5 text-sm transition-colors ${isDark ? 'hover:bg-white/[0.06] text-dim' : 'hover:bg-gray-100 text-lt_muted'}`}>
                      <Minus size={12} />
                    </button>
                    <span className={`px-3 text-sm font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}
                      className={`px-2.5 py-1.5 text-sm transition-colors ${isDark ? 'hover:bg-white/[0.06] text-dim' : 'hover:bg-gray-100 text-lt_muted'}`}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-semibold text-gold2">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </span>
                    <button onClick={() => removeFromCart(item._id)} className="text-blush hover:opacity-80">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order summary */}
        <div className={`rounded-2xl border p-5 h-fit sticky top-20 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
          <h2 className={`font-serif text-lg font-bold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Order Summary</h2>
          <div className="flex flex-col gap-3 mb-4">
            {[
              { label: 'Subtotal',  value: `₹${cartSubtotal.toLocaleString()}` },
              { label: 'Shipping',  value: shipping === 0 ? '🎉 FREE' : `₹${shipping}` },
              { label: 'GST (18%)', value: `₹${tax.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{label}</span>
                <span className={`text-sm font-medium ${isDark ? 'text-cream' : 'text-lt_text'}`}>{value}</span>
              </div>
            ))}
            <div className={`border-t pt-3 flex justify-between ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
              <span className={`font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Total</span>
              <span className="font-serif text-xl font-bold text-gold2">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {cartSubtotal < 999 && (
            <div className={`rounded-xl p-3 mb-4 text-xs text-center ${isDark ? 'bg-gold/5 border border-gold/15 text-dim' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
              Add ₹{(1000 - cartSubtotal).toLocaleString()} more for free shipping!
            </div>
          )}

          <button onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            Proceed to Checkout <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/products')}
            className={`w-full py-2.5 rounded-xl mt-2 text-sm transition-colors ${isDark ? 'text-dim hover:text-cream' : 'text-lt_muted hover:text-lt_text'}`}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

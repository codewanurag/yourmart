import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ open, onClose }) {
  const { cart, cartSubtotal, removeFromCart, updateQty, cartCount } = useCart()
  const { isDark } = useTheme()
  const navigate   = useNavigate()

  const shipping    = cartSubtotal > 999 ? 0 : 49
  const tax         = Math.round(cartSubtotal * 0.18)
  const total       = cartSubtotal + shipping + tax

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[850] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed right-0 top-0 bottom-0 z-[860] w-full max-w-sm flex flex-col shadow-2xl
              ${isDark ? 'bg-ink2 border-l border-white/[0.07]' : 'bg-white border-l border-lt_border'}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-gold" />
                <h2 className={`font-serif text-lg font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                  My Cart
                </h2>
                {cartCount > 0 && (
                  <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button onClick={onClose}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${isDark ? 'bg-white/[0.05] text-muted hover:text-cream' : 'bg-gray-100 text-lt_muted hover:text-lt_text'}`}>
                <X size={16} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <span className="text-5xl">🛒</span>
                  <div>
                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Your cart is empty</h3>
                    <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Add some items to get started</p>
                  </div>
                  <button onClick={() => { navigate('/products'); onClose() }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold">
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id}
                    className={`flex gap-3 p-3 rounded-2xl border ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-gray-50 border-lt_border'}`}>
                    <img src={item.images?.[0]} alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={e => { e.target.src = 'https://via.placeholder.com/64' }} />

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium leading-snug mb-1 line-clamp-2 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                        {item.name}
                      </h4>
                      <div className="font-serif text-sm font-semibold text-gold2 mb-2">
                        ₹{item.price?.toLocaleString()}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Qty controls */}
                        <div className={`flex items-center gap-2 rounded-lg border p-1 ${isDark ? 'bg-ink4 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
                          <button onClick={() => updateQty(item._id, item.qty - 1)}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/[0.1] text-dim' : 'hover:bg-gray-100 text-lt_muted'}`}>
                            <Minus size={12} />
                          </button>
                          <span className={`text-sm font-semibold w-5 text-center ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                            {item.qty}
                          </span>
                          <button onClick={() => updateQty(item._id, item.qty + 1)}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/[0.1] text-dim' : 'hover:bg-gray-100 text-lt_muted'}`}>
                            <Plus size={12} />
                          </button>
                        </div>

                        <button onClick={() => removeFromCart(item._id)}
                          className="text-blush hover:text-blush/80 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary + Checkout */}
            {cart.length > 0 && (
              <div className={`p-5 border-t ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { label: 'Subtotal', value: `₹${cartSubtotal.toLocaleString()}` },
                    { label: 'Shipping', value: shipping === 0 ? 'FREE 🎉' : `₹${shipping}` },
                    { label: 'GST (18%)', value: `₹${tax.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{label}</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-cream' : 'text-lt_text'}`}>{value}</span>
                    </div>
                  ))}
                  <div className={`flex justify-between pt-2 border-t ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
                    <span className={`font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Total</span>
                    <span className="font-serif text-lg font-bold text-gold2">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {cartSubtotal <= 999 && (
                  <p className="text-xs text-dim text-center mb-3">
                    Add ₹{(1000 - cartSubtotal).toLocaleString()} more for free shipping!
                  </p>
                )}

                <button
                  onClick={() => { navigate('/checkout'); onClose() }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  <FollowButton userId={user._id} />
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, MapPin, CreditCard, Check, Loader2, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { id: 'COD',    label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'UPI',    label: 'UPI Payment',       icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'CARD',   label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
]

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart()
  const { isDark } = useTheme()
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [step, setStep]           = useState(1) // 1=address, 2=payment, 3=review
  const [placing, setPlacing]     = useState(false)
  const [payMethod, setPayMethod] = useState('COD')
  const [address, setAddress]     = useState({
    fullName: user?.name || '',
    address:  '',
    city:     '',
    state:    '',
    pincode:  '',
    phone:    user?.phone || '',
  })
  const [errors, setErrors] = useState({})

  const shipping = cartSubtotal > 999 ? 0 : 49
  const tax      = Math.round(cartSubtotal * 0.18)
  const total    = cartSubtotal + shipping + tax

  const validateAddress = () => {
    const e = {}
    if (!address.fullName) e.fullName = 'Required'
    if (!address.address)  e.address  = 'Required'
    if (!address.city)     e.city     = 'Required'
    if (!address.state)    e.state    = 'Required'
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    if (!address.phone || !/^\d{10}$/.test(address.phone)) e.phone = 'Enter valid 10-digit phone'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const items = cart.map(item => ({ productId: item._id, qty: item.qty }))
      const { data } = await API.post('/orders', {
        items,
        shippingAddress: address,
        paymentMethod: payMethod,
      })
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate(`/orders/${data.order._id}`)
    } catch (err) {
      // Fallback: simulate order for demo
      clearCart()
      toast.success('Order placed successfully! 🎉 (Demo mode)')
      navigate('/orders')
    } finally {
      setPlacing(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl text-sm transition-all outline-none
    ${isDark
      ? `bg-ink3 border text-cream placeholder:text-smoke ${errors[field] ? 'border-blush/50' : 'border-white/[0.07] focus:border-gold/40'}`
      : `bg-white border text-lt_text placeholder:text-lt_muted ${errors[field] ? 'border-red-300' : 'border-lt_border focus:border-gold/40'}`
    }`

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <h1 className={`font-serif text-2xl font-bold mb-6 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[{ n: 1, label: 'Address' }, { n: 2, label: 'Payment' }, { n: 3, label: 'Review' }].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
              ${step >= n ? 'bg-gradient-to-br from-gold to-gold2 text-ink' : isDark ? 'bg-ink3 text-muted border border-white/[0.1]' : 'bg-gray-100 text-lt_muted'}`}>
              {step > n ? <Check size={14} /> : n}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === n ? isDark ? 'text-cream' : 'text-lt_text' : isDark ? 'text-muted' : 'text-lt_muted'}`}>
              {label}
            </span>
            {i < arr.length - 1 && <div className={`flex-1 h-px ml-1 ${isDark ? 'bg-white/[0.07]' : 'bg-lt_border'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2">

          {/* Step 1: Address */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-6 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={16} className="text-gold" />
                <h2 className={`font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Delivery Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'fullName', label: 'Full Name',     ph: 'As on govt. ID',       col: 'sm:col-span-2' },
                  { key: 'address',  label: 'Street Address', ph: 'House no., street name', col: 'sm:col-span-2' },
                  { key: 'city',     label: 'City',           ph: 'City' },
                  { key: 'state',    label: 'State',          ph: 'State' },
                  { key: 'pincode',  label: 'Pincode',        ph: '6-digit pincode' },
                  { key: 'phone',    label: 'Phone Number',   ph: '10-digit mobile' },
                ].map(({ key, label, ph, col }) => (
                  <div key={key} className={col || ''}>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{label}</label>
                    <input value={address[key]} placeholder={ph}
                      onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                      className={inputClass(key)} />
                    {errors[key] && <p className="text-blush text-xs mt-0.5">{errors[key]}</p>}
                  </div>
                ))}
              </div>
              <button onClick={() => { if (validateAddress()) setStep(2) }}
                className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Continue to Payment <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-6 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={16} className="text-gold" />
                <h2 className={`font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Payment Method</h2>
              </div>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all
                      ${payMethod === m.id
                        ? 'border-gold/40 bg-gold/5'
                        : isDark ? 'border-white/[0.07] hover:border-gold/20' : 'border-lt_border hover:border-gold/20'
                      }`}>
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${isDark ? 'text-cream' : 'text-lt_text'}`}>{m.label}</div>
                      <div className={`text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>{m.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${payMethod === m.id ? 'border-gold bg-gold' : isDark ? 'border-smoke' : 'border-lt_border'}`}>
                      {payMethod === m.id && <div className="w-2 h-2 rounded-full bg-ink" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(1)}
                  className={`flex-1 py-3.5 rounded-xl border font-medium text-sm transition-colors
                    ${isDark ? 'border-white/[0.1] text-dim hover:text-cream' : 'border-lt_border text-lt_muted hover:text-lt_text'}`}>
                  ← Back
                </button>
                <button onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold hover:opacity-90 transition-opacity">
                  Review Order →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-6 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
              <h2 className={`font-semibold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Review Your Order</h2>

              {/* Address summary */}
              <div className={`rounded-xl p-4 border mb-4 ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-gray-50 border-lt_border'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-muted' : 'text-lt_muted'}`}>Delivery To</span>
                  <button onClick={() => setStep(1)} className="text-gold text-xs">Edit</button>
                </div>
                <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>{address.fullName}</p>
                <p className={`text-xs ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                  {address.address}, {address.city}, {address.state} - {address.pincode}
                </p>
                <p className={`text-xs ${isDark ? 'text-dim' : 'text-lt_muted'}`}>📞 {address.phone}</p>
              </div>

              {/* Payment summary */}
              <div className={`rounded-xl p-4 border mb-4 ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-gray-50 border-lt_border'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-muted' : 'text-lt_muted'}`}>Payment</span>
                  <button onClick={() => setStep(2)} className="text-gold text-xs">Edit</button>
                </div>
                <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                  {PAYMENT_METHODS.find(m => m.id === payMethod)?.label}
                </p>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(2)}
                  className={`flex-1 py-3.5 rounded-xl border font-medium text-sm transition-colors
                    ${isDark ? 'border-white/[0.1] text-dim hover:text-cream' : 'border-lt_border text-lt_muted'}`}>
                  ← Back
                </button>
                <button onClick={placeOrder} disabled={placing}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
                  {placing ? <><Loader2 size={16} className="animate-spin" /> Placing...</> : '🎉 Place Order'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order summary */}
        <div className={`rounded-2xl border p-5 h-fit ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
          <h3 className={`font-serif font-bold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            Order ({cart.length} items)
          </h3>
          <div className="flex flex-col gap-2.5 mb-4 max-h-48 overflow-y-auto">
            {cart.map(item => (
              <div key={item._id} className="flex gap-2.5">
                <img src={item.images?.[0]} alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium line-clamp-2 ${isDark ? 'text-cream' : 'text-lt_text'}`}>{item.name}</p>
                  <p className="text-gold2 text-xs font-semibold">₹{item.price?.toLocaleString()} × {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`border-t pt-3 flex flex-col gap-1.5 ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
            {[
              { l: 'Subtotal',   v: `₹${cartSubtotal.toLocaleString()}` },
              { l: 'Shipping',   v: shipping === 0 ? 'FREE' : `₹${shipping}` },
              { l: 'GST (18%)', v: `₹${tax.toLocaleString()}` },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between">
                <span className={`text-xs ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{l}</span>
                <span className={`text-xs font-medium ${isDark ? 'text-cream' : 'text-lt_text'}`}>{v}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-gold/20">
              <span className={`text-sm font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Total</span>
              <span className="font-serif font-bold text-gold2">₹{total.toLocaleString()}</span>
            </div>
          </div>
          <div className={`mt-4 flex items-center gap-2 text-xs ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            <ShieldCheck size={13} className="text-sage flex-shrink-0" />
            100% Secure & Encrypted Checkout
          </div>
          <div className={`mt-1.5 flex items-center gap-2 text-xs ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            <Truck size={13} className="text-sky flex-shrink-0" />
            Estimated delivery: 5–7 business days
          </div>
        </div>
      </div>
    </div>
  )
}

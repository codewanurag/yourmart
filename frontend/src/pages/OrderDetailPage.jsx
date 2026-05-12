import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Clock } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import API from '../utils/api'

const STEPS = [
  { key: 'confirmed',        label: 'Order Confirmed',    icon: CheckCircle, desc: 'Your order has been placed and confirmed.' },
  { key: 'shipped',          label: 'Shipped',            icon: Package,     desc: 'Your order is on its way.' },
  { key: 'out_for_delivery', label: 'Out for Delivery',   icon: Truck,       desc: 'Your order is out for delivery today.' },
  { key: 'delivered',        label: 'Delivered',          icon: CheckCircle, desc: 'Order successfully delivered.' },
]

const STATUS_ORDER = ['confirmed', 'shipped', 'out_for_delivery', 'delivered']

const DEMO_ORDER = {
  _id: 'ord_demo1',
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'shipped',
  totalPrice: 4248,
  subtotal: 3348,
  shippingPrice: 0,
  taxPrice: 603,
  trackingNumber: 'YM87654321',
  paymentMethod: 'COD',
  shippingAddress: {
    fullName: 'Demo User',
    address: '42, MG Road, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    phone: '9876543210',
  },
  items: [
    { name: 'Handwoven Kashmiri Pashmina Shawl', qty: 1, price: 2499, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&q=80' },
    { name: 'Handcrafted Brass Diya Set', qty: 1, price: 849, image: 'https://images.unsplash.com/photo-1604598943838-5f0f71c1e4ad?w=100&q=80' },
  ],
  estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
}

export default function OrderDetailPage() {
  const { id }   = useParams()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setOrder(DEMO_ORDER))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
  if (!order)  return <div className="text-center py-20 text-dim">Order not found</div>

  const currentIdx = STATUS_ORDER.indexOf(order.status)

  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <button onClick={() => navigate('/orders')}
        className={`flex items-center gap-2 text-sm mb-6 ${isDark ? 'text-dim hover:text-cream' : 'text-lt_muted hover:text-lt_text'}`}>
        <ArrowLeft size={16} /> My Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`font-serif text-xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {order.trackingNumber && (
          <div className={`text-xs px-3 py-1.5 rounded-xl border font-mono ${isDark ? 'border-gold/20 text-gold bg-gold/5' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
            {order.trackingNumber}
          </div>
        )}
      </div>

      {/* Tracking progress */}
      <div className={`rounded-2xl border p-5 mb-4 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
        <h2 className={`font-semibold mb-5 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Tracking</h2>
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const done    = i <= currentIdx
            const current = i === currentIdx
            const Icon    = step.icon
            return (
              <div key={step.key} className="flex gap-4 relative">
                {/* Line */}
                {i < STEPS.length - 1 && (
                  <div className={`absolute left-[15px] top-8 w-0.5 h-10 ${done && i < currentIdx ? 'bg-gold' : isDark ? 'bg-white/[0.07]' : 'bg-lt_border'}`} />
                )}
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                  ${done ? 'bg-gradient-to-br from-gold to-gold2 text-ink' : isDark ? 'bg-ink3 border border-white/[0.1] text-smoke' : 'bg-gray-100 text-lt_muted'}`}>
                  <Icon size={14} />
                </div>
                {/* Text */}
                <div className={`pb-8 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <p className={`text-sm font-semibold ${done ? isDark ? 'text-cream' : 'text-lt_text' : isDark ? 'text-smoke' : 'text-lt_muted'}`}>
                    {step.label}
                    {current && <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">Current</span>}
                  </p>
                  <p className={`text-xs mt-0.5 ${done ? isDark ? 'text-dim' : 'text-lt_muted' : isDark ? 'text-smoke/60' : 'text-lt_border'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {order.estimatedDelivery && order.status !== 'delivered' && (
          <div className={`mt-4 flex items-center gap-2 text-xs px-4 py-3 rounded-xl ${isDark ? 'bg-gold/5 border border-gold/15 text-dim' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
            <Clock size={13} />
            Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        )}
      </div>

      {/* Items */}
      <div className={`rounded-2xl border p-5 mb-4 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
        <h2 className={`font-semibold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Items</h2>
        <div className="flex flex-col gap-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-3">
              <img src={item.image || item.images?.[0]} alt={item.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                onError={e => { e.target.src = 'https://via.placeholder.com/56' }} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDark ? 'text-cream' : 'text-lt_text'}`}>{item.name}</p>
                <p className={`text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>Qty: {item.qty}</p>
                <p className="text-gold2 text-sm font-semibold">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`mt-4 pt-4 border-t flex flex-col gap-1.5 ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
          {[
            { l: 'Subtotal',   v: `₹${order.subtotal?.toLocaleString()}` },
            { l: 'Shipping',   v: order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}` },
            { l: 'GST',        v: `₹${order.taxPrice?.toLocaleString()}` },
          ].map(({ l, v }) => (
            <div key={l} className="flex justify-between">
              <span className={`text-xs ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{l}</span>
              <span className={`text-xs ${isDark ? 'text-cream' : 'text-lt_text'}`}>{v}</span>
            </div>
          ))}
          <div className="flex justify-between pt-1.5">
            <span className={`text-sm font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Total</span>
            <span className="font-serif font-bold text-gold2">₹{order.totalPrice?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery address */}
      {order.shippingAddress && (
        <div className={`rounded-2xl border p-5 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-gold" />
            <h2 className={`font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>Delivery Address</h2>
          </div>
          <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-lt_text'}`}>{order.shippingAddress.fullName}</p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>📞 {order.shippingAddress.phone}</p>
          <p className={`text-xs mt-2 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            Payment: <span className="font-semibold">{order.paymentMethod}</span>
          </p>
        </div>
      )}
    </div>
  )
}

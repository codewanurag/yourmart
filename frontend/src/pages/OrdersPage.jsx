import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import API from '../utils/api'

const STATUS_CONFIG = {
  pending:          { label: 'Pending',           color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  confirmed:        { label: 'Confirmed',          color: 'text-sky',        bg: 'bg-sky/10',        icon: CheckCircle },
  shipped:          { label: 'Shipped',            color: 'text-blue-400',   bg: 'bg-blue-400/10',   icon: Truck },
  out_for_delivery: { label: 'Out for Delivery',   color: 'text-gold',       bg: 'bg-gold/10',       icon: Truck },
  delivered:        { label: 'Delivered',          color: 'text-sage',       bg: 'bg-sage/10',       icon: CheckCircle },
  cancelled:        { label: 'Cancelled',          color: 'text-blush',      bg: 'bg-blush/10',      icon: XCircle },
}

const DEMO_ORDERS = [
  {
    _id: 'ord_demo1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'shipped',
    totalPrice: 4248,
    trackingNumber: 'YM87654321',
    items: [
      { name: 'Handwoven Kashmiri Pashmina Shawl', qty: 1, price: 2499, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&q=80' },
      { name: 'Handcrafted Brass Diya Set', qty: 1, price: 849, image: 'https://images.unsplash.com/photo-1604598943838-5f0f71c1e4ad?w=100&q=80' },
    ],
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord_demo2',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    totalPrice: 1548,
    trackingNumber: 'YM12345678',
    items: [
      { name: 'Rose Quartz & Pearl Layered Necklace', qty: 1, price: 1299, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&q=80' },
    ],
    estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function OrdersPage() {
  const { isDark } = useTheme()
  const navigate   = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/orders')
      .then(({ data }) => setOrders(data.orders?.length ? data.orders : DEMO_ORDERS))
      .catch(() => setOrders(DEMO_ORDERS))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="flex gap-1">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
      </div>
    </div>
  )

  if (orders.length === 0) return (
    <div className="flex flex-col items-center py-24 gap-5 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
        <Package size={32} className="text-gold" />
      </div>
      <div>
        <h2 className={`font-serif text-2xl font-bold mb-2 ${isDark ? 'text-cream' : 'text-lt_text'}`}>No orders yet</h2>
        <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Place your first order to see it here</p>
      </div>
      <button onClick={() => navigate('/products')}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold">
        Start Shopping
      </button>
    </div>
  )

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <h1 className={`font-serif text-2xl font-bold mb-6 ${isDark ? 'text-cream' : 'text-lt_text'}`}>My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order, i) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
          const Icon = cfg.icon
          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg
                ${isDark ? 'bg-ink2 border-white/[0.07] hover:border-gold/20' : 'bg-white border-lt_border hover:border-gold/20'}`}
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              {/* Order header */}
              <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
                <div>
                  <span className={`text-xs font-mono ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
                    <Icon size={11} /> {cfg.label}
                  </span>
                  <ChevronRight size={14} className={isDark ? 'text-muted' : 'text-lt_muted'} />
                </div>
              </div>

              {/* Items */}
              <div className="p-4 flex gap-3 items-start">
                <div className="flex -space-x-3">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <img key={idx} src={item.image || item.images?.[0]}
                      alt={item.name} className="w-12 h-12 rounded-xl object-cover border-2 border-ink2 flex-shrink-0"
                      onError={e => { e.target.src = 'https://via.placeholder.com/48' }} />
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-12 h-12 rounded-xl bg-ink3 border-2 border-ink2 flex items-center justify-center text-xs font-bold text-muted flex-shrink-0">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium line-clamp-1 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                    {order.items?.[0]?.name}
                    {order.items?.length > 1 && <span className={`text-xs ml-1 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>+{order.items.length - 1} more</span>}
                  </p>
                  <p className="font-serif text-base font-bold text-gold2 mt-0.5">₹{order.totalPrice?.toLocaleString()}</p>
                  {order.trackingNumber && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                      Tracking: <span className="font-mono">{order.trackingNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Estimated delivery */}
              {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className={`px-4 pb-4`}>
                  <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${isDark ? 'bg-gold/5 border border-gold/15 text-dim' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
                    <Truck size={12} />
                    Expected by {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart2, Package, ShoppingBag, TrendingUp, Plus, Edit2, Trash2,
  Radio, DollarSign, Eye, Star, Loader2, X, Check, Store
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { MOCK_PRODUCTS } from '../utils/mockData'
import API from '../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Fashion', 'Beauty', 'Home Decor', 'Electronics', 'Food', 'Jewellery', 'Art', 'Other']

const DEMO_STATS = {
  totalProducts: 8,
  totalOrders: 47,
  revenue: 94800,
  totalViews: 2340,
  recentOrders: [
    { _id: 'o1', user: { name: 'Priya P.' }, totalPrice: 2499, status: 'shipped',    createdAt: new Date(Date.now() - 1 * 86400000) },
    { _id: 'o2', user: { name: 'Rahul S.' }, totalPrice: 1299, status: 'delivered',  createdAt: new Date(Date.now() - 2 * 86400000) },
    { _id: 'o3', user: { name: 'Meena K.' }, totalPrice: 3798, status: 'confirmed',  createdAt: new Date(Date.now() - 3 * 86400000) },
    { _id: 'o4', user: { name: 'Vikram R.'}, totalPrice: 849,  status: 'pending',    createdAt: new Date(Date.now() - 4 * 86400000) },
  ],
}

const STATUS_COLORS = {
  pending:   'bg-yellow-400/10 text-yellow-400',
  confirmed: 'bg-sky/10 text-sky',
  shipped:   'bg-blue-400/10 text-blue-400',
  delivered: 'bg-sage/10 text-sage',
  cancelled: 'bg-blush/10 text-blush',
}

const BLANK_PRODUCT = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'Fashion', stock: '', images: [''], tags: '',
}

export default function SellerDashboardPage() {
  const { isDark } = useTheme()
  const { user }   = useAuth()

  const [activeTab, setActiveTab]     = useState('overview')
  const [stats, setStats]             = useState(null)
  const [products, setProducts]       = useState(MOCK_PRODUCTS.slice(0, 6))
  const [loading, setLoading]         = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm]               = useState(BLANK_PRODUCT)
  const [saving, setSaving]           = useState(false)

  useEffect(() => {
    Promise.all([
      API.get('/sellers/dashboard/stats').catch(() => null),
      API.get('/products/seller/my-products').catch(() => null),
    ]).then(([statsRes, productsRes]) => {
      setStats(statsRes?.data?.stats || DEMO_STATS)
      setProducts(productsRes?.data?.products?.length ? productsRes.data.products : MOCK_PRODUCTS.slice(0, 6))
    }).finally(() => setLoading(false))
  }, [])

  const openAdd = () => { setForm(BLANK_PRODUCT); setEditProduct(null); setShowAddProduct(true) }
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price,
      originalPrice: p.originalPrice || '', category: p.category,
      stock: p.stock, images: p.images || [''], tags: p.tags?.join(', ') || '',
    })
    setEditProduct(p)
    setShowAddProduct(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock) || 0,
        images: form.images.filter(Boolean),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      }
      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, payload).catch(() => null)
        setProducts(prev => prev.map(p => p._id === editProduct._id ? { ...p, ...payload } : p))
        toast.success('Product updated!')
      } else {
        const res = await API.post('/products', payload).catch(() => null)
        const newProduct = res?.data?.product || { ...payload, _id: `local_${Date.now()}`, rating: 0, numReviews: 0, sellerName: user?.sellerInfo?.storeName }
        setProducts(prev => [newProduct, ...prev])
        toast.success('Product added!')
      }
      setShowAddProduct(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product?')) return
    API.delete(`/products/${productId}`).catch(() => null)
    setProducts(prev => prev.filter(p => p._id !== productId))
    toast.success('Product deleted')
  }

  const s = stats || DEMO_STATS

  const STAT_CARDS = [
    { label: 'Total Revenue',  value: `₹${s.revenue?.toLocaleString()}`, icon: DollarSign, color: 'text-gold',  bg: 'bg-gold/10',   change: '+18%' },
    { label: 'Total Orders',   value: s.totalOrders,                      icon: ShoppingBag, color: 'text-sky',  bg: 'bg-sky/10',    change: '+12%' },
    { label: 'Products Listed',value: s.totalProducts,                    icon: Package,     color: 'text-sage', bg: 'bg-sage/10',   change: '+3'   },
    { label: 'Profile Views',  value: s.totalViews?.toLocaleString(),     icon: Eye,         color: 'text-blush',bg: 'bg-blush/10',  change: '+24%' },
  ]

  const TABS = ['overview', 'products', 'orders', 'analytics']

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
    </div>
  )

  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            Seller Dashboard
          </h1>
          <p className={`text-sm mt-0.5 flex items-center gap-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            <Store size={13} className="text-gold" />
            {user?.sellerInfo?.storeName || 'My Store'}
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex gap-0 mb-6 border-b ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium capitalize relative transition-colors
              ${activeTab === tab
                ? `${isDark ? 'text-cream' : 'text-lt_text'} after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-gold after:to-gold2`
                : isDark ? 'text-muted hover:text-cream' : 'text-lt_muted hover:text-lt_text'
              }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview tab ────────────────────────────── */}
      {activeTab === 'overview' && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map(({ label, value, icon: Icon, color, bg, change }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-2xl border p-4 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                    <Icon size={16} className={color} />
                  </div>
                  <span className="text-sage text-[0.65rem] font-semibold">{change}</span>
                </div>
                <div className={`font-serif text-xl font-bold mb-0.5 ${isDark ? 'text-cream' : 'text-lt_text'}`}>{value}</div>
                <div className={`text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>{label}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent orders */}
          <div className={`rounded-2xl border p-5 mb-5 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
            <h2 className={`font-semibold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Recent Orders</h2>
            <div className="flex flex-col gap-2.5">
              {s.recentOrders?.map((order, i) => (
                <div key={order._id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-gray-50 border-lt_border'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-ink text-xs font-bold bg-gradient-to-br from-gold to-ember flex-shrink-0`}>
                    {order.user?.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                      {order.user?.name || 'Customer'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-sm font-bold text-gold2">₹{order.totalPrice?.toLocaleString()}</p>
                    <span className={`text-[0.62rem] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Products tab ─────────────────────────────── */}
      {activeTab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{products.length} products</p>
            <button onClick={openAdd}
              className="flex items-center gap-1.5 text-gold text-sm font-medium hover:underline">
              <Plus size={14} /> Add New
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {products.map((product, i) => (
              <motion.div key={product._id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex gap-4 p-4 rounded-2xl border ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
                <img src={product.images?.[0]} alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = 'https://via.placeholder.com/64' }} />
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold line-clamp-1 ${isDark ? 'text-cream' : 'text-lt_text'}`}>{product.name}</h3>
                  <div className={`flex items-center gap-3 mt-1 text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                    <span className="text-gold2 font-semibold">₹{product.price?.toLocaleString()}</span>
                    <span>Stock: {product.stock}</span>
                    <span className="flex items-center gap-0.5"><Star size={10} className="text-gold2 fill-gold2" /> {product.rating}</span>
                  </div>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[0.62rem] border ${isDark ? 'border-white/[0.1] text-smoke' : 'border-lt_border text-lt_muted'}`}>
                    {product.category}
                  </span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(product)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border
                      ${isDark ? 'border-white/[0.1] text-muted hover:text-cream hover:border-gold/30' : 'border-lt_border text-lt_muted hover:border-gold/30'}`}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(product._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-blush hover:bg-blush/10 border border-blush/20 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Orders tab ───────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className={`rounded-2xl border p-5 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
          <h2 className={`font-semibold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>All Orders</h2>
          <div className="flex flex-col gap-3">
            {[...s.recentOrders, ...s.recentOrders].slice(0, 8).map((order, i) => (
              <div key={`${order._id}_${i}`}
                className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-gray-50 border-lt_border'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-xs font-bold flex-shrink-0">
                  {order.user?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDark ? 'text-cream' : 'text-lt_text'}`}>{order.user?.name}</p>
                  <p className={`text-xs ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                    #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gold2 font-serif font-bold text-sm">₹{order.totalPrice?.toLocaleString()}</p>
                  <span className={`text-[0.62rem] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Analytics tab ────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Revenue chart (visual mockup) */}
          <div className={`rounded-2xl border p-5 col-span-full ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
            <h2 className={`font-semibold mb-4 ${isDark ? 'text-cream' : 'text-lt_text'}`}>Monthly Revenue</h2>
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 55, 80, 70, 90, 85, 95, 75, 100, 88, 110].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-gold to-gold2 transition-all hover:opacity-80"
                    style={{ height: `${h}%` }} />
                  <span className={`text-[0.55rem] ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                    {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {[
            { label: 'Top Product',     value: 'Kashmiri Pashmina', sub: '234 units sold', icon: '🏆' },
            { label: 'Avg Order Value', value: '₹2,017',            sub: '+8% this month',  icon: '📈' },
            { label: 'Return Rate',     value: '2.1%',              sub: 'Below average',   icon: '✅' },
            { label: 'Repeat Customers',value: '68%',               sub: 'Excellent loyalty',icon: '❤️' },
          ].map(card => (
            <div key={card.label} className={`rounded-2xl border p-5 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
              <span className="text-3xl mb-2 block">{card.icon}</span>
              <div className={`font-serif text-2xl font-bold mb-0.5 ${isDark ? 'text-cream' : 'text-lt_text'}`}>{card.value}</div>
              <div className={`text-xs font-medium ${isDark ? 'text-muted' : 'text-lt_muted'}`}>{card.label}</div>
              <div className="text-sage text-xs mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Product Modal ─────────────────── */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAddProduct(false)}>
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl max-h-[90vh] overflow-y-auto
            ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}
            onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-white/[0.07]' : 'border-lt_border'}`}>
              <h2 className={`font-serif text-lg font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowAddProduct(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/[0.05] text-muted hover:text-cream' : 'bg-gray-100 text-lt_muted'}`}>
                <X size={15} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {[
                { key: 'name',         label: 'Product Name *', ph: 'e.g. Handwoven Pashmina Shawl' },
                { key: 'description',  label: 'Description *',  ph: 'Describe your product...', textarea: true },
                { key: 'price',        label: 'Price (₹) *',    ph: '0', type: 'number' },
                { key: 'originalPrice',label: 'Original Price (₹)', ph: '0', type: 'number' },
                { key: 'stock',        label: 'Stock Quantity', ph: '0', type: 'number' },
                { key: 'images.0',     label: 'Image URL',      ph: 'https://images.unsplash.com/...' },
                { key: 'tags',         label: 'Tags (comma-separated)', ph: 'handmade, cotton, premium' },
              ].map(({ key, label, ph, type, textarea }) => {
                const isImages = key === 'images.0'
                const val = isImages ? (form.images?.[0] || '') : form[key] ?? ''
                const onChange = (v) => {
                  if (isImages) setForm(f => ({ ...f, images: [v] }))
                  else setForm(f => ({ ...f, [key]: v }))
                }
                return (
                  <div key={key}>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>{label}</label>
                    {textarea
                      ? <textarea value={val} placeholder={ph} rows={3}
                          onChange={e => onChange(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all ${isDark ? 'bg-ink3 border border-white/[0.07] text-cream placeholder:text-smoke focus:border-gold/40' : 'bg-gray-50 border border-lt_border text-lt_text placeholder:text-lt_muted focus:border-gold/40'}`} />
                      : <input type={type || 'text'} value={val} placeholder={ph}
                          onChange={e => onChange(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${isDark ? 'bg-ink3 border border-white/[0.07] text-cream placeholder:text-smoke focus:border-gold/40' : 'bg-gray-50 border border-lt_border text-lt_text placeholder:text-lt_muted focus:border-gold/40'}`} />
                    }
                  </div>
                )
              })}

              {/* Category */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${isDark ? 'bg-ink3 border border-white/[0.07] text-cream focus:border-gold/40' : 'bg-gray-50 border border-lt_border text-lt_text focus:border-gold/40'}`}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowAddProduct(false)}
                  className={`flex-1 py-3 rounded-xl border text-sm ${isDark ? 'border-white/[0.1] text-dim' : 'border-lt_border text-lt_muted'}`}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

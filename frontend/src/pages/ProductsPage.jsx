import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ProductCard from '../components/product/ProductCard'
import { MOCK_PRODUCTS } from '../utils/mockData'

const CATEGORIES = ['All', 'Fashion', 'Beauty', 'Home Decor', 'Jewellery', 'Food', 'Art', 'Electronics']
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
]

export default function ProductsPage() {
  const { isDark } = useTheme()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort]         = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS]
    if (search)                  list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.includes(search.toLowerCase()))
    )
    if (category !== 'All')      list = list.filter(p => p.category === category)
    if (sort === 'price-low')    list.sort((a, b) => a.price - b.price)
    if (sort === 'price-high')   list.sort((a, b) => b.price - a.price)
    if (sort === 'rating')       list.sort((a, b) => b.rating - a.rating)
    return list
  }, [search, category, sort])

  return (
    <div className="animate-slide-up max-w-3xl mx-auto xl:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`font-serif text-2xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
            Shop All Products
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
            {filtered.length} products found
          </p>
        </div>
        <button onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all
            ${isDark ? 'border-white/[0.1] text-dim hover:text-cream hover:border-gold/30' : 'border-lt_border text-lt_muted hover:border-gold/30'}`}>
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Search bar */}
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 mb-4 transition-all
        ${isDark ? 'bg-ink3 border-white/[0.07] focus-within:border-gold/40 focus-within:shadow-gold' : 'bg-white border-lt_border focus-within:border-gold/40'}`}>
        <Search size={16} className={isDark ? 'text-muted' : 'text-lt_muted'} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products, categories, sellers…"
          className={`flex-1 bg-transparent border-none outline-none text-sm ${isDark ? 'text-cream placeholder:text-smoke' : 'text-lt_text placeholder:text-lt_muted'}`}
        />
        {search && (
          <button onClick={() => setSearch('')} className={isDark ? 'text-smoke hover:text-dim' : 'text-lt_muted'}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`rounded-2xl border p-4 mb-4 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${isDark ? 'text-muted' : 'text-lt_muted'}`}>Sort by</p>
              <div className="flex gap-2 flex-wrap">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setSort(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                      ${sort === opt.value
                        ? 'bg-gradient-to-r from-gold to-gold2 text-ink border-transparent'
                        : isDark ? 'border-white/[0.1] text-dim hover:border-gold/30 hover:text-cream' : 'border-lt_border text-lt_muted hover:border-gold/30'
                      }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border
              ${category === cat
                ? 'bg-gradient-to-r from-gold to-gold2 text-ink border-transparent'
                : isDark ? 'border-white/[0.1] text-muted hover:text-cream hover:border-gold/30' : 'border-lt_border text-lt_muted hover:border-gold/30'
              }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <span className="text-5xl">🔍</span>
          <h3 className={`font-semibold text-lg ${isDark ? 'text-cream' : 'text-lt_text'}`}>No products found</h3>
          <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>Try a different search term or category</p>
          <button onClick={() => { setSearch(''); setCategory('All') }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink text-sm font-semibold">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

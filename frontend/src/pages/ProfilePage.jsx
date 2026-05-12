import { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Edit2, Store, Check,
  Loader2, Camera, LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser, becomeSeller, logout } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [showSeller, setShowSeller] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location?.city || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  })

  const [sellerForm, setSellerForm] = useState({
    storeName: '',
    storeTag: '',
    storeDesc: '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUser(form)
      setEditing(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleBecomeSeller = async (e) => {
    e.preventDefault()

    if (!sellerForm.storeName.trim()) {
      toast.error('Store name required')
      return
    }

    setSaving(true)

    try {
      await becomeSeller(sellerForm)
      setShowSeller(false)
      toast.success('Seller account created!')
      navigate('/seller/dashboard')
    } catch {
      toast.error('Failed to create seller account')
    } finally {
      setSaving(false)
    }
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'YM'

  const locationText =
    user?.location && typeof user.location === 'object'
      ? `${user.location.city || ''}${user.location.state ? `, ${user.location.state}` : ''}`
      : user?.location || 'Location not set'

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm transition-all outline-none ${
    isDark
      ? 'bg-ink3 border border-white/[0.07] text-cream placeholder:text-smoke focus:border-gold/40'
      : 'bg-white border border-lt_border text-lt_text placeholder:text-lt_muted focus:border-gold/40'
  }`

  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <h1 className={`font-serif text-2xl font-bold mb-6 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
        My Profile
      </h1>

      <div className={`rounded-3xl border p-6 mb-5 ${isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'}`}>
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-ember flex items-center justify-center text-ink text-2xl font-bold border-2 border-gold overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {editing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold flex items-center justify-center text-ink">
                <Camera size={13} />
              </button>
            )}
          </div>

          <div className="flex-1">
            <h2 className={`font-serif text-xl font-bold ${isDark ? 'text-cream' : 'text-lt_text'}`}>
              {user?.name}
            </h2>

            <p className={`text-sm ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
              {user?.email}
            </p>

            {user?.isSeller && (
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20">
                <Store size={11} />
                Verified Seller — {user?.sellerInfo?.storeName || 'Your Store'}
              </span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setEditing((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border transition-all ${
                isDark
                  ? 'border-white/[0.1] text-dim hover:text-cream hover:border-gold/30'
                  : 'border-lt_border text-lt_muted hover:border-gold/30'
              }`}
            >
              <Edit2 size={13} />
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>

            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm border border-blush/30 text-blush hover:bg-blush/10 transition-colors"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>

        {editing ? (
          <div className="flex flex-col gap-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', ph: 'Your name' },
              { key: 'bio', label: 'Bio', type: 'text', ph: 'A short bio about you', textarea: true },
              { key: 'location', label: 'Location', type: 'text', ph: 'City' },
              { key: 'phone', label: 'Phone Number', type: 'tel', ph: '10-digit mobile' },
              { key: 'avatar', label: 'Avatar URL', type: 'url', ph: 'https://...' },
            ].map(({ key, label, type, ph, textarea }) => (
              <div key={key}>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                  {label}
                </label>

                {textarea ? (
                  <textarea
                    value={form[key]}
                    placeholder={ph}
                    rows={2}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                ) : (
                  <input
                    type={type}
                    value={form[key]}
                    placeholder={ph}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className={inputClass}
                  />
                )}
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={saving}
              className="py-3 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Mail, label: 'Email', value: user?.email || 'Not set' },
              { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
              { icon: MapPin, label: 'Location', value: locationText },
              { icon: User, label: 'Bio', value: user?.bio || 'No bio yet' },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className={`flex items-start gap-3 p-4 rounded-xl border ${
                  isDark ? 'bg-ink3 border-white/[0.07]' : 'bg-gray-50 border-lt_border'
                }`}
              >
                <Icon size={16} className="text-gold flex-shrink-0 mt-0.5" />

                <div>
                  <p className={`text-xs font-medium ${isDark ? 'text-muted' : 'text-lt_muted'}`}>
                    {label}
                  </p>

                  <p className={`text-sm mt-0.5 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'My Orders', icon: '📦', path: '/orders' },
          { label: 'Wishlist', icon: '❤️', path: '/wishlist' },
          { label: 'Messages', icon: '💬', path: '/messages' },
          ...(user?.isSeller
            ? [{ label: 'Dashboard', icon: '📊', path: '/seller/dashboard' }]
            : [{ label: 'Become Seller', icon: '🏪', action: () => setShowSeller(true) }]),
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => (item.path ? navigate(item.path) : item.action?.())}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:border-gold/30 ${
              isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-xs font-medium ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {showSeller && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSeller(false)}
        >
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
              isDark ? 'bg-ink2 border-white/[0.07]' : 'bg-white border-lt_border'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={`font-serif text-xl font-bold mb-1 ${isDark ? 'text-cream' : 'text-lt_text'}`}>
              Start Selling on YourMart
            </h2>

            <p className={`text-sm mb-5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
              Reach customers and grow your local business.
            </p>

            <form onSubmit={handleBecomeSeller} className="flex flex-col gap-4">
              {[
                { key: 'storeName', label: 'Store Name', ph: 'e.g. Anurag Mart' },
                { key: 'storeTag', label: 'Store Tag Line', ph: 'e.g. Premium local seller' },
                { key: 'storeDesc', label: 'Store Description', ph: 'Tell buyers about your store', textarea: true },
              ].map(({ key, label, ph, textarea }) => (
                <div key={key}>
                  <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-dim' : 'text-lt_muted'}`}>
                    {label}
                  </label>

                  {textarea ? (
                    <textarea
                      value={sellerForm[key]}
                      placeholder={ph}
                      rows={2}
                      onChange={(e) => setSellerForm((f) => ({ ...f, [key]: e.target.value }))}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <input
                      value={sellerForm[key]}
                      placeholder={ph}
                      onChange={(e) => setSellerForm((f) => ({ ...f, [key]: e.target.value }))}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowSeller(false)}
                  className={`flex-1 py-3 rounded-xl border text-sm ${
                    isDark ? 'border-white/[0.1] text-dim' : 'border-lt_border text-lt_muted'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold2 text-ink font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Store size={15} />}
                  {saving ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
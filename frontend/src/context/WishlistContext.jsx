import { createContext, useContext, useEffect, useState } from 'react'
import API from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (user) fetchWishlist()
    else setWishlist([])
  }, [user])

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/wishlist')
      setWishlist(data.wishlist || [])
    } catch {
      // silently fail
    }
  }

  const toggleWishlist = async (product) => {
    if (!user) { toast.error('Please login to save items'); return }
    const isIn = wishlist.some((w) => (w._id || w) === (product._id || product))
    try {
      const { data } = await API.post(`/wishlist/${product._id || product}`)
      if (data.action === 'added') {
        setWishlist((prev) => [...prev, product])
        toast.success('Added to wishlist ♥')
      } else {
        setWishlist((prev) => prev.filter((w) => (w._id || w) !== (product._id || product)))
        toast.success('Removed from wishlist')
      }
    } catch {
      toast.error('Could not update wishlist')
    }
  }

  const isWishlisted = (id) => wishlist.some((w) => (w._id || w) === id)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)

import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  const storageKey = user?.email
    ? `yourmart_wishlist_${user.email}`
    : 'yourmart_wishlist_guest'

  useEffect(() => {
    const savedWishlist = localStorage.getItem(storageKey)

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch {
        setWishlist([])
      }
    }
  }, [storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishlist))
  }, [wishlist, storageKey])

  const toggleWishlist = (product) => {
    if (!user) {
      toast.error('Please login to save items')
      return
    }

    const productId = product?._id || product

    const alreadyExists = wishlist.some(
      (item) => (item?._id || item) === productId
    )

    if (alreadyExists) {
      setWishlist((prev) =>
        prev.filter((item) => (item?._id || item) !== productId)
      )

      toast.success('Removed from wishlist')
    } else {
      setWishlist((prev) => [...prev, product])

      toast.success('Added to wishlist ♥')
    }
  }

  const isWishlisted = (id) => {
    return wishlist.some(
      (item) => (item?._id || item) === id
    )
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
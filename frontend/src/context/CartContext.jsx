import { createContext, useContext, useEffect, useReducer } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.find((i) => i._id === action.item._id)
      if (exists) {
        return state.map((i) =>
          i._id === action.item._id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i._id !== action.id)
    case 'UPDATE_QTY':
      if (action.qty <= 0) return state.filter((i) => i._id !== action.id)
      return state.map((i) =>
        i._id === action.id ? { ...i, qty: action.qty } : i
      )
    case 'CLEAR':
      return []
    case 'LOAD':
      return action.items
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const stored = localStorage.getItem('ym_cart')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('ym_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', item: product })
    toast.success(`${product.name} added to cart ✦`)
  }

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', id })
  }

  const updateQty = (id, qty) => {
    dispatch({ type: 'UPDATE_QTY', id, qty })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR' })
  }

  const cartCount   = cart.reduce((s, i) => s + i.qty, 0)
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, cartCount, cartSubtotal, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

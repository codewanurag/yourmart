import { createContext, useContext, useEffect, useState } from 'react'
import API from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('ym_user')
    const token  = localStorage.getItem('ym_token')
    if (stored && token) {
      setUser(JSON.parse(stored))
      // Verify token is still valid
      API.get('/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    localStorage.setItem('ym_token', data.token)
    localStorage.setItem('ym_user',  JSON.stringify(data.user))
    setUser(data.user)
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
    return data.user
  }

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password })
    localStorage.setItem('ym_token', data.token)
    localStorage.setItem('ym_user',  JSON.stringify(data.user))
    setUser(data.user)
    toast.success(`Welcome to YourMart, ${data.user.name.split(' ')[0]}!`)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('ym_token')
    localStorage.removeItem('ym_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = async (updates) => {
    const { data } = await API.put('/auth/update-profile', updates)
    setUser(data.user)
    localStorage.setItem('ym_user', JSON.stringify(data.user))
    return data.user
  }

  const becomeSeller = async (storeInfo) => {
    const { data } = await API.put('/auth/become-seller', storeInfo)
    setUser(data.user)
    localStorage.setItem('ym_user', JSON.stringify(data.user))
    toast.success('Your seller account is active! 🎉')
    return data.user
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, becomeSeller }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

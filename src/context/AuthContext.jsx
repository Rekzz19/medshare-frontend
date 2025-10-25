import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching profile
          const data = await authAPI.getProfile()
          setUser(data.user)
          setIsAuthenticated(true)
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      
      // Save token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      setUser(data.user)
      setIsAuthenticated(true)
      
      return { success: true, data }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (email, password, name) => {
    try {
      const data = await authAPI.register(email, password, name)
      
      // Save token and user data
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      setUser(data.user)
      setIsAuthenticated(true)
      
      return { success: true, data }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (name) => {
    try {
      const data = await authAPI.updateProfile(name)
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      
      return { success: true, data }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Update failed'
      return { success: false, error: errorMessage }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


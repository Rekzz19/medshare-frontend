import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // log error for debugging
    // you can replace this with your logging service
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <nav className="fixed top-0 left-0 right-0 bg-red-50 border-b border-red-200 py-4 px-6 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-red-700">
            <span>Something went wrong.</span>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Reload
            </button>
          </div>
        </nav>
      )
    }
    return this.props.children
  }
}

function NavContent() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4 px-6 flex items-center justify-between z-50">
      {/* Left: Empty space (keeps layout balanced) */}
      <div className="w-48" />

      {/* Center: Logo / Brand */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide hover:text-blue-700 transition">
          Med<span className="text-red-500">Share</span>
        </Link>
      </div>

      {/* Right: Login & Sign Up OR User Menu */}
      <div className="flex items-center space-x-3">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 text-gray-700 px-3 py-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-red-600 transition px-5 py-2.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-blue-600 transition px-5 py-2.5 rounded-lg hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default function Nav() {
  return (
    <ErrorBoundary>
      <NavContent />
    </ErrorBoundary>
  )
}

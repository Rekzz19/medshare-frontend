import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Donate from './pages/Donate'
import DonationForm from './pages/DonationForm'
import ShareMedicalInfo from './pages/ShareMedicalInfo'
import ConnectWallet from './pages/ConnectWallet'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/donate" element={<Donate />} />
          <Route
            path="/connect-wallet"
            element={
              <ProtectedRoute>
                <ConnectWallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate/form"
            element={
              <ProtectedRoute>
                <DonationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/share-medical-info"
            element={
              <ProtectedRoute>
                <ShareMedicalInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)

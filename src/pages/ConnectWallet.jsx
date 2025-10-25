import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Nav from '../components/Nav'
import { useAuth } from '../context/AuthContext'
import { Wallet, CheckCircle, ArrowLeft, Shield, Zap, Lock } from 'lucide-react'

function ConnectWallet() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const cause = location.state?.cause

  const [selectedWallet, setSelectedWallet] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask wallet',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect with WalletConnect protocol',
      popular: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '💼',
      description: 'Connect using Coinbase Wallet',
      popular: false
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Connect using Trust Wallet',
      popular: false
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'Connect using Phantom wallet',
      popular: false
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      icon: '🌈',
      description: 'Connect using Rainbow wallet',
      popular: false
    }
  ]

  const handleConnectWallet = async (wallet) => {
    setSelectedWallet(wallet.id)
    setConnecting(true)

    // Simulate wallet connection
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
      // Generate a mock wallet address
      setWalletAddress(`0x${Math.random().toString(16).substr(2, 40)}`)
    }, 2000)
  }

  const handleProceedToDonation = () => {
    navigate('/donate/form', { state: { cause, walletAddress } })
  }

  if (connected) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-12">
            <div className="text-center mb-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Wallet Connected! 🎉</h1>
              <p className="text-xl text-gray-600 mb-6">
                Your wallet has been successfully connected to MedShare
              </p>
            </div>

            {/* Wallet Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{wallets.find(w => w.id === selectedWallet)?.icon}</div>
                  <div>
                    <p className="text-sm text-gray-600">Connected Wallet</p>
                    <p className="font-bold text-gray-900">{wallets.find(w => w.id === selectedWallet)?.name}</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Active
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Wallet Address</p>
                <p className="font-mono text-sm text-gray-900 break-all">{walletAddress}</p>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Secure</p>
                <p className="text-xs text-gray-600">End-to-end encrypted</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Fast</p>
                <p className="text-xs text-gray-600">Instant transactions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Private</p>
                <p className="text-xs text-gray-600">Your keys, your crypto</p>
              </div>
            </div>

            {/* Action Buttons */}
            {cause ? (
              <div className="space-y-3">
                <button
                  onClick={handleProceedToDonation}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
                >
                  Proceed to Donation
                </button>
                <p className="text-center text-sm text-gray-600">
                  Continue to donate to <span className="font-semibold">{cause.title}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/donate')}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                >
                  Choose a Cause to Support
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate('/donate')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Support Medical Research
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Connect Your Wallet</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connect your crypto wallet to make secure, transparent donations using blockchain technology. 
                Your contribution will be recorded on-chain for full transparency.
              </p>
            </div>

            {/* Cause Info (if available) */}
            {cause && (
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
                <p className="text-sm text-gray-600 mb-2">You're supporting:</p>
                <div className="flex items-center gap-3">
                  {cause.icon && <cause.icon className="w-8 h-8 text-blue-600" />}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{cause.title}</h3>
                    <p className="text-sm text-gray-600">{cause.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Options */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Choose Your Wallet</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnectWallet(wallet)}
                    disabled={connecting}
                    className={`relative p-6 border-2 rounded-xl text-left transition-all ${
                      connecting && selectedWallet === wallet.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                    } ${connecting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {wallet.popular && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Popular
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{wallet.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{wallet.name}</h3>
                        <p className="text-sm text-gray-600">{wallet.description}</p>
                      </div>
                    </div>
                    {connecting && selectedWallet === wallet.id && (
                      <div className="mt-4 flex items-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-semibold">Connecting...</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Why Connect a Wallet?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span><strong>Transparency:</strong> All donations are recorded on the blockchain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span><strong>Security:</strong> Your funds are protected by blockchain technology</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span><strong>Rewards:</strong> Earn tokenized rewards for your contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span><strong>Control:</strong> You maintain full control of your assets</span>
                </li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">Secure Connection</p>
                <p>
                  MedShare will never ask for your private keys or seed phrase. We only request 
                  permission to view your wallet address and initiate transactions that you approve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConnectWallet


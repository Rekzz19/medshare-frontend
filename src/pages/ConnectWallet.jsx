import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { ArrowLeft, Wallet, CheckCircle } from 'lucide-react'
import { BrowserWalletConnector } from '@concordium/wallet-connectors'

function ConnectWallet() {
  const navigate = useNavigate()
  const [walletAddress, setWalletAddress] = useState('')
  const [accountName, setAccountName] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    setError('')

    try {
      console.log('Connecting wallet...')

      // TODO: Implement Concordium wallet connection here
      // Example structure:
      // 1. Check if Concordium wallet extension is installed
      // 2. Request connection to wallet
      // 3. Get account address and details
      // 4. Store wallet information

      // Placeholder for now - you'll implement the actual connection
      // using @concordium/wallet-connectors package

      // Simulated connection for testing
      setTimeout(() => {
        setIsConnecting(false)
        // Uncomment below when implementing real connection
        // setIsConnected(true)
        // setWalletAddress('4ZJBYQbVp3zVZyjCXfZAAYBVkJMyVj8UKUNj9ox5YqTCBdBq2M')
        // setAccountName('My Concordium Account')
      }, 2000)

    } catch (err) {
      console.error('Wallet connection error:', err)
      setError(err.message || 'Failed to connect wallet')
      setIsConnecting(false)
    }
  }

  const handleSubmit = async (e) => {
    console.log("Inside handleSubmit");
    e.preventDefault();

    if (!walletAddress.trim()) {
      setError('Please enter your wallet address');
      return
    }

    setIsConnecting(true)
    setError('')

    try {
      console.log('Step 1: Creating BrowserWalletConnector...')

      // Create the browser wallet connector
      const connector = await BrowserWalletConnector.create();

      console.log('Step 2: Connector created:', connector)
      console.log('Step 3: Calling connect()...')

      // Connect to the wallet - this returns the account address directly
      const account = await connector.connect();

      console.log('Step 4: Account received:', account)
      console.log('Account type:', typeof account)

      if (!account) {
        throw new Error('No account selected in wallet')
      }

      // Update state with connected wallet info
      setWalletAddress(account)
      setIsConnected(true)
      setIsConnecting(false)

      console.log('✅ Wallet verification successful:');

    } catch (error) {
      console.error('❌ Wallet connection error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)

      // Provide more helpful error messages
      let errorMessage = error.message || 'Failed to connect wallet. Please try again.';

      if (error.message && error.message.includes('another prompt is already open')) {
        errorMessage = 'Another wallet prompt is open. Please close any open wallet popups and try again, or refresh the page.';
      }

      setError(errorMessage)
      setIsConnecting(false)
    }
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/donate')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Success Banner */}
        {isConnected && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-800 font-semibold">
                Wallet successfully connected! Your account is now verified ✓
              </p>
            </div>
          </div>
        )}

        {/* Centered Content */}
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Verify your identity by connecting your Concordium wallet
              </h1>
              <p className="text-gray-600">
                Connect your Concordium Wallet for Web (Chrome extension) to continue
              </p>
            </div>

            {/* Connect Button */}
            <div className="mb-8">
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className={`w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${
                  isConnecting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect Concordium Wallet
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or enter manually</span>
              </div>
            </div>

            {/* Manual Entry Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="walletAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                    Wallet Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="walletAddress"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="4ZJBYQbVp3zVZyjCXfZAAYBVkJMyVj8UKUNj9ox5YqTCBdBq2M"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="accountName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="My Concordium Account"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
                >
                  Verify Wallet
                </button>
              </div>
            </form>

            {/* Info Section */}
            <div className="mt-8 bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">Note:</strong> Make sure you have the Concordium Wallet for Web extension installed in your Chrome browser.
                The wallet connection will request permission to access your account address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConnectWallet


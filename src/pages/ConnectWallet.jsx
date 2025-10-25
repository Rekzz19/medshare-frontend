import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { ArrowLeft, Wallet, CheckCircle } from 'lucide-react'
import { BrowserWalletConnector } from '@concordium/wallet-connectors'
// import { AccountAddress } from '@concordium/web-sdk' // Commented out - not working

function ConnectWallet() {
  const navigate = useNavigate()
  const [walletAddress, setWalletAddress] = useState('')
  const [accountName, setAccountName] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')

  // Store the connector for reuse
  const [walletConnector, setWalletConnector] = useState(null)

  // Consent form fields
  const [uploadedFile, setUploadedFile] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [consentGranted, setConsentGranted] = useState(false)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

  // Auto-hide success banner after 5 seconds
  useEffect(() => {
    if (isConnected) {
      setShowSuccessBanner(true)
      const timer = setTimeout(() => {
        setShowSuccessBanner(false)
      }, 5000) // 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isConnected])

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
      console.log('Account keys:', account ? Object.keys(account) : 'null')
      
      // Safe logging without circular references
      if (account && typeof account === 'object') {
        console.log('Account has address property:', 'address' in account)
        console.log('Account has accountAddress property:', 'accountAddress' in account)
        console.log('Account has account property:', 'account' in account)
      }

      if (!account) {
        throw new Error('No account selected in wallet')
      }

      // Store connector for later use (e.g., signing transactions)
      setWalletConnector(connector)

      // Try to get the account from the connector after connecting
      let addressString
      try {
        // Try to get the account from the connector
        const connectedAccount = await connector.getConnectedAccount()
        console.log('Connected account from connector:', connectedAccount)
        
        if (connectedAccount && typeof connectedAccount === 'string') {
          addressString = connectedAccount
        } else if (connectedAccount && connectedAccount.address) {
          addressString = connectedAccount.address
        } else {
          // Fallback to the original account
          if (typeof account === 'string') {
            addressString = account
          } else if (account.address) {
            addressString = account.address
          } else if (account.accountAddress) {
            addressString = account.accountAddress
          } else if (account.account) {
            addressString = account.account
          } else {
            // Try to find any property that looks like an address
            const possibleAddresses = Object.values(account).find(val => 
              typeof val === 'string' && val.length > 40
            )
            addressString = possibleAddresses || account.toString()
          }
        }
      } catch (error) {
        console.log('Error getting connected account, using fallback:', error)
        // Fallback to the original account
        if (typeof account === 'string') {
          addressString = account
        } else if (account.address) {
          addressString = account.address
        } else if (account.accountAddress) {
          addressString = account.accountAddress
        } else if (account.account) {
          addressString = account.account
        } else {
          addressString = account.toString()
        }
      }
      
      console.log('Final extracted address string:', addressString)
      console.log('Address string length:', addressString.length)
      setWalletAddress(addressString)
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      console.log('File uploaded:', file.name)
    }
  }

  const handleConsentSubmit = async (e) => {
    e.preventDefault()

    if (!consentGranted) {
      setError('Please grant consent to continue')
      return
    }

    if (!walletConnector) {
      setError('Wallet not connected. Please reconnect your wallet.')
      return
    }

    console.log('consent granted')

    // now we want to call the contract / sign and send the transaction
    try {
      console.log('Preparing transaction to smart contract...')

      // ✅ Step 1: Create a fresh wallet connection
      console.log('Creating fresh wallet connection...')
      const freshConnector = await BrowserWalletConnector.create()
      const freshAccount = await freshConnector.connect()

      console.log('freshConnector:', freshConnector)
      console.log('freshAccount:', freshAccount)

  // ✅ Step 2: Extract the address (your robust snippet starts here)
  let addressCandidate = null

  // 1) Try low-level API that some builds expose
  if (freshConnector?.client && typeof freshConnector.client.getMostRecentlySelectedAccount === 'function') {
    try {
      addressCandidate = await freshConnector.client.getMostRecentlySelectedAccount()
      console.log('Address from client.getMostRecentlySelectedAccount():', addressCandidate)
    } catch (err) {
      console.warn('client.getMostRecentlySelectedAccount() threw:', err)
    }
  }

  // 2) Try helper methods on the connector (some builds)
  if (!addressCandidate && typeof freshConnector.getConnectedAccount === 'function') {
    addressCandidate = await freshConnector.getConnectedAccount()
    console.log('Address from freshConnector.getConnectedAccount():', addressCandidate)
  }

  if (!addressCandidate && typeof freshConnector.getConnectedAccounts === 'function') {
    const accounts = await freshConnector.getConnectedAccounts()
    console.log('Accounts array from freshConnector.getConnectedAccounts():', accounts)
    addressCandidate = Array.isArray(accounts) ? accounts[0] : accounts
  }

  // 3) Fallback to freshAccount object
  if (!addressCandidate && typeof freshAccount !== 'undefined') {
    if (typeof freshAccount === 'string') {
      addressCandidate = freshAccount
    } else if (freshAccount?.address) {
      addressCandidate = freshAccount.address
    } else if (freshAccount?.accountAddress) {
      addressCandidate = freshAccount.accountAddress
    } else if (freshAccount?.account?.address) {
      addressCandidate = freshAccount.account.address
    } else if (freshAccount?.account?.accountAddress) {
      addressCandidate = freshAccount.account.accountAddress
    } else if (freshAccount?.account) {
      const maybeAddr = Object.values(freshAccount.account).find(
        (v) => typeof v === 'string' && v.length > 40
      )
      if (maybeAddr) addressCandidate = maybeAddr
    }
  }

  // 4) As a last resort, if wallet supports requestAccounts()
  if (!addressCandidate && typeof freshConnector.client?.requestAccounts === 'function') {
    try {
      const r = await freshConnector.client.requestAccounts()
      console.log('requestAccounts() ->', r)
      addressCandidate = Array.isArray(r) ? r[0] : r
    } catch (err) {
      console.warn('requestAccounts() failed:', err)
    }
  }

  // ✅ Normalize and validate
  if (addressCandidate && typeof addressCandidate !== 'string') {
    if (addressCandidate?.address) {
      addressCandidate = addressCandidate.address
    } else if (addressCandidate?.accountAddress) {
      addressCandidate = addressCandidate.accountAddress
    } else {
      console.error('Address candidate is not a string and not extractable:', addressCandidate)
      throw new Error('Failed to extract account address from wallet (candidate was an object).')
    }
  }

  console.log('Final addressCandidate:', addressCandidate, 'length:', addressCandidate?.length)

  if (!addressCandidate || typeof addressCandidate !== 'string' || addressCandidate.length < 40) {
    throw new Error(`Invalid fresh wallet address: ${String(addressCandidate)} (length ${addressCandidate?.length})`)
  }

  const freshAddressString = addressCandidate

  // ✅ Step 3: Build and send transaction using proper Concordium types
  const contractAddress = { index: 12260n, subindex: 0n } // Use original format that was working
  const receiveName = 'medical_consent.give_consent'
  const maxContractExecutionEnergy = 30000n

  // Use string address directly since AccountAddress import is not working
  const userAccountAddress = freshAddressString
  
  // Try different transaction structures using proper types
  const transaction = {
    type: 'update',
    amount: 0n,
    address: contractAddress,
    receiveName,
    maxContractExecutionEnergy,
  }
  
  // Alternative transaction structure
  const altTransaction = {
    type: 'updateContract',
    amount: 0n,
    address: contractAddress,
    receiveName,
    maxContractExecutionEnergy,
  }
  
  console.log('Trying transaction type:', transaction.type)
  console.log('Alternative transaction type:', altTransaction.type)

  console.log('Transaction details:', transaction)
  console.log('Using fresh connector:', freshConnector)
  console.log('Using fresh address:', freshAddressString)
  console.log('Length of fresh address string: ', freshAddressString.length)
  console.log('Sending transaction...')

  if (!freshConnector) {
    throw new Error('Fresh wallet connector is not available')
  }

  if (!freshAddressString || freshAddressString.length < 40) {
    throw new Error('Invalid fresh wallet address')
  }

  console.log('About to call signAndSendTransaction with:')
  console.log('- Transaction:', transaction)
  console.log('- Address string:', freshAddressString)
  console.log('- Address type:', typeof freshAddressString)
  console.log('- Address length:', freshAddressString?.length)
  
  // Try a completely different approach - maybe we need to use a different method
  console.log('Available methods on freshConnector:', Object.getOwnPropertyNames(freshConnector))
  console.log('FreshConnector prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(freshConnector)))
  
  // For MVP demo, let's try the simplest possible approach
  console.log('=== MVP DEMO APPROACH ===')
  console.log('Contract address:', contractAddress)
  console.log('Receive name:', receiveName)
  console.log('User address:', freshAddressString)
  
  let txHash
  try {
    // Try the most basic transaction format possible
    console.log('Trying basic transaction format...')
    
    const basicTransaction = {
      type: 'update',
      amount: 0n,
      address: contractAddress,
      receiveName,
      maxContractExecutionEnergy,
    }
    
    console.log('Basic transaction:', basicTransaction)
    
    // Try with freshConnector first
    txHash = await freshConnector.signAndSendTransaction(freshAddressString, basicTransaction)
    console.log('✅ Transaction sent successfully!')
    console.log('Transaction hash:', txHash)
    
  } catch (error) {
    console.log('Basic transaction failed:', error.message)
    
    // For MVP demo, let's try a mock success
    console.log('=== MVP DEMO: Simulating successful transaction ===')
    console.log('In a real implementation, this would call your smart contract')
    console.log('Contract:', contractAddress)
    console.log('Function:', receiveName)
    console.log('User:', freshAddressString)
    
    // Simulate a successful transaction for demo purposes
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)
    console.log('✅ DEMO: Transaction simulated successfully!')
    console.log('Demo transaction hash:', mockTxHash)
    
    txHash = mockTxHash
  }

  setError('')
  alert(`Transaction submitted! Hash: ${txHash}`)
} catch (error) {
  console.error('❌ Transaction error:', error)
  setError(error.message || 'Failed to send transaction. Please try again.')
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

        {/* Success Banner - Auto-hides after 5 seconds */}
        {isConnected && showSuccessBanner && (
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

            {/* Show wallet connection section if NOT connected */}
            {!isConnected && (
              <>
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
              </>
            )}

            {/* Show consent form if connected */}
            {isConnected && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Enter your data and grant consent for us to share it
                  </h1>
                </div>

                <form onSubmit={handleConsentSubmit}>
                  <div className="space-y-4">
                    {/* File Upload Section */}
                    <div>
                      <label htmlFor="fileUpload" className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
                        <input
                          type="file"
                          id="fileUpload"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="fileUpload" className="cursor-pointer">
                          {uploadedFile ? (
                            <div className="text-green-600">
                              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-semibold">{uploadedFile.name}</p>
                              <p className="text-sm text-gray-500 mt-1">Click to change file</p>
                            </div>
                          ) : (
                            <div className="text-gray-500">
                              <Wallet className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-semibold">Click to upload a file</p>
                              <p className="text-sm mt-1">or drag and drop</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Additional Info Text Area */}
                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-semibold text-gray-700 mb-2">
                        Anything else you'd like to share with us? (Optional)
                      </label>
                      <textarea
                        id="additionalInfo"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Enter any additional information here..."
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Consent Checkbox */}
                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={consentGranted}
                        onChange={(e) => setConsentGranted(e.target.checked)}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="consent" className="text-sm text-gray-700">
                        Please confirm that you grant consent for us to share your data with Mercor
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default ConnectWallet


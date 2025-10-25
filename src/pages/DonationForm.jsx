import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Nav from '../components/Nav'
import { useAuth } from '../context/AuthContext'
import { CreditCard, DollarSign, Heart, CheckCircle, ArrowLeft } from 'lucide-react'

function DonationForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const cause = location.state?.cause

  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    frequency: 'one-time',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/donate' } })
    }
    if (!cause) {
      navigate('/donate')
    }
  }, [isAuthenticated, cause, navigate])

  const handleAmountSelect = (amount) => {
    setFormData({ ...formData, amount: amount.toString(), customAmount: '' })
  }

  const handleCustomAmount = (e) => {
    setFormData({ ...formData, customAmount: e.target.value, amount: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 2000)
  }

  const getSelectedAmount = () => {
    return formData.customAmount || formData.amount || '0'
  }

  if (!cause) return null

  if (success) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-12 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You! 🎉</h1>
            <p className="text-xl text-gray-600 mb-6">
              Your donation of <span className="font-bold text-green-600">${getSelectedAmount()}</span> to{' '}
              <span className="font-bold text-gray-900">{cause.title}</span> has been processed successfully.
            </p>
            <p className="text-gray-600 mb-8">
              You're making a real difference in advancing medical research. A confirmation email has been sent to{' '}
              <span className="font-semibold">{user?.email}</span>.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/donate')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Donate Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const Icon = cause.icon

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
            Back to Donations
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Cause Info */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className={`bg-linear-to-br ${cause.color} p-4 rounded-xl mb-4`}>
                  <Icon className="w-12 h-12 text-white mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{cause.title}</h2>
                <p className="text-gray-600 mb-4">{cause.description}</p>
                <div className={`${cause.bgColor} p-3 rounded-lg`}>
                  <p className={`text-sm ${cause.iconColor} font-medium`}>
                    💡 {cause.impact}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-bold text-gray-900">{cause.raised}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Goal</span>
                    <span className="font-bold text-gray-900">{cause.goal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Donation Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Donation</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {predefinedAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`py-3 px-4 rounded-lg font-semibold transition ${
                            formData.amount === amount.toString()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        placeholder="Custom amount"
                        value={formData.customAmount}
                        onChange={handleCustomAmount}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Donation Frequency
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, frequency: 'one-time' })}
                        className={`py-3 px-4 rounded-lg font-semibold transition ${
                          formData.frequency === 'one-time'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        One-Time
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, frequency: 'monthly' })}
                        className={`py-3 px-4 rounded-lg font-semibold transition ${
                          formData.frequency === 'monthly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                          formData.paymentMethod === 'card'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        Credit Card
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      placeholder="Leave a message of support..."
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || (!formData.amount && !formData.customAmount)}
                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Donate ${getSelectedAmount()}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Your donation is secure and encrypted. You'll receive a receipt via email.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DonationForm


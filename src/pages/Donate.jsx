import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { useAuth } from '../context/AuthContext'
import { Heart, Stethoscope, Activity, Brain, Eye, Bone, Syringe, Pill, Baby, Users, AlertCircle, X } from 'lucide-react'

function Donate() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedCause, setSelectedCause] = useState(null)

  const donationCauses = [
    {
      id: 'share-medical-info',
      title: 'Share Medical Info',
      icon: Stethoscope,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Share your medical data with doctors and researchers to accelerate breakthroughs',
      impact: 'Your data helps advance medical research and treatments',
      raised: '8.5K',
      goal: '10K',
      isShare: true,
      buttonText: 'Share Now'
    },
    {
      id: 'cancer-research',
      title: 'Cancer Research',
      icon: Activity,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      description: 'Support groundbreaking cancer research and treatment development',
      impact: 'Help fund clinical trials and innovative therapies',
      raised: '$2.4M',
      goal: '$5M'
    },
    {
      id: 'heart-disease',
      title: 'Heart Disease Prevention',
      icon: Heart,
      color: 'from-rose-500 to-red-500',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      description: 'Fund cardiovascular research and prevention programs',
      impact: 'Develop new treatments for heart conditions',
      raised: '$1.8M',
      goal: '$3M'
    },
    {
      id: 'mental-health',
      title: 'Mental Health Support',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Advance mental health research and accessible care',
      impact: 'Provide resources for mental health treatment',
      raised: '$1.2M',
      goal: '$2.5M'
    },
    {
      id: 'diabetes',
      title: 'Diabetes Research',
      icon: Syringe,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Support diabetes prevention and management research',
      impact: 'Find better treatments and potential cures',
      raised: '$980K',
      goal: '$2M'
    },
    {
      id: 'rare-diseases',
      title: 'Rare Diseases',
      icon: Stethoscope,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Help patients with rare and orphan diseases',
      impact: 'Fund research for overlooked conditions',
      raised: '$750K',
      goal: '$1.5M'
    },
    {
      id: 'vision-care',
      title: 'Vision & Eye Care',
      icon: Eye,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      description: 'Prevent blindness and support eye health research',
      impact: 'Restore sight and prevent vision loss',
      raised: '$650K',
      goal: '$1.2M'
    },
    {
      id: 'pediatric-care',
      title: 'Pediatric Care',
      icon: Baby,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      description: 'Support children\'s health research and treatment',
      impact: 'Give children a healthier future',
      raised: '$1.5M',
      goal: '$3M'
    },
    {
      id: 'bone-health',
      title: 'Bone & Joint Health',
      icon: Bone,
      color: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-50',
      iconColor: 'text-slate-600',
      description: 'Research arthritis, osteoporosis, and bone diseases',
      impact: 'Improve mobility and quality of life',
      raised: '$820K',
      goal: '$1.8M'
    },
    {
      id: 'infectious-diseases',
      title: 'Infectious Diseases',
      icon: Pill,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      description: 'Combat infectious diseases and develop vaccines',
      impact: 'Prevent future pandemics and outbreaks',
      raised: '$2.1M',
      goal: '$4M'
    },
    {
      id: 'elderly-care',
      title: 'Elderly Care & Alzheimer\'s',
      icon: Users,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      description: 'Support aging research and Alzheimer\'s treatment',
      impact: 'Improve quality of life for seniors',
      raised: '$1.3M',
      goal: '$2.8M'
    }
  ]

  const handleDonateClick = (cause) => {
    navigate('/connect-wallet');
    // if (!isAuthenticated) {
    //   setSelectedCause(cause)
    //   setShowLoginModal(true)
    // } else {
    //   // Navigate to share form if it's the share card, otherwise wallet connection page
    //   if (cause.isShare) {
    //     navigate('/share-medical-info', { state: { cause } })
    //   } else {
    //     navigate('/connect-wallet', { state: { cause } })
    //   }
    // }
  }

  const handleLoginRedirect = () => {
    navigate('/login', { state: { returnTo: '/donate', selectedCause } })
  }

  const calculateProgress = (raised, goal) => {
    const raisedNum = parseFloat(raised.replace(/[$MK]/g, '')) * (raised.includes('M') ? 1000000 : 1000)
    const goalNum = parseFloat(goal.replace(/[$MK]/g, '')) * (goal.includes('M') ? 1000000 : 1000)
    return (raisedNum / goalNum) * 100
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              💝 Make a Difference
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Support Medical{' '}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Research
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your medical data or donate to fund critical research. Together, we can accelerate
              life-saving breakthroughs. Choose how you want to contribute.
            </p>
          </div>

          {/* Donation Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {donationCauses.map((cause) => {
              const Icon = cause.icon
              const progress = calculateProgress(cause.raised, cause.goal)
              
              return (
                <div
                  key={cause.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
                >
                  {/* Card Header with Gradient */}
                  <div className={`bg-linear-to-br ${cause.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90">Raised</div>
                        <div className="text-2xl font-bold">{cause.raised}</div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{cause.title}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{cause.description}</p>
                    
                    {/* Impact */}
                    <div className={`${cause.bgColor} p-3 rounded-lg mb-4`}>
                      <p className={`text-sm ${cause.iconColor} font-medium`}>
                        💡 {cause.impact}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span className="font-semibold">{cause.goal} goal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`bg-linear-to-r ${cause.color} h-2.5 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progress.toFixed(1)}% funded
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleDonateClick(cause)}
                      className={`w-full bg-linear-to-r ${cause.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105`}
                    >
                      {cause.buttonText || 'Donate Now'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How Your Donation Helps</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">🔬</div>
                <h3 className="font-bold text-gray-900 mb-2">Fund Research</h3>
                <p className="text-sm text-gray-600">Support cutting-edge medical research and clinical trials</p>
              </div>
              <div>
                <div className="text-4xl mb-2">👨‍⚕️</div>
                <h3 className="font-bold text-gray-900 mb-2">Train Professionals</h3>
                <p className="text-sm text-gray-600">Help educate the next generation of healthcare workers</p>
              </div>
              <div>
                <div className="text-4xl mb-2">💊</div>
                <h3 className="font-bold text-gray-900 mb-2">Develop Treatments</h3>
                <p className="text-sm text-gray-600">Accelerate the development of new therapies and cures</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-600">
                Please log in to continue with your donation to{' '}
                <span className="font-semibold text-gray-900">{selectedCause?.title}</span>
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Create Account
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Donate


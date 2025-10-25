import Nav from '../components/Nav'
import { Shield, Users, Award, TrendingUp, Heart, Database, Lock, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <div className="relative bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                About MedShare
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Revolutionizing Healthcare Through{' '}
                <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Data Sharing
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                MedShare is a groundbreaking platform that empowers individuals to contribute their medical data 
                anonymously to accelerate research, improve treatments, and save lives worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that medical data has the power to transform healthcare. By creating a secure, 
                anonymous platform for data sharing, we're building a future where medical breakthroughs 
                happen faster and treatments become more personalized.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every contribution matters. Your data could be the key to discovering the next life-saving 
                treatment or understanding a rare disease better.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-2xl">
                <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-700 font-medium">Active Contributors</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-700 font-medium">Research Partners</div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl">
                <div className="text-4xl font-bold text-indigo-600 mb-2">100M+</div>
                <div className="text-gray-700 font-medium">Data Points Shared</div>
              </div>
              <div className="bg-pink-50 p-6 rounded-2xl">
                <div className="text-4xl font-bold text-pink-600 mb-2">25+</div>
                <div className="text-gray-700 font-medium">Breakthroughs</div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy First</h3>
                <p className="text-gray-600">
                  Your data is encrypted and anonymized. We never share personal information without consent.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
                <p className="text-gray-600">
                  Built by the people, for the people. Every voice matters in shaping the future of healthcare.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Impact Focused</h3>
                <p className="text-gray-600">
                  Every data point contributes to real-world medical breakthroughs and improved treatments.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">How MedShare Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-lg h-full">
                  <div className="text-3xl font-bold mb-2">01</div>
                  <h3 className="text-xl font-bold mb-3">Sign Up</h3>
                  <p className="text-blue-100">Create your secure account in minutes</p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg h-full">
                  <div className="text-3xl font-bold mb-2">02</div>
                  <h3 className="text-xl font-bold mb-3">Share Data</h3>
                  <p className="text-purple-100">Contribute your medical data anonymously</p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-linear-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-2xl shadow-lg h-full">
                  <div className="text-3xl font-bold mb-2">03</div>
                  <h3 className="text-xl font-bold mb-3">Accelerate Research</h3>
                  <p className="text-indigo-100">Your data helps researchers make discoveries</p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-linear-to-br from-pink-500 to-pink-600 text-white p-8 rounded-2xl shadow-lg h-full">
                  <div className="text-3xl font-bold mb-2">04</div>
                  <h3 className="text-xl font-bold mb-3">Earn Rewards</h3>
                  <p className="text-pink-100">Get tokenized rewards for your contributions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Why Choose MedShare?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Bank-Level Encryption</h3>
                  <p className="text-gray-600">Your data is protected with military-grade encryption technology</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Anonymity</h3>
                  <p className="text-gray-600">All personal identifiers are removed before data sharing</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Impact</h3>
                  <p className="text-gray-600">See how your contributions are making a difference</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Transparent Rewards</h3>
                  <p className="text-gray-600">Fair compensation through blockchain-based tokens</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Full Control</h3>
                  <p className="text-gray-600">You decide what to share and can revoke access anytime</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Social Impact</h3>
                  <p className="text-gray-600">Contribute to life-saving research and medical breakthroughs</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of contributors who are helping shape the future of healthcare
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/donate"
                className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition border-2 border-white/20"
              >
                Support Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About


import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Nav from '../components/Nav'
import { useAuth } from '../context/AuthContext'
import { Upload, FileText, CheckCircle, ArrowLeft, X, AlertCircle } from 'lucide-react'

function ShareMedicalInfo() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const cause = location.state?.cause

  const [formData, setFormData] = useState({
    dataType: '',
    condition: '',
    notes: '',
    consent: false
  })

  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const dataTypes = [
    'Medical Records',
    'Lab Results',
    'Imaging (X-rays, MRI, CT scans)',
    'Genetic Testing Results',
    'Treatment History',
    'Medication Records',
    'Vital Signs Data',
    'Wearable Device Data',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
      type: file.type
    }))
    setFiles([...files, ...newFiles])
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate file upload and processing
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 2000)
  }

  if (success) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-12 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You for Sharing! 🎉</h1>
            <p className="text-xl text-gray-600 mb-6">
              Your medical data has been successfully submitted and will be anonymized before being shared with researchers.
            </p>
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h3 className="font-bold text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Your data will be encrypted and anonymized to protect your privacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Researchers will analyze the data to advance medical knowledge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You'll receive updates on how your contribution is making an impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Earn rewards for your valuable contribution to medical research</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-600 mb-8">
              A confirmation has been sent to <span className="font-semibold">{user?.email}</span>.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/donate')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Share More Data
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

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
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
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Share Your Medical Information</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your medical data helps researchers make breakthroughs. All information is encrypted, 
                anonymized, and handled with the highest security standards.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type of Medical Data <span className="text-red-500">*</span>
                </label>
                <select
                  name="dataType"
                  value={formData.dataType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select data type...</option>
                  {dataTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition/Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Condition or Area (Optional)
                </label>
                <input
                  type="text"
                  name="condition"
                  placeholder="e.g., Diabetes, Heart Disease, Cancer, etc."
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Medical Files <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Drag and drop your files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supported formats: PDF, JPG, PNG, DICOM, CSV, TXT (Max 50MB per file)
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.dicom,.csv,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
                  >
                    Browse Files
                  </label>
                </div>

                {/* Uploaded Files List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Uploaded Files:</p>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes or Context (Optional)
                </label>
                <textarea
                  name="notes"
                  placeholder="Provide any additional information that might be helpful for researchers..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">Privacy & Security</p>
                    <p>
                      All uploaded data is encrypted end-to-end and anonymized before sharing. 
                      Personal identifiers are removed to protect your privacy. You can revoke 
                      access to your data at any time from your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  I consent to sharing my anonymized medical data with approved researchers and 
                  understand that my data will be used to advance medical research. I have read 
                  and agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || files.length === 0 || !formData.dataType || !formData.consent}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Share Medical Data
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your data is encrypted and secure. We never sell your information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShareMedicalInfo


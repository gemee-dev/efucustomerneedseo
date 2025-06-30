"use client"

import { useState, useEffect } from "react"

// Simplified AdminDashboard component
function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState("submissions")
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [advertisements, setAdvertisements] = useState([])
  const [showAdModal, setShowAdModal] = useState(false)
  const [editingAd, setEditingAd] = useState(null)
  const [adFormData, setAdFormData] = useState({
    position: '',
    title: '',
    content: '',
    status: 'active'
  })

  useEffect(() => {
    fetchSubmissions()
    fetchStats()
    fetchAdvertisements()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/submissions', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.data || [])
      } else if (response.status === 401) {
        // Token expired or invalid, use fallback data
        setSubmissions([
          {
            id: 1,
            name: 'Sample Submission',
            email: 'sample@example.com',
            service: 'web-development',
            status: 'received',
            description: 'Sample project description',
            created_at: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      // Fallback data
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/dashboard', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.data?.stats || {})
      } else {
        // Use fallback stats
        setStats({
          submissions: { total: 0 },
          users: { total: 0 }
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats({
        submissions: { total: 0 },
        users: { total: 0 }
      })
    }
  }

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch('/api/advertisements')
      if (response.ok) {
        const data = await response.json()
        setAdvertisements(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch advertisements:', error)
    }
  }

  const openDetailModal = (submission) => {
    setSelectedSubmission(submission)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setSelectedSubmission(null)
    setShowDetailModal(false)
  }

  const openAdModal = (ad = null) => {
    if (ad) {
      setEditingAd(ad)
      setAdFormData({
        position: ad.position,
        title: ad.title,
        content: ad.content,
        status: ad.status
      })
    } else {
      setEditingAd(null)
      setAdFormData({
        position: '',
        title: '',
        content: '',
        status: 'active'
      })
    }
    setShowAdModal(true)
  }

  const closeAdModal = () => {
    setShowAdModal(false)
    setEditingAd(null)
    setAdFormData({
      position: '',
      title: '',
      content: '',
      status: 'active'
    })
  }

  const handleAdSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('admin-token')

      if (editingAd) {
        // Update existing ad
        const response = await fetch('/api/advertisements', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id: editingAd._id || editingAd.id,
            ...adFormData
          })
        })

        if (response.ok) {
          const data = await response.json()
          setAdvertisements(prev => prev.map(ad =>
            (ad._id || ad.id) === (editingAd._id || editingAd.id)
              ? data.data
              : ad
          ))
          console.log('✅ Advertisement updated successfully')
        }
      } else {
        // Add new ad
        const response = await fetch('/api/advertisements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(adFormData)
        })

        if (response.ok) {
          const data = await response.json()
          setAdvertisements(prev => [...prev, data.data])
          console.log('✅ Advertisement created successfully')
        }
      }

      closeAdModal()
      // Refresh advertisements list
      fetchAdvertisements()
    } catch (error) {
      console.error('Failed to save advertisement:', error)
      alert('Failed to save advertisement. Please try again.')
    }
  }

  const deleteAd = async (adId) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const token = localStorage.getItem('admin-token')
        const response = await fetch(`/api/advertisements?id=${adId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setAdvertisements(prev => prev.filter(ad => (ad._id || ad.id) !== adId))
          console.log('✅ Advertisement deleted successfully')
        }
      } catch (error) {
        console.error('Failed to delete advertisement:', error)
        alert('Failed to delete advertisement. Please try again.')
      }
    }
  }

  const toggleAdStatus = async (adId) => {
    try {
      const token = localStorage.getItem('admin-token')
      const ad = advertisements.find(a => (a._id || a.id) === adId)
      const newStatus = ad.status === 'active' ? 'inactive' : 'active'

      const response = await fetch('/api/advertisements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: adId,
          status: newStatus
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAdvertisements(prev => prev.map(ad =>
          (ad._id || ad.id) === adId ? data.data : ad
        ))
        console.log(`✅ Advertisement ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      console.error('Failed to toggle advertisement status:', error)
      alert('Failed to update advertisement status. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Efuyegela Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {admin?.name}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("submissions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "submissions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Submissions
              </button>
              <button
                onClick={() => setActiveTab("advertisements")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "advertisements"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Advertisements
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalSubmissions || submissions.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeProjects || submissions.filter(s => s.status === 'received').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Creative Services</dt>
                    <dd className="text-lg font-medium text-gray-900">{submissions.filter(s => s.service?.includes('efuyegela')).length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">D</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Software Projects</dt>
                    <dd className="text-lg font-medium text-gray-900">{submissions.filter(s => s.service?.includes('development')).length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "submissions" && (
          /* Submissions Table */
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Submissions</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest project requests and inquiries</p>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No submissions found
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {submissions.slice(0, 10).map((submission, index) => (
                  <li key={submission.id || index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {submission.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {submission.status || 'received'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="truncate">{submission.email}</span>
                            <span className="mx-2">•</span>
                            <span className="truncate">{submission.service}</span>
                            {submission.budget && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="truncate">{submission.budget}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {submission.description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {submission.description.substring(0, 150)}...
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => openDetailModal(submission)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          </div>
        )}

        {/* Advertisements Tab */}
        {activeTab === "advertisements" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Advertisement Management</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage advertising spaces and campaigns</p>
              </div>
              <button
                onClick={() => openAdModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Advertisement
              </button>
            </div>
            <div className="border-t border-gray-200">
              <div className="p-6">
                {/* Advertisements List */}
                <div className="space-y-4 mb-8">
                  {advertisements.map((ad) => (
                    <div key={ad._id || ad.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{ad.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ad.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {ad.status}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {ad.position}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ad.content}</p>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(ad.created_at).toLocaleDateString()}
                            {ad.updated_at && ad.updated_at !== ad.created_at && (
                              <span> • Updated: {new Date(ad.updated_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => openAdModal(ad)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleAdStatus(ad._id || ad.id)}
                            className={`px-3 py-1 rounded text-sm ${
                              ad.status === 'active'
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {ad.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteAd(ad._id || ad.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advertisement Analytics */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Advertisement Analytics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{advertisements.length}</div>
                      <div className="text-sm text-gray-600">Total Ads</div>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{advertisements.filter(ad => ad.status === 'active').length}</div>
                      <div className="text-sm text-gray-600">Active Ads</div>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">1,234</div>
                      <div className="text-sm text-gray-600">Total Impressions</div>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">$2,450</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Submission Details</h3>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-6">
                {/* Client Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Client Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.email}</p>
                    </div>
                    {selectedSubmission.company && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.company}</p>
                      </div>
                    )}
                    {selectedSubmission.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Project Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service Requested</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.service}</p>
                    </div>
                    {selectedSubmission.budget && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.budget}</p>
                      </div>
                    )}
                    {selectedSubmission.timeline && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Timeline</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.timeline}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service-Specific Information */}
                {(() => {
                  const dynamicFields = [
                    { key: 'tech_stack', label: 'Technology Stack' },
                    { key: 'platform', label: 'Platform' },
                    { key: 'design_style', label: 'Design Style' },
                    { key: 'target_audience', label: 'Target Audience' },
                    { key: 'features', label: 'Key Features' },
                    { key: 'content_type', label: 'Content Type' },
                    { key: 'event_type', label: 'Event Type' },
                    { key: 'consulting_area', label: 'Consulting Area' },
                    { key: 'project_scope', label: 'Project Scope' }
                  ]

                  const hasAnyDynamicField = dynamicFields.some(field => selectedSubmission[field.key])

                  return hasAnyDynamicField ? (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Service-Specific Details</h4>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dynamicFields.map(field =>
                            selectedSubmission[field.key] ? (
                              <div key={field.key}>
                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedSubmission[field.key]}</p>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null
                })()}

                {/* Project Description */}
                {selectedSubmission.description && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Project Description</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.description}</p>
                    </div>
                  </div>
                )}

                {/* Project Files */}
                {(() => {
                  let files = []
                  try {
                    files = selectedSubmission.files ? JSON.parse(selectedSubmission.files) : []
                  } catch (e) {
                    files = []
                  }
                  return files.length > 0 ? (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Project Files</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                              <div className="flex items-center">
                                <svg className="h-5 w-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  View
                                </a>
                                <a
                                  href={file.url}
                                  download={file.name}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null
                })()}

                {/* Status and Actions */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Status & Actions</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                        {selectedSubmission.status || 'New'}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
                        Contact Client
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                        Mark as Reviewed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advertisement Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
              </h3>
            </div>

            <form onSubmit={handleAdSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={adFormData.position}
                  onChange={(e) => setAdFormData({...adFormData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select position</option>
                  <option value="header">Header</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="inline">Inline</option>
                  <option value="footer">Footer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={adFormData.title}
                  onChange={(e) => setAdFormData({...adFormData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={adFormData.content}
                  onChange={(e) => setAdFormData({...adFormData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={adFormData.status}
                  onChange={(e) => setAdFormData({...adFormData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAdModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingAd ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.data.admin)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        setAdmin(data.admin)
        setIsAuthenticated(true)
        // Store token for API calls
        if (data.token) {
          localStorage.setItem('admin-token', data.token)
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setAdmin(null)
      // Clear stored token
      localStorage.removeItem('admin-token')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the admin panel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return <AdminDashboard admin={admin} onLogout={handleLogout} />
}

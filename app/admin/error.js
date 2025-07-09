'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Admin dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Admin Dashboard Error
          </h2>
          <p className="text-gray-600 mb-6">
            Something went wrong loading the admin dashboard.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => reset()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/admin'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Reload Page
            </button>
            
            <a
              href="/api/health"
              target="_blank"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
            >
              Check System Health
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Troubleshooting:</h3>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Check if environment variables are set</li>
              <li>• Verify MongoDB connection</li>
              <li>• Initialize admin users if needed</li>
              <li>• Check Vercel function logs</li>
            </ul>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                {error?.message || 'Unknown error'}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

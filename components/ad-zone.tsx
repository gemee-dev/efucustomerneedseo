"use client"

interface AdZoneProps {
  position: "header" | "sidebar" | "inline" | "footer"
}

export function AdZone({ position }: AdZoneProps) {
  // Mock user role - in real app this would come from auth context
  const userRole = "user" // or "admin"

  // Don't show ads to admin users
  if (userRole === "admin") {
    return null
  }

  const getAdContent = () => {
    switch (position) {
      case "header":
        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center">
            <p className="text-sm font-medium">🚀 Special Offer: 20% off all web development projects this month!</p>
          </div>
        )

      case "sidebar":
        return (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Featured Service</h3>
            <img
              src="/placeholder.svg?height=120&width=200"
              alt="Featured service"
              className="w-full h-24 object-cover rounded mb-2"
            />
            <p className="text-sm text-gray-600 mb-3">
              Get a professional website that converts visitors into customers.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700">
              Learn More
            </button>
          </div>
        )

      case "inline":
        return (
          <div className="bg-gray-50 border rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-4">Book a free 15-minute consultation to discuss your project needs.</p>
            <button className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
              Book Free Consultation
            </button>
          </div>
        )

      case "footer":
        return (
          <div className="bg-gray-900 text-white p-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-4">
                Join over 500+ satisfied clients who trust us with their digital projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700">View Portfolio</button>
                <button className="border border-white text-white py-3 px-6 rounded hover:bg-white hover:text-gray-900">
                  Read Testimonials
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="ad-zone" data-position={position}>
      {getAdContent()}
    </div>
  )
}

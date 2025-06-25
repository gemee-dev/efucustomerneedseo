"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, ArrowRight, Phone, Mail, Globe } from "lucide-react"

export function AdZone({ position }) {
  const [currentAd, setCurrentAd] = useState(0)

  // Mock user role - in real app this would come from auth context
  const userRole = "user" // or "admin"

  // Don't show ads to admin users
  if (userRole === "admin") {
    return null
  }

  // Rotate ads every 10 seconds for sidebar
  useEffect(() => {
    if (position === "sidebar") {
      const interval = setInterval(() => {
        setCurrentAd(prev => (prev + 1) % 3)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [position])

  const getAdContent = () => {
    switch (position) {
      case "header":
        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center">
            <p className="text-sm font-medium">🚀 Special Offer: 20% off all web development projects this month!</p>
          </div>
        )

      case "sidebar":
        const sidebarAds = [
          {
            title: "Web Development",
            description: "Professional websites that convert visitors into customers",
            price: "Starting at $2,999",
            rating: "4.9",
            reviews: "150+",
            icon: Globe,
            color: "from-blue-500 to-cyan-500"
          },
          {
            title: "Mobile Apps",
            description: "Native iOS & Android apps for your business",
            price: "Starting at $4,999",
            rating: "4.8",
            reviews: "89+",
            icon: Phone,
            color: "from-purple-500 to-pink-500"
          },
          {
            title: "Digital Marketing",
            description: "Grow your business with targeted marketing campaigns",
            price: "Starting at $1,499/mo",
            rating: "4.9",
            reviews: "200+",
            icon: Mail,
            color: "from-green-500 to-emerald-500"
          }
        ]

        const ad = sidebarAds[currentAd]
        const IconComponent = ad.icon

        return (
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`bg-gradient-to-r ${ad.color} p-4 text-white`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{ad.title}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{ad.rating}</span>
                    <span>({ad.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                {ad.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  {ad.price}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>2-4 weeks</span>
                </div>
              </div>
              <Button className="w-full group">
                Get Quote
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        )

      case "inline":
        return (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-4">Professional Services</CardTitle>
              <CardDescription className="text-lg text-gray-600 mb-6">
                Get high-quality solutions tailored to your business needs with our professional team.
              </CardDescription>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.9★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24h</div>
                  <div className="text-sm text-gray-600">Response</div>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                View Our Work
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
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

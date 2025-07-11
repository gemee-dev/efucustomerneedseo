"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, ArrowRight, Phone, Mail, Globe } from "lucide-react"

// Google Ads Component
function GoogleAdsSlot({ slot, format = "auto", style = {} }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Google Ads error:', error);
    }
  }, []);

  return (
    <div className="google-ads-container" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your Google AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdZone({ position, enableGoogleAds = true }) {
  const [currentAd, setCurrentAd] = useState(0)
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGoogleAds, setShowGoogleAds] = useState(enableGoogleAds)

  // Mock user role - in real app this would come from auth context
  const userRole = "user" // or "admin"

  // Don't show ads to admin users
  if (userRole === "admin") {
    return null
  }

  // Fetch advertisements from API
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await fetch(`/api/advertisements?position=${position}&status=active&limit=5`)
        if (response.ok) {
          const data = await response.json()
          setAdvertisements(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch advertisements:', error)
        // Fallback to empty array
        setAdvertisements([])
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertisements()
  }, [position])

  // Rotate ads every 10 seconds for sidebar and other positions with multiple ads
  useEffect(() => {
    if (advertisements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAd(prev => (prev + 1) % advertisements.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [advertisements.length])

  // Google Ads content that matches Efuyegela page style
  const getGoogleAdContent = () => {
    switch (position) {
      case "sidebar":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-blue-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-700">Sponsored</h3>
                <p className="text-xs text-blue-600">Advertisement</p>
              </div>
            </div>
            <GoogleAdsSlot
              slot="SIDEBAR_AD_SLOT_ID"
              format="rectangle"
              style={{ minHeight: '250px' }}
            />
          </div>
        )

      case "inline":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-purple-100">
            <div className="text-center mb-4">
              <span className="text-xs text-purple-600 uppercase tracking-wide font-medium">Advertisement</span>
            </div>
            <GoogleAdsSlot
              slot="INLINE_AD_SLOT_ID"
              format="fluid"
              style={{ minHeight: '120px' }}
            />
          </div>
        )

      case "footer":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
            <div className="text-center mb-4">
              <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Advertisement</span>
            </div>
            <GoogleAdsSlot
              slot="FOOTER_AD_SLOT_ID"
              format="horizontal"
              style={{ minHeight: '90px' }}
            />
          </div>
        )

      default:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
            <GoogleAdsSlot
              slot="DEFAULT_AD_SLOT_ID"
              format="auto"
              style={{ minHeight: '100px' }}
            />
          </div>
        )
    }
  }

  const getAdContent = () => {
    if (loading) {
      return (
        <div className="bg-gray-100 p-4 text-center">
          <p className="text-sm text-gray-500">Loading advertisement...</p>
        </div>
      )
    }

    // Show Google Ads if no custom ads available and Google Ads is enabled
    if (advertisements.length === 0 && showGoogleAds) {
      return getGoogleAdContent()
    }

    // Show nothing if no ads at all
    if (advertisements.length === 0) {
      return null
    }

    const currentAdvertisement = advertisements[currentAd] || advertisements[0]

    switch (position) {
      case "header":
        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center">
            <p className="text-sm font-medium">{currentAdvertisement.content}</p>
          </div>
        )

      case "sidebar":
        // Enhanced sidebar ads with fallback design
        const sidebarAdData = {
          title: currentAdvertisement.title,
          description: currentAdvertisement.content,
          price: "Contact for Quote",
          rating: "4.9",
          reviews: "150+",
          icon: Globe,
          color: "from-blue-500 to-cyan-500"
        }

        // Rotate colors based on current ad index
        const colors = [
          "from-blue-500 to-cyan-500",
          "from-purple-500 to-pink-500",
          "from-green-500 to-emerald-500",
          "from-orange-500 to-red-500",
          "from-indigo-500 to-purple-500"
        ]
        sidebarAdData.color = colors[currentAd % colors.length]

        // Rotate icons
        const icons = [Globe, Phone, Mail, Star, ArrowRight]
        sidebarAdData.icon = icons[currentAd % icons.length]

        const ad = sidebarAdData
        const IconComponent = ad.icon

        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
            <div className="p-4">
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
            </div>
          </div>
        )

      case "inline":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-purple-700 mb-4">{currentAdvertisement.title}</h3>
              <p className="text-lg text-gray-600 mb-6">
                {currentAdvertisement.content}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.9</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24h</div>
                  <div className="text-sm text-gray-600">Response</div>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                View Our Work
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )

      case "footer":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentAdvertisement.title}</h3>
            <p className="text-gray-600 mb-4">{currentAdvertisement.content}</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  // Render mixed ads (custom + Google Ads) for better monetization
  const renderMixedAds = () => {
    const hasCustomAds = advertisements.length > 0
    const shouldShowGoogle = showGoogleAds && (position === 'sidebar' || position === 'inline')

    if (hasCustomAds && shouldShowGoogle) {
      // Show both custom and Google ads in rotation
      return (
        <div className="space-y-4">
          {getAdContent()}
          {Math.random() > 0.6 && ( // 40% chance to show Google ad alongside custom ad
            <div className="border-t pt-4">
              {getGoogleAdContent()}
            </div>
          )}
        </div>
      )
    }

    return getAdContent()
  }

  return (
    <div className="ad-zone" data-position={position}>
      {renderMixedAds()}
    </div>
  )
}

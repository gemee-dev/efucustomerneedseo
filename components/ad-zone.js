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
      if (typeof window !== 'undefined') {
        // Initialize adsbygoogle array if it doesn't exist
        window.adsbygoogle = window.adsbygoogle || [];
        // Push the ad configuration
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Google Ads error:', error);
    }
  }, [slot]);

  return (
    <div className="google-ads-container" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', ...style }}
        data-ad-client="ca-pub-1234567890123456" // Replace with your actual Google AdSense publisher ID
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
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <div className="text-center mb-2">
              <span className="text-xs text-blue-600 uppercase tracking-wide font-medium">Advertisement</span>
            </div>
            <GoogleAdsSlot
              slot="1234567890"
              format="rectangle"
              style={{ minHeight: '250px', width: '100%' }}
            />
          </div>
        )

      case "inline":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
            <div className="text-center mb-2">
              <span className="text-xs text-purple-600 uppercase tracking-wide font-medium">Advertisement</span>
            </div>
            <GoogleAdsSlot
              slot="1234567891"
              format="auto"
              style={{ minHeight: '120px', width: '100%' }}
            />
          </div>
        )

      case "footer":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <div className="text-center mb-2">
              <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Advertisement</span>
            </div>
            <GoogleAdsSlot
              slot="1234567892"
              format="horizontal"
              style={{ minHeight: '90px', width: '100%' }}
            />
          </div>
        )

      default:
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <div className="text-center mb-2">
              <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Advertisement</span>
            </div>
            <GoogleAdsSlot
              slot="1234567893"
              format="auto"
              style={{ minHeight: '100px', width: '100%' }}
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
      case "sidebar":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">{currentAdvertisement.title}</h3>
            <p className="text-gray-600 text-sm">{currentAdvertisement.content}</p>
          </div>
        )

      case "inline":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">{currentAdvertisement.title}</h3>
            <p className="text-gray-600 text-sm">{currentAdvertisement.content}</p>
          </div>
        )

      case "footer":
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentAdvertisement.title}</h3>
            <p className="text-gray-600 text-sm">{currentAdvertisement.content}</p>
          </div>
        )

      default:
        return null
    }
  }

  // Render ads - prioritize Google Ads completely
  const renderMixedAds = () => {
    const shouldShowGoogle = showGoogleAds

    // Always show Google Ads when enabled (no portfolio content)
    if (shouldShowGoogle) {
      return getGoogleAdContent()
    }

    // Only show custom admin ads if Google Ads are disabled
    return getAdContent()
  }

  return (
    <div className="ad-zone" data-position={position}>
      {renderMixedAds()}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { EmailVerification } from "@/components/email-verification"
import { SmartForm } from "@/components/smart-form"
import { ThankYouPage } from "@/components/thank-you-page"
import { AdZone } from "@/components/ad-zone"
import { Analytics } from "@/components/analytics"
import { SEOHead } from "@/components/seo-head"
import { BrandingProvider } from "@/components/branding-provider"

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<"email" | "form" | "thankyou">("email")
  const [verifiedEmail, setVerifiedEmail] = useState<string>("")
  const [formData, setFormData] = useState<any>(null)

  // Track page view
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Track form start
      console.log("Form started")
    }
  }, [])

  const handleEmailVerified = (email: string) => {
    setVerifiedEmail(email)
    setCurrentStep("form")
    console.log("Email verified:", email)
  }

  const handleFormSubmitted = (data: any) => {
    setFormData(data)
    setCurrentStep("thankyou")
    console.log("Form completed:", data)
  }

  return (
    <BrandingProvider>
      <SEOHead />
      <Analytics />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header Ad Zone */}
        <AdZone position="header" />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Smart Intake Form</h1>
              <p className="text-lg text-gray-600">Get started with our services in just a few steps</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Ad Zone */}
              <div className="lg:col-span-1">
                <AdZone position="sidebar" />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-xl p-8">
                  {currentStep === "email" && <EmailVerification onVerified={handleEmailVerified} />}

                  {currentStep === "form" && <SmartForm email={verifiedEmail} onSubmit={handleFormSubmitted} />}

                  {currentStep === "thankyou" && <ThankYouPage email={verifiedEmail} formData={formData} />}
                </div>
              </div>
            </div>

            {/* Inline Ad Zone */}
            <div className="mt-8">
              <AdZone position="inline" />
            </div>
          </div>
        </div>

        {/* Footer Ad Zone */}
        <AdZone position="footer" />
      </div>
    </BrandingProvider>
  )
}

"use client"

import { useState, useEffect } from "react"
import { EmailVerification } from "@/components/email-verification"
import { SmartForm } from "@/components/smart-form"
import { ThankYouPage } from "@/components/thank-you-page"
import { AdZone } from "@/components/ad-zone"
import { Analytics } from "@/components/analytics"
import { SEOHead } from "@/components/seo-head"
import { BrandingProvider } from "@/components/branding-provider"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, FileText, CheckCircle, Plus, Sparkles, Users, Clock, Star, ArrowRight, Zap } from "lucide-react"

export default function HomePage() {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [thankYouDialogOpen, setThankYouDialogOpen] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState("")
  const [formData, setFormData] = useState(null)
  const [completedForms, setCompletedForms] = useState([])

  // Track page view
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Track form start
      console.log("Form started")
    }
  }, [])

  const handleEmailVerified = (email) => {
    setVerifiedEmail(email)
    setEmailDialogOpen(false)
    setFormDialogOpen(true)
    console.log("Email verified:", email)
  }

  const handleFormSubmitted = (data) => {
    setFormData(data)
    setFormDialogOpen(false)
    setThankYouDialogOpen(true)
    setCompletedForms(prev => [...prev, { ...data, id: Date.now() }])
    console.log("Form completed:", data)
  }

  const startNewForm = () => {
    setVerifiedEmail("")
    setFormData(null)
    setEmailDialogOpen(true)
  }

  return (
    <BrandingProvider>
      <SEOHead />
      <Analytics />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce">
                <Sparkles className="w-4 h-4" />
                New: Unlimited Popup Forms
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
                Customer Need SEO
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Technology-driven SEO consultancy and digital marketing events to elevate your business.
                <span className="text-blue-600 font-semibold"> Advanced technology, expert guidance.</span>
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">10,000+</span> Users
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">5 min</span> Setup
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">4.9/5</span> Rating
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Ad Zone */}
              <div className="lg:col-span-1 space-y-6">
                <AdZone position="sidebar" />

                {/* Quick Stats Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Forms Completed</span>
                      <Badge variant="secondary">{completedForms.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Sessions</span>
                      <Badge variant="outline">{[emailDialogOpen, formDialogOpen, thankYouDialogOpen].filter(Boolean).length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Get Technology-Based SEO Consultancy</h2>
                    <p className="text-blue-100">Submit your requirements for expert SEO consulting and event services</p>
                  </div>

                  <CardContent className="p-8">
                    {/* Enhanced Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex flex-col items-center gap-1">
                              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                              <span className="font-semibold">Get Consultation</span>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <EmailVerification onVerified={handleEmailVerified} />
                        </DialogContent>
                      </Dialog>

                      {verifiedEmail && (
                        <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="h-16 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                              <div className="flex flex-col items-center gap-1">
                                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Open Project</span>
                              </div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <SmartForm email={verifiedEmail} onSubmit={handleFormSubmitted} />
                          </DialogContent>
                        </Dialog>
                      )}

                      {formData && (
                        <Dialog open={thankYouDialogOpen} onOpenChange={setThankYouDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="h-16 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                              <div className="flex flex-col items-center gap-1">
                                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">View Confirmation</span>
                              </div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <ThankYouPage email={verifiedEmail} formData={formData} />
                          </DialogContent>
                        </Dialog>
                      )}
                  </div>

                  {/* Enhanced Completed Forms List */}
                  {completedForms.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Completed Forms</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {completedForms.length} {completedForms.length === 1 ? 'Form' : 'Forms'}
                        </Badge>
                      </div>
                      <div className="grid gap-4">
                        {completedForms.map((form, index) => (
                          <Card key={form.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-white">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-lg text-gray-900">{form.name}</h4>
                                    <Badge variant="secondary" className="text-xs">
                                      #{String(index + 1).padStart(3, '0')}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 mb-1 font-medium">{form.service}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {new Date(form.submittedAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      {form.email || verifiedEmail}
                                    </span>
                                  </div>
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="hover:bg-green-50 hover:border-green-300 transition-colors group">
                                      <span>View Details</span>
                                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <ThankYouPage email={form.email || verifiedEmail} formData={form} />
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Welcome Message */}
                  {completedForms.length === 0 && (
                    <Card className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <CardContent className="space-y-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full animate-pulse"></div>
                          </div>
                          <Mail className="w-16 h-16 text-blue-600 mx-auto relative z-10" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Customer Need SEO</h3>
                          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Transform your digital presence with our technology-based SEO consultancy and events.
                            <span className="text-blue-600 font-semibold"> Advanced technology solutions and expert guidance for superior search performance.</span>
                          </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
                          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                            <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                            <h4 className="font-semibold text-gray-900">Expert Consultation</h4>
                            <p className="text-sm text-gray-600 text-center">Get technology-driven SEO guidance within 24 hours</p>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                            <Users className="w-8 h-8 text-green-500 mb-2" />
                            <h4 className="font-semibold text-gray-900">SEO Experts</h4>
                            <p className="text-sm text-gray-600 text-center">Work with certified SEO professionals</p>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                            <Star className="w-8 h-8 text-purple-500 mb-2" />
                            <h4 className="font-semibold text-gray-900">Technology-Driven</h4>
                            <p className="text-sm text-gray-600 text-center">Advanced SEO technology and event solutions</p>
                          </div>
                        </div>

                        <Button
                          onClick={startNewForm}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          Get Started Now
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Inline Ad Zone */}
            <div className="mt-8">
              <AdZone position="inline" />
            </div>
          </div>
        </div>
      </div>
    </BrandingProvider>
  )
}

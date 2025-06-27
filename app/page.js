"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { EmailVerification } from "@/components/email-verification"
import { SmartForm } from "@/components/smart-form"
import { BrandingProvider } from "@/components/branding-provider"
import { Mail, FileText, Plus, Sparkles, Users, Clock, Star } from "lucide-react"

export default function HomePage() {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [formDialogOpen, setFormDialogOpen] = useState(false)

  return (
    <BrandingProvider>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
            
            {/* Left Side - Hero Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Creative Ecosystem & Software
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                Efuyegela
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Creative ecosystem solutions and software development for creators and businesses.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm">5,000+ Creators</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-sm">6 Divisions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-sm">Software Dev</span>
                </div>
              </div>

              {/* Quick Services Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="font-semibold text-blue-600">📚 Publishers</div>
                  <div className="text-gray-600">Creative Publishing</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-green-100 hover:shadow-md transition-shadow">
                  <div className="font-semibold text-green-600">🔧 Consultants</div>
                  <div className="text-gray-600">Turn-key Solutions</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-100 hover:shadow-md transition-shadow">
                  <div className="font-semibold text-purple-600">💻 Software</div>
                  <div className="text-gray-600">Custom Development</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-orange-100 hover:shadow-md transition-shadow">
                  <div className="font-semibold text-orange-600">🧠 Intelligence</div>
                  <div className="text-gray-600">Ecosystem Mapping</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <SmartForm onClose={() => setFormDialogOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Mail className="w-4 h-4 mr-2" />
                      Get Updates
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <EmailVerification onClose={() => setEmailDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Right Side - Services Overview */}
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    Creative Ecosystem
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-3">
                    Six specialized divisions supporting creators at every stage of their journey.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Publishers</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Consultants</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Collectives</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Intelligence</span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Events</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">Content</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                    <span className="text-2xl">💻</span>
                    Software Development
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-3">
                    Custom software solutions bringing your creative ideas to life.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Web Apps</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Mobile</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Enterprise</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Creative Tools</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Why Choose Efuyegela
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Complete ecosystem support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Custom software development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Creator-focused solutions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </BrandingProvider>
  )
}

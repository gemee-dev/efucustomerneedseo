"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Shield, CheckCircle, Clock, ArrowRight } from "lucide-react"

export function EmailVerification({ onVerified }) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [generatedOTP, setGeneratedOTP] = useState("")

  const sendOTP = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock OTP
    const mockOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(mockOTP)

    setStep("otp")
    setSuccess(`Verification code sent to your email! (Demo code: ${mockOTP})`)
    setLoading(false)
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (otp === generatedOTP || otp === "123456") {
      onVerified(email)
    } else {
      setError("Invalid verification code. Try 123456 or the generated code.")
    }

    setLoading(false)
  }

  return (
    <Card className="max-w-md mx-auto border-0 shadow-none">
      <CardHeader className="text-center pb-6">
        <div className="relative mx-auto mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center relative">
            {step === "email" ? (
              <Mail className="w-10 h-10 text-blue-600" />
            ) : (
              <Shield className="w-10 h-10 text-green-600" />
            )}
            {step === "otp" && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Sent
                </Badge>
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {step === "email" ? "Verify Your Email" : "Enter Verification Code"}
        </CardTitle>
        <CardDescription className="text-base">
          {step === "email"
            ? "We'll send you a secure 6-digit verification code to get started"
            : (
                <div className="space-y-2">
                  <p>We sent a 6-digit code to</p>
                  <Badge variant="outline" className="font-mono text-sm">
                    {email}
                  </Badge>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Code expires in 10 minutes</span>
                  </div>
                </div>
              )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </AlertDescription>
          </Alert>
        )}

      {step === "email" ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              We'll send a secure verification code to this email address
            </p>
          </div>
          <Button
            onClick={sendOTP}
            disabled={loading || !email}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Code...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Send Verification Code
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Verification Code
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="h-16 text-center text-3xl tracking-[0.5em] font-mono border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
              maxLength={6}
              disabled={loading}
            />
            <div className="text-center space-y-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-mono">
                Demo: {generatedOTP}
              </Badge>
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Verify Code
                  <CheckCircle className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setStep("email")}
              className="w-full h-10 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Change Email
            </Button>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  )
}

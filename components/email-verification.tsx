"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Shield } from "lucide-react"

interface EmailVerificationProps {
  onVerified: (email: string) => void
}

export function EmailVerification({ onVerified }: EmailVerificationProps) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
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
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {step === "email" ? <Mail className="w-8 h-8 text-blue-600" /> : <Shield className="w-8 h-8 text-blue-600" />}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === "email" ? "Verify Your Email" : "Enter Verification Code"}
        </h2>
        <p className="text-gray-600">
          {step === "email"
            ? "We'll send you a verification code to get started"
            : `We sent a 6-digit code to ${email}`}
        </p>
      </div>

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {step === "email" ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="mt-1"
            />
          </div>
          <Button onClick={sendOTP} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Code...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="mt-1 text-center text-2xl tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">Demo: Use {generatedOTP} or 123456</p>
          </div>
          <Button onClick={verifyOTP} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
          <Button variant="outline" onClick={() => setStep("email")} className="w-full">
            Change Email
          </Button>
        </div>
      )}
    </div>
  )
}

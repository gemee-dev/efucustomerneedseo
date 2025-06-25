import { NextResponse } from "next/server"
import { OTP } from "@/lib/models/OTP"
import { User } from "@/lib/models/User"

// Maximum verification attempts
const MAX_VERIFY_ATTEMPTS = 3

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    // Validation
    if (!email || !otp) {
      return NextResponse.json({
        error: "Email and OTP are required"
      }, { status: 400 })
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      return NextResponse.json({
        error: "OTP must be 6 digits"
      }, { status: 400 })
    }

    const storedOTP = await OTP.findByEmail(email)

    if (!storedOTP) {
      return NextResponse.json({
        error: "OTP not found or expired. Please request a new code."
      }, { status: 400 })
    }

    // Check attempts
    if (storedOTP.attempts >= MAX_VERIFY_ATTEMPTS) {
      await OTP.delete(email)
      return NextResponse.json({
        error: "Too many failed attempts. Please request a new code."
      }, { status: 400 })
    }

    // Verify OTP
    if (storedOTP.otp_code !== otp) {
      // Increment attempts
      await OTP.incrementAttempts(email)

      const remainingAttempts = MAX_VERIFY_ATTEMPTS - (storedOTP.attempts + 1)
      return NextResponse.json({
        error: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      }, { status: 400 })
    }

    // OTP is valid - remove from database
    await OTP.delete(email)

    // Mark user as verified if they exist
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      await User.markAsVerified(email)
    }

    // Log successful verification
    console.log(`✅ Email verified successfully: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      email: email,
      verifiedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 })
  }
}

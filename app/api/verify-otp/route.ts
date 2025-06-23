import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for OTPs (use Redis in production)
const otpStore = new Map<string, { otp: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const storedData = otpStore.get(email)

    if (!storedData) {
      return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email)
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    if (storedData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid, remove it from store
    otpStore.delete(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for OTPs (use Redis in production)
const otpStore = new Map<string, { otp: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP
    otpStore.set(email, { otp, expires })

    // Send email (using a mock implementation)
    // In production, use Resend, SendGrid, or Nodemailer
    console.log(`OTP for ${email}: ${otp}`)

    // Mock email sending
    const emailSent = await sendOTPEmail(email, otp)

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  // Mock email sending - replace with actual email service
  try {
    // Example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <h2>Verification Code</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    })
    */

    return true
  } catch (error) {
    console.error("Email sending failed:", error)
    return false
  }
}

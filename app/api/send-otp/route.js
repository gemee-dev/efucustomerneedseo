import { NextResponse } from "next/server"
import { OTP } from "@/lib/models/OTP"
import { User } from "@/lib/models/User"
import { initializeDatabase } from "@/lib/db"
import nodemailer from "nodemailer"

// Rate limiting storage (in production, use Redis)
const rateLimitStorage = new Map()

// Initialize database on first load
initializeDatabase().catch(console.error)

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 3
const OTP_EXPIRY = 10 * 60 * 1000 // 10 minutes

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function isRateLimited(email) {
  const now = Date.now()
  const userAttempts = rateLimitStorage.get(email) || []

  // Remove old attempts outside the window
  const recentAttempts = userAttempts.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW)

  if (recentAttempts.length >= MAX_ATTEMPTS_PER_WINDOW) {
    return true
  }

  // Update storage with recent attempts
  recentAttempts.push(now)
  rateLimitStorage.set(email, recentAttempts)
  return false
}

async function sendEmailOTP(email, otp) {
  try {
    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email template
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@smartforms.com',
      to: email,
      subject: 'Your Verification Code - Smart Forms',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Smart Forms</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0;">Verification Code</p>
          </div>

          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Your verification code is:</h2>

            <div style="background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <span style="font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 8px; font-family: monospace;">${otp}</span>
            </div>

            <p style="margin: 20px 0; color: #666;">This code will expire in <strong>10 minutes</strong>.</p>

            <p style="margin: 20px 0; color: #666;">If you didn't request this code, please ignore this email.</p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              This email was sent from Smart Forms. Please do not reply to this email.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Your Smart Forms verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`
    }

    // Send email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions)
      console.log(`📧 OTP email sent to ${email}`)
    } else {
      console.log(`📧 Demo mode - OTP for ${email}: ${otp}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error.message }
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Rate limiting
    if (isRateLimited(email)) {
      return NextResponse.json({
        error: "Too many attempts. Please try again later.",
        retryAfter: 60
      }, { status: 429 })
    }

    // Generate OTP
    const otp = OTP.generateOTP()
    const expiresAt = OTP.getExpiryTime(10) // 10 minutes

    // Store OTP in database
    await OTP.create(email, otp, expiresAt)

    // Send email
    const emailResult = await sendEmailOTP(email, otp)

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
      expiresIn: 600, // 10 minutes in seconds
      // Show OTP in development mode only
      ...(process.env.NODE_ENV === 'development' && {
        demo: {
          otp: otp,
          note: "OTP shown in development mode only"
        }
      })
    })

  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 })
  }
}



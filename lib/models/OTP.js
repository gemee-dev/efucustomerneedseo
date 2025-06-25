import { connectToMongoose } from '../mongodb.js'
import { OTP as OTPModel } from '../schemas/index.js'

// In-memory fallback for development when MongoDB is not available
// Use global to persist across requests in development
if (!global.inMemoryOTPs) {
  global.inMemoryOTPs = new Map()
}
const inMemoryOTPs = global.inMemoryOTPs

export class OTP {
  static async create(email, otpCode, expiresAt) {
    try {
      await connectToMongoose()

      // Delete any existing OTPs for this email first
      await OTPModel.deleteMany({ email })

      const otp = new OTPModel({
        email,
        otp_code: otpCode,
        expires_at: expiresAt,
        attempts: 0
      })

      const savedOTP = await otp.save()
      return savedOTP.toObject()
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory OTP storage')
      const otp = {
        _id: Date.now(),
        email,
        otp_code: otpCode,
        expires_at: expiresAt,
        attempts: 0,
        created_at: new Date().toISOString()
      }
      inMemoryOTPs.set(email, otp)
      console.log(`📧 OTP stored in memory for ${email}: ${otpCode}`)
      return otp
    }
  }

  static async findByEmail(email) {
    try {
      await connectToMongoose()

      const otp = await OTPModel.findOne({
        email,
        expires_at: { $gt: new Date() }
      }).lean()

      return otp || null
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory OTP storage')
      const otp = inMemoryOTPs.get(email)
      if (otp && new Date(otp.expires_at) > new Date()) {
        return otp
      }
      return null
    }
  }

  static async verify(email, otpCode) {
    try {
      const result = await query(
        `SELECT * FROM otps
         WHERE email = $1 AND otp_code = $2 AND expires_at > NOW()`,
        [email, otpCode]
      )

      return result.rows[0] || null
    } catch (error) {
      // Fallback to in-memory storage
      const otp = inMemoryOTPs.get(email)
      if (otp && otp.otp_code === otpCode && new Date(otp.expires_at) > new Date()) {
        return otp
      }
      return null
    }
  }

  static async incrementAttempts(email) {
    try {
      const result = await query(
        `UPDATE otps
         SET attempts = attempts + 1
         WHERE email = $1
         RETURNING *`,
        [email]
      )

      return result.rows[0]
    } catch (error) {
      // Fallback to in-memory storage
      const otp = inMemoryOTPs.get(email)
      if (otp) {
        otp.attempts = (otp.attempts || 0) + 1
        inMemoryOTPs.set(email, otp)
        return otp
      }
      return null
    }
  }

  static async delete(email) {
    try {
      const result = await query(
        'DELETE FROM otps WHERE email = $1 RETURNING *',
        [email]
      )

      return result.rows[0]
    } catch (error) {
      // Fallback to in-memory storage
      const otp = inMemoryOTPs.get(email)
      if (otp) {
        inMemoryOTPs.delete(email)
        return otp
      }
      return null
    }
  }

  static async cleanup() {
    const result = await query('DELETE FROM otps WHERE expires_at < NOW()')
    return result.rowCount
  }

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  static getExpiryTime(minutes = 10) {
    const expiry = new Date()
    expiry.setMinutes(expiry.getMinutes() + minutes)
    return expiry
  }
}

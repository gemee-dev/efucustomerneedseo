import { query } from '../db.js'

export class OTP {
  static async create(email, otpCode, expiresAt) {
    // Delete any existing OTPs for this email first
    await query('DELETE FROM otps WHERE email = $1', [email])
    
    const result = await query(
      `INSERT INTO otps (email, otp_code, expires_at) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [email, otpCode, expiresAt]
    )

    return result.rows[0]
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM otps WHERE email = $1 AND expires_at > NOW()',
      [email]
    )

    return result.rows[0] || null
  }

  static async verify(email, otpCode) {
    const result = await query(
      `SELECT * FROM otps 
       WHERE email = $1 AND otp_code = $2 AND expires_at > NOW()`,
      [email, otpCode]
    )

    return result.rows[0] || null
  }

  static async incrementAttempts(email) {
    const result = await query(
      `UPDATE otps 
       SET attempts = attempts + 1 
       WHERE email = $1 
       RETURNING *`,
      [email]
    )

    return result.rows[0]
  }

  static async delete(email) {
    const result = await query(
      'DELETE FROM otps WHERE email = $1 RETURNING *',
      [email]
    )

    return result.rows[0]
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

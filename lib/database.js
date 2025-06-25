// Simple in-memory database for demo purposes
// In production, use PostgreSQL, MongoDB, or other database

class InMemoryDatabase {
  constructor() {
    this.users = new Map()
    this.submissions = new Map()
    this.otps = new Map()
    this.files = new Map()
    this.bookings = new Map()
    this.analytics = {
      totalSubmissions: 0,
      totalUsers: 0,
      submissionsByService: {},
      submissionsByDate: {}
    }
  }

  // User operations
  createUser(userData) {
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.users.set(user.id, user)
    this.analytics.totalUsers++
    return user
  }

  getUserByEmail(email) {
    for (const [id, user] of this.users) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  // Submission operations
  createSubmission(submissionData) {
    const submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...submissionData,
      status: 'received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.submissions.set(submission.id, submission)
    
    // Update analytics
    this.analytics.totalSubmissions++
    
    const service = submission.service || 'unknown'
    this.analytics.submissionsByService[service] = 
      (this.analytics.submissionsByService[service] || 0) + 1
    
    const date = new Date().toISOString().split('T')[0]
    this.analytics.submissionsByDate[date] = 
      (this.analytics.submissionsByDate[date] || 0) + 1
    
    return submission
  }

  getSubmission(id) {
    return this.submissions.get(id)
  }

  getSubmissionsByEmail(email) {
    const userSubmissions = []
    for (const [id, submission] of this.submissions) {
      if (submission.email === email) {
        userSubmissions.push(submission)
      }
    }
    return userSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getAllSubmissions() {
    return Array.from(this.submissions.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  updateSubmissionStatus(id, status) {
    const submission = this.submissions.get(id)
    if (submission) {
      submission.status = status
      submission.updatedAt = new Date().toISOString()
      return submission
    }
    return null
  }

  // OTP operations
  storeOTP(email, otpData) {
    this.otps.set(email, {
      ...otpData,
      createdAt: new Date().toISOString()
    })
  }

  getOTP(email) {
    return this.otps.get(email)
  }

  deleteOTP(email) {
    return this.otps.delete(email)
  }

  // File operations
  storeFile(fileData) {
    const file = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...fileData,
      uploadedAt: new Date().toISOString()
    }
    this.files.set(file.id, file)
    return file
  }

  getFile(id) {
    return this.files.get(id)
  }

  // Calendar booking operations
  createBooking(bookingData) {
    const booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...bookingData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }
    this.bookings.set(booking.id, booking)
    return booking
  }

  getBooking(id) {
    return this.bookings.get(id)
  }

  getBookingsByEmail(email) {
    const userBookings = []
    for (const [id, booking] of this.bookings) {
      if (booking.email === email) {
        userBookings.push(booking)
      }
    }
    return userBookings.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  }

  // Analytics
  getAnalytics() {
    return {
      ...this.analytics,
      recentSubmissions: Array.from(this.submissions.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
      topServices: Object.entries(this.analytics.submissionsByService)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    }
  }

  // Cleanup expired data
  cleanup() {
    const now = Date.now()
    const OTP_EXPIRY = 10 * 60 * 1000 // 10 minutes

    // Clean expired OTPs
    for (const [email, otpData] of this.otps) {
      if (now - new Date(otpData.createdAt).getTime() > OTP_EXPIRY) {
        this.otps.delete(email)
      }
    }
  }
}

// Create singleton instance
const db = new InMemoryDatabase()

// Run cleanup every 5 minutes
setInterval(() => {
  db.cleanup()
}, 5 * 60 * 1000)

export default db

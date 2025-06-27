import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  last_login: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  verified_at: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp_code: {
    type: String,
    required: true,
    length: 6
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

// Submission Schema
const submissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    required: true,
    enum: [
      // Efuyegela Core Divisions
      'efuyegela-publishers',
      'efuyegela-consultants',
      'efuyegela-collectives',
      'efuyegela-intelligence',
      'efuyegela-events',
      'efuyegela-content',
      // Software Development Services
      'software-development',
      'web-development',
      'mobile-development',
      'enterprise-software',
      'creative-software',
      // Additional Creative Services
      'creative-funding',
      'market-development',
      'custom-creative-solutions',
      // Legacy SEO services for backward compatibility
      'seo-technology-consulting',
      'digital-marketing-events',
      'seo-strategy-consulting',
      'technical-seo-consulting',
      'seo-training-events',
      'technology-implementation',
      'seo-audit-consulting',
      'digital-transformation',
      'custom-consulting'
    ]
  },
  budget: {
    type: String,
    enum: ['under-500', '500-1k', '1k-3k', '3k-5k', '5k-10k', '10k+', 'custom']
  },
  timeline: {
    type: String,
    enum: ['asap', '1-2 weeks', '1-2 months', '3-6 months', '6+ months', 'flexible']
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['received', 'in_progress', 'completed', 'cancelled'],
    default: 'received'
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Create models
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)
export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema)
export const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema)

export default {
  Admin,
  User,
  OTP,
  Submission
}

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
    enum: ['under-5k', '5k-15k', '15k-50k', '50k-plus', 'discuss']
  },
  timeline: {
    type: String,
    enum: ['asap', '1-month', '3-months', '6-months', 'flexible']
  },
  description: {
    type: String,
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
  files: {
    type: String, // JSON string of file array
    default: '[]'
  },
  // Dynamic fields based on service type
  tech_stack: {
    type: String,
    trim: true
  },
  platform: {
    type: String,
    trim: true
  },
  design_style: {
    type: String,
    trim: true
  },
  target_audience: {
    type: String,
    trim: true
  },
  features: {
    type: String,
    trim: true
  },
  content_type: {
    type: String,
    trim: true
  },
  event_type: {
    type: String,
    trim: true
  },
  consulting_area: {
    type: String,
    trim: true
  },
  project_scope: {
    type: String,
    trim: true
  },
  // Web Development specific fields
  frontend_framework: {
    type: String,
    trim: true
  },
  backend_language: {
    type: String,
    trim: true
  },
  backend_framework: {
    type: String,
    trim: true
  },
  database: {
    type: String,
    trim: true
  },
  web_features: {
    type: String,
    trim: true
  },
  hosting: {
    type: String,
    trim: true
  },
  // Mobile Development specific fields
  mobile_stack: {
    type: String,
    trim: true
  },
  target_platforms: {
    type: String,
    trim: true
  },
  app_type: {
    type: String,
    trim: true
  },
  mobile_features: {
    type: String,
    trim: true
  },
  backend_integration: {
    type: String,
    trim: true
  },
  app_store_deployment: {
    type: String,
    trim: true
  },
  // Software Development specific fields
  software_type: {
    type: String,
    trim: true
  },
  programming_language: {
    type: String,
    trim: true
  },
  target_platform: {
    type: String,
    trim: true
  },
  software_features: {
    type: String,
    trim: true
  },
  integration_needs: {
    type: String,
    trim: true
  },
  performance_requirements: {
    type: String,
    trim: true
  },
  // Publishers specific fields
  content_genre: {
    type: String,
    trim: true
  },
  content_length: {
    type: String,
    trim: true
  },
  distribution_channels: {
    type: String,
    trim: true
  },
  // Consultants specific fields
  business_stage: {
    type: String,
    trim: true
  },
  team_size: {
    type: String,
    trim: true
  },
  current_challenges: {
    type: String,
    trim: true
  },
  success_metrics: {
    type: String,
    trim: true
  },
  // Events specific fields
  event_format: {
    type: String,
    trim: true
  },
  attendee_count: {
    type: String,
    trim: true
  },
  event_duration: {
    type: String,
    trim: true
  },
  event_goals: {
    type: String,
    trim: true
  },
  special_requirements: {
    type: String,
    trim: true
  },
  // Enterprise Software specific fields
  company_size: {
    type: String,
    trim: true
  },
  current_systems: {
    type: String,
    trim: true
  },
  security_requirements: {
    type: String,
    trim: true
  },
  scalability_needs: {
    type: String,
    trim: true
  },
  submitted_at: {
    type: Date,
    default: Date.now
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

// Advertisement Schema
const advertisementSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
    enum: ['header', 'sidebar', 'inline', 'footer'],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
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
export const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema)

export default {
  Admin,
  User,
  OTP,
  Submission
}

import { Pool } from 'pg'

// Database connection configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'smart_forms',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: process.env.POSTGRES_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err)
})

// Database query helper
export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('📊 Query executed', { text: text.substring(0, 50), duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('❌ Database query error:', error)
    throw error
  }
}

// Transaction helper
export async function transaction(callback) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Database initialization
export async function initializeDatabase() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        company VARCHAR(255),
        phone VARCHAR(50),
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create submissions table
    await query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        service VARCHAR(255) NOT NULL,
        budget VARCHAR(100),
        timeline VARCHAR(100),
        description TEXT NOT NULL,
        phone VARCHAR(50),
        website VARCHAR(255),
        status VARCHAR(50) DEFAULT 'received',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create otps table
    await query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp_code VARCHAR(6) NOT NULL,
        attempts INTEGER DEFAULT 0,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create files table
    await query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES submissions(id),
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        file_path VARCHAR(500),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create bookings table
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES submissions(id),
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        scheduled_at TIMESTAMP NOT NULL,
        duration INTEGER DEFAULT 30,
        meeting_type VARCHAR(50) DEFAULT 'consultation',
        status VARCHAR(50) DEFAULT 'scheduled',
        meeting_link VARCHAR(500),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create analytics table
    await query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        user_email VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)`)

    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}

// Cleanup expired OTPs
export async function cleanupExpiredOTPs() {
  try {
    const result = await query('DELETE FROM otps WHERE expires_at < NOW()')
    console.log(`🧹 Cleaned up ${result.rowCount} expired OTPs`)
  } catch (error) {
    console.error('❌ OTP cleanup failed:', error)
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000)

export default pool

#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this script to set up the PostgreSQL database for Customer Need SEO
 */

import { initializeDatabase } from '../lib/db.js'

async function main() {
  console.log('🚀 Initializing Customer Need SEO database...')
  
  try {
    await initializeDatabase()
    console.log('✅ Database initialization completed successfully!')
    console.log('')
    console.log('📋 Database tables created:')
    console.log('  - users')
    console.log('  - submissions') 
    console.log('  - otps')
    console.log('  - files')
    console.log('  - bookings')
    console.log('  - analytics')
    console.log('')
    console.log('🔍 Indexes created for optimal performance')
    console.log('')
    console.log('🎉 Your database is ready to use!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:')
    console.error(error.message)
    process.exit(1)
  }
  
  process.exit(0)
}

main()

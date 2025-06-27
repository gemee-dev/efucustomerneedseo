// Quick Admin Dashboard Test
async function quickAdminTest() {
  console.log('🔍 Quick Admin Dashboard Test...\n')
  
  const baseURL = 'http://localhost:3002'
  
  // Wait a moment for server to be ready
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  try {
    const response = await fetch(`${baseURL}/admin`)
    console.log(`📊 Admin Dashboard Status: ${response.status} ${response.statusText}`)
    
    if (response.status === 404) {
      console.log('❌ Still getting 404 - investigating further...')
    } else if (response.ok) {
      console.log('✅ Admin dashboard now working!')
    } else {
      console.log(`⚠️ Admin dashboard returns ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

quickAdminTest().catch(console.error)

// Test gbonsa admin login
async function testGbonsaLogin() {
  const baseURL = 'http://localhost:3000'
  
  console.log('🧪 Testing gbonsa Admin Login...\n')
  
  try {
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'gbonsa2@gmail.com', 
        password: 'gemegold*0913' 
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('✅ gbonsa Admin Login Response:', loginData)
    
    if (loginData.success) {
      console.log('🎉 Login successful!')
      console.log(`👤 Welcome ${loginData.admin.name}!`)
      console.log(`🔐 Role: ${loginData.admin.role}`)
      console.log(`📧 Email: ${loginData.admin.email}`)
    } else {
      console.log('❌ Login failed:', loginData.error)
    }
    
  } catch (error) {
    console.log('❌ Login Error:', error.message)
  }
}

// Run the test
testGbonsaLogin().catch(console.error)

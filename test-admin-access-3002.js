// Test Admin Dashboard Access on Port 3002
async function testAdminAccess() {
  console.log('🔐 Testing Admin Dashboard Access on Port 3002...\n')
  
  const baseURL = 'http://localhost:3002'
  
  // Test Admin Login
  console.log('1. Testing Admin Login')
  try {
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gbonsa2@gmail.com',
        password: 'gemegold*0913'
      })
    })
    
    const loginData = await loginResponse.json()
    if (loginData.success) {
      console.log('✅ Login successful!')
      console.log(`👤 Welcome ${loginData.admin.name}`)
      console.log(`🔐 Role: ${loginData.admin.role}`)
      console.log(`📧 Email: ${loginData.admin.email}`)
      
      const token = loginData.token
      console.log(`🎫 Token received: ${token ? 'Yes' : 'No'}`)
      
      // Test Dashboard Access
      console.log('\n2. Testing Dashboard Access')
      const dashboardResponse = await fetch(`${baseURL}/api/admin/dashboard`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const dashboardData = await dashboardResponse.json()
      if (dashboardData.success) {
        console.log('✅ Dashboard accessible!')
        console.log('📊 Dashboard data received')
      } else {
        console.log('❌ Dashboard access failed:', dashboardData.error)
      }
      
      // Test Submissions Access
      console.log('\n3. Testing Submissions Access')
      const submissionsResponse = await fetch(`${baseURL}/api/admin/submissions`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const submissionsData = await submissionsResponse.json()
      if (submissionsData.success) {
        console.log('✅ Submissions accessible!')
        console.log(`📝 Submissions count: ${submissionsData.data.length}`)
      } else {
        console.log('❌ Submissions access failed:', submissionsData.error)
      }
      
    } else {
      console.log('❌ Login failed:', loginData.error)
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
  
  console.log('\n🎯 Test Complete!')
  console.log(`🌐 Admin Dashboard: ${baseURL}/admin`)
  console.log(`🔐 Your Credentials: gbonsa2@gmail.com / gemegold*0913`)
}

// Run the test
testAdminAccess().catch(console.error)

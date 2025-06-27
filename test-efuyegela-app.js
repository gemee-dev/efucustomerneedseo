// Test Efuyegela Application
async function testEfuyegelaApp() {
  console.log('🧪 Testing Efuyegela Application...\n')
  
  const baseURL = 'http://localhost:3002'
  
  // Test 1: Admin Login with new credentials
  console.log('1. Testing Admin Login with Efuyegela credentials')
  try {
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gemechu@efuyegela.com',
        password: 'admin123!@#'
      })
    })
    
    const loginData = await loginResponse.json()
    if (loginData.success) {
      console.log('✅ Efuyegela admin login successful!')
      console.log(`👤 Welcome ${loginData.admin.name}`)
      console.log(`📧 Email: ${loginData.admin.email}`)
      
      const token = loginData.token
      
      // Test 2: Dashboard Access
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
      
      // Test 3: Submissions with Efuyegela services
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
        console.log(`📝 Total submissions: ${submissionsData.data.length}`)
        if (submissionsData.data.length > 0) {
          console.log('📋 Efuyegela submissions:')
          submissionsData.data.slice(0, 5).forEach((sub, index) => {
            console.log(`   ${index + 1}. ${sub.name} - ${sub.service} (${sub.status})`)
          })
        }
      } else {
        console.log('❌ Submissions access failed:', submissionsData.error)
      }
      
    } else {
      console.log('❌ Login failed:', loginData.error)
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
  
  // Test 4: New Service Submission
  console.log('\n4. Testing New Efuyegela Service Submission')
  try {
    const formData = {
      email: 'test.creator@example.com',
      name: 'Test Creator',
      company: 'Creative Test Studio',
      service: 'efuyegela-collectives',
      budget: '1k-3k',
      timeline: '1-2 months',
      description: 'Looking to join the diverse community ecosystem and connect with other creators.',
      phone: '123-456-7890',
      website: 'https://creativeteststudio.com'
    }
    
    const submitResponse = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    const submitData = await submitResponse.json()
    if (submitData.success) {
      console.log('✅ Efuyegela service submission successful!')
      console.log('📝 Service:', formData.service)
      console.log('👤 Creator:', formData.name)
    } else {
      console.log('❌ Submission failed:', submitData.error)
    }
  } catch (error) {
    console.log('❌ Submission test error:', error.message)
  }
  
  // Test 5: OTP System
  console.log('\n5. Testing OTP System')
  try {
    const otpResponse = await fetch(`${baseURL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'creator.test@efuyegela.com'
      })
    })
    
    const otpData = await otpResponse.json()
    if (otpData.success) {
      console.log('✅ OTP system working!')
      console.log('📧 OTP sent to:', 'creator.test@efuyegela.com')
      if (otpData.demo && otpData.demo.otp) {
        console.log('🔢 Demo OTP:', otpData.demo.otp)
      }
    } else {
      console.log('❌ OTP failed:', otpData.error)
    }
  } catch (error) {
    console.log('❌ OTP test error:', error.message)
  }
  
  console.log('\n🎯 Efuyegela Application Test Complete!')
  console.log('\n📋 Access Information:')
  console.log(`🌐 Main Application: ${baseURL}`)
  console.log(`🔐 Admin Dashboard: ${baseURL}/admin`)
  console.log('\n👥 Admin Credentials:')
  console.log('🔐 gbonsa2@gmail.com / gemegold*0913 (Super Admin)')
  console.log('🔐 gemechu@efuyegela.com / admin123!@# (Super Admin)')
  console.log('🔐 daniel@efuyegela.com / admin123!@# (Admin)')
  
  console.log('\n🎨 Efuyegela Services Available:')
  console.log('📚 Publishers - Creative Publishing & Content Creation')
  console.log('🔧 Consultants - Turn-key Solution Provider')
  console.log('🌍 Collectives - Diverse Community Ecosystem')
  console.log('🧠 Intelligence - Ecosystem Mapping & Research')
  console.log('🎉 Events - Product/Service Launch & Marketing')
  console.log('📦 Content - Off-the-shelf Frameworks & Products')
}

// Run the test
testEfuyegelaApp().catch(console.error)

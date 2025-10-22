const http = require('http')

const testEndpoint = (path, expectedStatus = 200) => {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      if (res.statusCode === expectedStatus) {
        console.log(`✅ ${path} - ${res.statusCode}`)
        resolve()
      } else {
        console.log(`❌ ${path} - Expected ${expectedStatus}, got ${res.statusCode}`)
        reject(new Error(`Expected ${expectedStatus}, got ${res.statusCode}`))
      }
    })
    
    req.on('error', (err) => {
      console.log(`❌ ${path} - Connection failed: ${err.message}`)
      reject(err)
    })
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${path} - Timeout`)
      reject(new Error('Timeout'))
    })
  })
}

const runTests = async () => {
  console.log('🧪 Running health checks...\n')
  
  try {
    await testEndpoint('/api/health')
    await testEndpoint('/api/session', 200) // Should return 200 even if no session
    console.log('\n✅ All tests passed!')
  } catch (err) {
    console.log('\n❌ Tests failed:', err.message)
    process.exit(1)
  }
}

runTests()

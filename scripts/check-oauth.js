const fs = require('fs')
const path = require('path')

console.log('🔍 Checking OAuth Configuration...\n')

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found')
  console.log('📝 Copy env.example to .env and configure your credentials')
  process.exit(1)
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8')

// Check for required variables
const requiredVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL'
]

const oauthVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_ID',
  'GITHUB_SECRET'
]

console.log('📋 Required Variables:')
requiredVars.forEach(varName => {
  const hasVar = envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=`)
  console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`)
})

console.log('\n🔐 OAuth Variables:')
oauthVars.forEach(varName => {
  const hasVar = envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=`)
  console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`)
})

// Check fallback auth
const fallbackEnabled = envContent.includes('FALLBACK_AUTH_ENABLED=true')
console.log(`\n🔧 Fallback Auth: ${fallbackEnabled ? '✅ Enabled' : '❌ Disabled'}`)

// Recommendations
console.log('\n💡 Recommendations:')
if (!envContent.includes('GOOGLE_CLIENT_ID=') || envContent.includes('GOOGLE_CLIENT_ID=')) {
  console.log('  • Set up Google OAuth for better user experience')
  console.log('  • See GOOGLE_OAUTH_SETUP.md for instructions')
}

if (!fallbackEnabled) {
  console.log('  • Enable FALLBACK_AUTH_ENABLED=true for demo users')
}

console.log('\n🚀 To start the application:')
console.log('  npm run dev')
console.log('  or')
console.log('  docker compose up --build')


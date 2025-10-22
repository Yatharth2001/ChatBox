const fs = require('fs')
const path = require('path')

console.log('🔧 Setting up environment variables...\n')

const envPath = path.join(process.cwd(), '.env')
const envExamplePath = path.join(process.cwd(), 'env.example')

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists')
  console.log('📝 Edit .env file to configure your OAuth credentials')
} else {
  // Copy from env.example
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ Created .env file from env.example')
  } else {
    // Create basic .env file
    const envContent = `# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/chat?schema=public

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeme-in-production

# OAuth Providers (optional - if not set, fallback auth will be used)
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Fallback credentials auth for seeded users
FALLBACK_AUTH_ENABLED=true

# WebSocket URL (optional - defaults to same origin)
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws

# Public environment variables for debugging (optional)
NEXT_PUBLIC_GOOGLE_OAUTH_CONFIGURED=false
NEXT_PUBLIC_GITHUB_OAUTH_CONFIGURED=false
NEXT_PUBLIC_FALLBACK_AUTH_ENABLED=true
`
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Created .env file with default values')
  }
}

console.log('\n📋 Next steps:')
console.log('1. Edit .env file to add your OAuth credentials')
console.log('2. For Google OAuth, see GOOGLE_OAUTH_SETUP.md')
console.log('3. Run: npm run check-oauth (to verify configuration)')
console.log('4. Run: npm run dev (to start development server)')

console.log('\n🔐 For Google OAuth setup:')
console.log('1. Go to https://console.cloud.google.com/')
console.log('2. Create OAuth 2.0 credentials')
console.log('3. Add redirect URI: http://localhost:3000/api/auth/callback/google')
console.log('4. Copy Client ID and Secret to .env file')

console.log('\n💡 Demo users (if OAuth not configured):')
console.log('- yatharth: yatharth@gmail.com / password')
console.log('- manasvi: manasvi@gmail.com / password')


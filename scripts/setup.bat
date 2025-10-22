@echo off
echo 🚀 Setting up ChatBox...

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ✅ Created .env file. Please edit it with your configuration.
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Run database migrations
echo 🗄️ Running database migrations...
npx prisma migrate dev --name init

REM Seed the database
echo 🌱 Seeding database...
npx prisma db seed

echo ✅ Setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo To start with Docker:
echo   docker compose up --build
pause

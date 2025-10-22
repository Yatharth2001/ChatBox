const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create yatharth user
  const yatharth = await prisma.user.upsert({
    where: { email: 'yatharth@gmail.com' },
    update: {},
    create: {
      email: 'yatharth@gmail.com',
      name: 'yatharth',
      passwordHash: await bcrypt.hash('password', 10),
    },
  })

  // Create manasvi user
  const manasvi = await prisma.user.upsert({
    where: { email: 'manasvi@gmail.com' },
    update: {},
    create: {
      email: 'manasvi@gmail.com',
      name: 'manasvi',
      passwordHash: await bcrypt.hash('password', 10),
    },
  })

  // Create conversation between yatharth and manasvi
  const conversation = await prisma.conversation.upsert({
    where: { id: 'demo-conversation' },
    update: {},
    create: {
      id: 'demo-conversation',
      participants: {
        create: [
          { userId: yatharth.id },
          { userId: manasvi.id },
        ],
      },
    },
  })

  console.log('✅ Seeded users:', { yatharth: yatharth.email, manasvi: manasvi.email })
  console.log('✅ Created conversation:', conversation.id)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

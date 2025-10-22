import { getServerSession } from 'next-auth'

import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { authOptions } from '@/lib/auth'

export async function POST() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = jwt.sign(
    { userId: session.user.id },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '1h' }
  )

  return NextResponse.json({ token })
}

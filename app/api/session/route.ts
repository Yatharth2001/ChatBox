import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ user: session.user })
}

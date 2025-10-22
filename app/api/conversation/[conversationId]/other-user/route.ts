import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { conversationId } = params

  try {
    // Get all participants in the conversation
    const participants = await prisma.participant.findMany({
      where: { conversationId },
      include: { user: true },
    })

    // Find the other user (not the current user)
    const otherParticipant = participants.find(
      (p: any) => p.userId !== session.user.id
    )

    if (!otherParticipant) {
      return NextResponse.json({ error: 'Other user not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      otherUserId: otherParticipant.userId,
      otherUserName: otherParticipant.user.name 
    })
  } catch (error) {
    console.error('Error getting other user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const MessageCreateSchema = z.object({
  conversationId: z.string(),
  recipientId: z.string(),
  content: z.string().min(1).max(1000),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')
  const cursor = searchParams.get('cursor')

  if (!conversationId) {
    return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
  }

  // Verify user is participant in conversation
  const participant = await prisma.participant.findFirst({
    where: {
      userId: session.user.id,
      conversationId,
    },
  })

  if (!participant) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 50,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  })

  return NextResponse.json({ messages })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { conversationId, recipientId, content } = MessageCreateSchema.parse(body)

    // Verify user is participant in conversation
    const participant = await prisma.participant.findFirst({
      where: {
        userId: session.user.id,
        conversationId,
      },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        recipientId,
        content,
        deliveredAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

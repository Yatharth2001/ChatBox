import { createServer, IncomingMessage } from 'http'
import { parse } from 'url'
import next from 'next'
import { WebSocketServer, WebSocket } from 'ws'
import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import { prisma } from '../lib/prisma'
import { 
  addUserConnection, 
  removeUserConnection, 
  broadcastToUser, 
  sendError,
  WSMessageSendSchema,
  WSResponse
} from '../lib/ws'
import jwt from 'jsonwebtoken'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // WebSocket server
  const wss = new WebSocketServer({ 
    noServer: true,
    path: '/ws'
  })

  // Handle WebSocket upgrade
  server.on('upgrade', async (request, socket, head) => {
    const pathname = parse(request.url!).pathname

    if (pathname === '/ws') {
      try {
        // Authenticate the WebSocket connection
        let userId: string | null = null

        // Try to get session from cookies (skip if not in request context)
        let session = null
        try {
          session = await getServerSession(authOptions)
        } catch (err) {
          // Session not available in this context, continue to JWT token
        }
        
        if (session?.user?.id) {
          userId = session.user.id
        } else {
          // Try JWT token from query params
          const token = new URL(request.url!, `http://${request.headers.host}`).searchParams.get('token')
          if (token) {
            try {
              const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { userId: string }
              userId = decoded.userId
            } catch (err) {
              console.error('Invalid JWT token:', err)
            }
          }
        }

        if (!userId) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
          socket.destroy()
          return
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request, userId)
        })
      } catch (err) {
        console.error('WebSocket upgrade error:', err)
        socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n')
        socket.destroy()
      }
    } else {
      socket.destroy()
    }
  })

  // Handle WebSocket connections
  wss.on('connection', async (ws: WebSocket, request: IncomingMessage, userId: string) => {
    console.log(`User ${userId} connected to WebSocket`)
    
    // Add user to connection map
    addUserConnection(userId, ws)

    // Handle incoming messages
    ws.on('message', async (data: WebSocket.RawData) => {
      try {
        const message = JSON.parse(data.toString())
        
        if (message.type === 'message:send') {
          const validatedMessage = WSMessageSendSchema.parse(message)
          const { conversationId, recipientId, content } = validatedMessage.payload

          // Verify user is participant in conversation
          const participant = await prisma.participant.findFirst({
            where: {
              userId,
              conversationId,
            },
          })

          if (!participant) {
            sendError(ws, 'UNAUTHORIZED', 'You are not a participant in this conversation')
            return
          }

          // Create message in database
          const savedMessage = await prisma.message.create({
            data: {
              conversationId,
              senderId: userId,
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

          // Broadcast to recipient
          const response: WSResponse = {
            type: 'message:new',
            payload: savedMessage,
          }
          broadcastToUser(recipientId, response)

          // Echo to sender for confirmation
          broadcastToUser(userId, response)
        }
      } catch (err) {
        console.error('WebSocket message error:', err)
        sendError(ws, 'INVALID_MESSAGE', 'Invalid message format')
      }
    })

    // Handle ping/pong for connection health
    ws.on('pong', () => {
      // Client is alive
    })

    // Send periodic pings
    const pingInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.ping()
      } else {
        clearInterval(pingInterval)
      }
    }, 30000)

    // Handle connection close
    ws.on('close', () => {
      console.log(`User ${userId} disconnected from WebSocket`)
      removeUserConnection(userId, ws)
      clearInterval(pingInterval)
    })

    // Handle connection error
    ws.on('error', (err: Error) => {
      console.error(`WebSocket error for user ${userId}:`, err)
      removeUserConnection(userId, ws)
      clearInterval(pingInterval)
    })
  })

  // Start server
  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> WebSocket server ready on ws://${hostname}:${port}/ws`)
  })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully')
    server.close(() => {
      process.exit(0)
    })
  })

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully')
    server.close(() => {
      process.exit(0)
    })
  })
})

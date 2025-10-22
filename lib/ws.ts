import { WebSocket } from 'ws'
import { z } from 'zod'

// WebSocket message schemas
export const WSMessageSchema = z.object({
  type: z.enum(['message:send', 'presence:update']),
  payload: z.record(z.any()),
})

export const WSMessageSendSchema = z.object({
  type: z.literal('message:send'),
  payload: z.object({
    conversationId: z.string(),
    recipientId: z.string(),
    content: z.string(),
  }),
})

export const WSPresenceUpdateSchema = z.object({
  type: z.literal('presence:update'),
  payload: z.object({
    status: z.string(),
  }),
})

// Server response schemas
export const WSResponseSchema = z.object({
  type: z.enum(['message:new', 'error', 'pong']),
  payload: z.record(z.any()).optional(),
})

export type WSMessage = z.infer<typeof WSMessageSchema>
export type WSMessageSend = z.infer<typeof WSMessageSendSchema>
export type WSPresenceUpdate = z.infer<typeof WSPresenceUpdateSchema>
export type WSResponse = z.infer<typeof WSResponseSchema>

// User connection map
export const userConnections = new Map<string, Set<WebSocket>>()

export function addUserConnection(userId: string, ws: WebSocket) {
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set())
  }
  userConnections.get(userId)!.add(ws)
}

export function removeUserConnection(userId: string, ws: WebSocket) {
  const connections = userConnections.get(userId)
  if (connections) {
    connections.delete(ws)
    if (connections.size === 0) {
      userConnections.delete(userId)
    }
  }
}

export function broadcastToUser(userId: string, message: WSResponse) {
  const connections = userConnections.get(userId)
  if (connections) {
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message))
      }
    })
  }
}

export function sendError(ws: WebSocket, code: string, message: string) {
  const errorResponse: WSResponse = {
    type: 'error',
    payload: { code, message },
  }
  ws.send(JSON.stringify(errorResponse))
}

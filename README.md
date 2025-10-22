# ChatBox - Real-time Chat Application

A minimal one-to-one real-time chat application built with Next.js, PostgreSQL, Prisma, and self-hosted WebSockets.

## Features

- **Real-time messaging** using self-hosted WebSockets
- **Authentication** with NextAuth.js (OAuth + fallback credentials)
- **Persistent storage** with PostgreSQL and Prisma
- **Docker support** for easy deployment
- **Minimal UI** focused on functionality

## Quick Start with Docker

1. **Clone and start the application:**
   ```bash
   git clone <repository-url>
   cd chatbox
   docker compose up --build
   ```

2. **Access the application:**
   - Open http://localhost:3000
   - Login with demo users:
     - yatharth: `yatharth@gmail.com` / `password`
     - manasvi: `manasvi@gmail.com` / `password`

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Set up the database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open http://localhost:3000
   - Login with demo users or configure OAuth

## Authentication

The application supports two authentication methods:

### 1. OAuth (GitHub/Google)

Set the following environment variables:
```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. Fallback Credentials

If OAuth is not configured, the app falls back to credential authentication for the two seeded users:
- yatharth: `yatharth@gmail.com` / `password`
- manasvi: `manasvi@gmail.com` / `password`

## WebSocket Protocol

The application uses WebSockets for real-time communication with the following protocol:

### Client → Server Messages

```typescript
// Send a message
{
  type: "message:send",
  payload: {
    conversationId: string,
    recipientId: string,
    content: string
  }
}

// Update presence (optional)
{
  type: "presence:update",
  payload: {
    status: string
  }
}
```

### Server → Client Messages

```typescript
// New message received
{
  type: "message:new",
  payload: Message
}

// Error occurred
{
  type: "error",
  payload: {
    code: string,
    message: string
  }
}

// Heartbeat response
{
  type: "pong"
}
```

## API Endpoints

- `GET /api/session` - Get current user session
- `GET /api/messages?conversationId=...&cursor=...` - Get paginated messages
- `POST /api/messages` - Send a new message
- `POST /api/ws-token` - Get WebSocket authentication token

## Architecture

### Database Schema

- **User**: User accounts with optional password hashes
- **Conversation**: Chat conversations
- **Participant**: Many-to-many relationship between users and conversations
- **Message**: Individual messages with sender/recipient relationships

### WebSocket Server

- Custom HTTP server hosting Next.js and WebSocket upgrade
- Authentication via session cookies or JWT tokens
- In-memory connection mapping for targeted message delivery
- Heartbeat mechanism for connection health monitoring

### Security

- All API endpoints require authentication
- WebSocket connections are authenticated
- Users can only access conversations they participate in
- Messages are only delivered to intended recipients

## Development Notes

### Reconnection Logic

The client implements exponential backoff for WebSocket reconnection:
- Initial delay: 1 second
- Maximum delay: 32 seconds
- Maximum attempts: 5

### Message Persistence

- All messages are stored in PostgreSQL
- Messages are loaded on page refresh
- Real-time updates are sent via WebSocket
- Optimistic UI updates with server reconciliation

### Limitations

- Single conversation between yatharth and manasvi (demo setup)
- No message history pagination beyond 50 messages
- No file attachments or rich media
- No message status indicators (delivered/read)

## Production Deployment

1. **Set production environment variables:**
   ```env
   NEXTAUTH_SECRET=your-secure-secret
   DATABASE_URL=your-production-database-url
   NEXTAUTH_URL=https://your-domain.com
   ```

2. **Deploy with Docker:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **Run database migrations:**
   ```bash
   docker compose exec app npx prisma migrate deploy
   docker compose exec app npx prisma db seed
   ```

## Troubleshooting

### WebSocket Connection Issues

- Check that `NEXT_PUBLIC_WS_URL` is set correctly
- Verify firewall settings allow WebSocket connections
- Check browser console for connection errors

### Database Connection Issues

- Ensure PostgreSQL is running and accessible
- Verify `DATABASE_URL` is correct
- Run `npx prisma migrate deploy` to apply migrations

### Authentication Issues

- Check OAuth provider configuration
- Verify `NEXTAUTH_SECRET` is set
- Ensure callback URLs are configured in OAuth providers

## License

MIT License - see LICENSE file for details.
# chatbox

// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useSession } from 'next-auth/react'
// import MessageList from './MessageList'
// import MessageInput from './MessageInput'


// interface Message {
//   id: string
//   content: string
//   senderId: string
//   recipientId: string
//   createdAt: string
//   sender: {
//     id: string
//     name: string
//     email: string
//   }
//   recipient: {
//     id: string
//     name: string
//     email: string
//   }
// }

// interface ChatProps {
//   wsToken: string
// }

// export default function Chat({ wsToken }: ChatProps) {
//   const { data: session } = useSession()
//   const [messages, setMessages] = useState<Message[]>([])
//   const [isConnected, setIsConnected] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const wsRef = useRef<WebSocket | null>(null)
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
//   const reconnectAttempts = useRef(0)
//   const maxReconnectAttempts = 5

//   const connectWebSocket = () => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       return
//     }

//     const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://${window.location.host}/ws`
//     const url = `${wsUrl}?token=${wsToken}`
    
//     try {
//       const ws = new WebSocket(url)
//       wsRef.current = ws

//       ws.onopen = () => {
//         console.log('WebSocket connected')
//         setIsConnected(true)
//         setError(null)
//         reconnectAttempts.current = 0
//       }

//       ws.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data)
          
//           if (data.type === 'message:new') {
//             setMessages(prev => [...prev, data.payload])
//           } else if (data.type === 'error') {
//             setError(data.payload.message)
//           }
//         } catch (err) {
//           console.error('Failed to parse WebSocket message:', err)
//         }
//       }

//       ws.onclose = () => {
//         console.log('WebSocket disconnected')
//         setIsConnected(false)
        
//         // Attempt to reconnect with exponential backoff
//         if (reconnectAttempts.current < maxReconnectAttempts) {
//           const delay = Math.pow(2, reconnectAttempts.current) * 1000
//           reconnectTimeoutRef.current = setTimeout(() => {
//             reconnectAttempts.current++
//             connectWebSocket()
//           }, delay)
//         }
//       }

//       ws.onerror = (err) => {
//         console.error('WebSocket error:', err)
//         setError('Connection error')
//       }
//     } catch (err) {
//       console.error('Failed to create WebSocket:', err)
//       setError('Failed to connect')
//     }
//   }

//   const sendMessage = async (content: string) => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
//       setError('Not connected')
//       return
//     }

//     // Get the other user ID from the conversation
//     try {
//       const response = await fetch('/api/conversation/demo-conversation/other-user')
//       const data = await response.json()
      
//       if (!response.ok) {
//         setError('Failed to get recipient')
//         return
//       }

//       const message = {
//         type: 'message:send',
//         payload: {
//           conversationId: 'demo-conversation',
//           recipientId: data.otherUserId,
//           content,
//         },
//       }

//       wsRef.current.send(JSON.stringify(message))
//     } catch (err) {
//       console.error('Failed to get other user:', err)
//       setError('Failed to send message')
//     }
//   }

//   const loadMessages = async () => {
//     try {
//       const response = await fetch('/api/messages?conversationId=demo-conversation')
//       const data = await response.json()
      
//       if (response.ok) {
//         setMessages(data.messages)
//       } else {
//         setError('Failed to load messages')
//       }
//     } catch (err) {
//       console.error('Failed to load messages:', err)
//       setError('Failed to load messages')
//     }
//   }

//   useEffect(() => {
//     loadMessages()
//     connectWebSocket()

//     return () => {
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current)
//       }
//       if (wsRef.current) {
//         wsRef.current.close()
//       }
//     }
//   }, [wsToken])

//   return (
//     <div className="chat-container">
//       <div className="status">
//         Status: {isConnected ? 'Connected' : 'Disconnected'}
//         {error && ` - ${error}`}
//       </div>
//       <MessageList messages={messages} />
//       <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
//     </div>
//   )
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  sender: { id: string; name: string; email: string };
  recipient: { id: string; name: string; email: string };
}

interface ChatProps {
  wsToken: string;
}

export default function Chat({ wsToken }: ChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://${window.location.host}/ws`;
    const url = `${wsUrl}?token=${wsToken}`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message:new') {
            setMessages((prev) => [...prev, data.payload]);
          } else if (data.type === 'error') {
            setError(data.payload.message);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connectWebSocket();
          }, delay);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection error');
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError('Failed to connect');
    }
  };

  const sendMessage = async (content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('Not connected');
      return;
    }

    try {
      const response = await fetch('/api/conversation/demo-conversation/other-user');
      const data = await response.json();

      if (!response.ok) {
        setError('Failed to get recipient');
        return;
      }

      const message = {
        type: 'message:send',
        payload: {
          conversationId: 'demo-conversation',
          recipientId: data.otherUserId,
          content,
        },
      };

      wsRef.current.send(JSON.stringify(message));
    } catch (err) {
      console.error('Failed to get other user:', err);
      setError('Failed to send message');
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages?conversationId=demo-conversation');
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages');
    }
  };

  useEffect(() => {
    loadMessages();
    connectWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [wsToken]);

  return (
    <div className="flex h-full flex-col">
      {/* centered status pill */}
      <div className="mb-2 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1.5 text-xs text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          {error && <span className="max-w-[12rem] truncate">— {error}</span>}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-hidden rounded-[22px] border border-slate-200/60 bg-white/70 shadow-inner dark:border-white/10 dark:bg-white/[0.04]">
          <MessageList messages={messages} />
        </div>
      </div>

      <div className="mt-3">
        <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
      </div>
    </div>
  );
}

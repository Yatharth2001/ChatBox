'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  sender: { id: string; name: string; email: string };
  recipient: { id: string; name: string; email: string };
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const { data: session } = useSession();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full flex-col overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
      {messages.map((m) => {
        const isOwn = m.senderId === session?.user?.id;
        return (
          <div key={m.id} className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
              className={[
                'max-w-[86%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm',
                isOwn
                  ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-br-md'
                  : 'bg-white/90 text-slate-800 border border-slate-200 rounded-bl-md dark:bg-white/[0.06] dark:text-slate-100 dark:border-white/10',
              ].join(' ')}
            >
              <div
                className={[
                  'mb-1 text-[11px] leading-none',
                  isOwn ? 'text-white/80' : 'text-slate-500 dark:text-slate-400',
                ].join(' ')}
              >
                {m.sender.name}
              </div>

              <div className="whitespace-pre-wrap text-sm">{m.content}</div>

              <div
                className={[
                  'mt-2 text-[10px] leading-none',
                  isOwn ? 'text-white/75' : 'text-slate-400 dark:text-slate-500',
                ].join(' ')}
              >
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}


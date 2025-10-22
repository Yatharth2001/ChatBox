// 'use client'

// import { useState } from 'react'

// interface MessageInputProps {
//   onSendMessage: (content: string) => void
//   disabled?: boolean
// }

// export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
//   const [content, setContent] = useState('')

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (content.trim() && !disabled) {
//       onSendMessage(content.trim())
//       setContent('')
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       handleSubmit(e)
//     }
//   }

//   return (
//     <form className="message-input" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         onKeyPress={handleKeyPress}
//         placeholder={disabled ? 'Connecting...' : 'Type a message...'}
//         disabled={disabled}
//         maxLength={1000}
//       />
//       <button type="submit" disabled={!content.trim() || disabled}>
//         Send
//       </button>
//     </form>
//   )
// }

'use client';

import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-[18px] border border-slate-200/70 bg-white/80 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]"
    >
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? 'Connecting...' : 'Type a message...'}
        disabled={disabled}
        maxLength={1000}
        className="flex-1 rounded-[14px] bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-1 ring-transparent focus:ring-sky-400 dark:bg-white/5 dark:text-slate-100"
      />
      <button
        type="submit"
        disabled={!content.trim() || disabled}
        className="inline-flex items-center justify-center rounded-[14px] bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Send
      </button>
    </form>
  );
}

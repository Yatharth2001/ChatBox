'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Chat from '../../components/Chat';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wsToken, setWsToken] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetch('/api/ws-token', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => setWsToken(data.token))
      .catch((err) => console.error('Failed to get WS token:', err));
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  // Loading
  if (status === 'loading' || !wsToken) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4 py-10 bg-[radial-gradient(120rem_60rem_at_40%_-10%,rgba(56,189,248,0.10),transparent_60%),radial-gradient(80rem_50rem_at_110%_-10%,rgba(168,85,247,0.10),transparent_60%),linear-gradient(to_bottom,#f7fbff,#f8fbff)] dark:bg-[radial-gradient(120rem_60rem_at_40%_-10%,rgba(56,189,248,0.08),transparent_60%),radial-gradient(80rem_50rem_at_110%_-10%,rgba(168,85,247,0.08),transparent_60%),linear-gradient(to_bottom,#0b1220,#0b1220)]">
        <section className="w-full max-w-5xl rounded-[28px] border border-slate-200/60 bg-white/80 p-8 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
          <div className="h-6 w-44 animate-pulse rounded-md bg-slate-200/70 dark:bg-white/10" />
          <div className="mt-6 space-y-3">
            <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/10" />
            <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/10" />
            <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/10" />
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Loading chat…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-dvh px-4 py-8 bg-[radial-gradient(120rem_60rem_at_40%_-10%,rgba(56,189,248,0.10),transparent_60%),radial-gradient(80rem_50rem_at_110%_-10%,rgba(168,85,247,0.10),transparent_60%),linear-gradient(to_bottom,#f7fbff,#f8fbff)] dark:bg-[radial-gradient(120rem_60rem_at_40%_-10%,rgba(56,189,248,0.08),transparent_60%),radial-gradient(80rem_50rem_at_110%_-10%,rgba(168,85,247,0.08),transparent_60%),linear-gradient(to_bottom,#0b1220,#0b1220)]">
      <section className="mx-auto w-full max-w-6xl rounded-[32px] border border-slate-200/60 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Chat</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Signed in as <span className="font-medium">{session?.user?.name ?? session?.user?.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-medium text-slate-400 shadow-sm backdrop-blur transition hover:text-slate-700 hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:text-white"
          >
            Logout
          </button>
        </div>

        {/* Card body */}
        <div className="px-3 pb-6 sm:px-6 sm:pb-8">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            {/* Decorative side markers (purely visual) */}
            <div className="relative">
              <div className="pointer-events-none absolute -left-6 top-6 hidden h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg md:block" />
              <div className="pointer-events-none absolute -left-5 top-20 hidden h-28 w-1 rounded-full bg-gradient-to-b from-sky-400/50 to-transparent md:block" />
              <div className="pointer-events-none absolute -right-6 top-6 hidden h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-lg md:block" />
              <div className="pointer-events-none absolute -right-5 top-20 hidden h-28 w-1 rounded-full bg-gradient-to-b from-fuchsia-400/40 to-transparent md:block" />

              {/* Chat container */}
              <div className="rounded-[24px] border border-slate-200/60 bg-white/80 p-3 shadow-inner dark:border-white/10 dark:bg-white/[0.04]">
                <div className="h-[70vh] min-h-[420px]">
                  <Chat wsToken={wsToken} />
                </div>
              </div>

              {/* Input tray background */}
              <div className="mt-3 rounded-[20px] border border-slate-200/60 bg-white/80 p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}



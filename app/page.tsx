'use client'

import Spinner from '@/components/Spinner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
  // update path if different

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (session) router.push('/chat')
    else router.push('/login')
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 p-8 rounded-xl shadow-sm bg-white">
        <Spinner size={56} />
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    </div>
  )
}

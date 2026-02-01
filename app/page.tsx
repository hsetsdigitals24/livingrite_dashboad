'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // useEffect(() => {
  //   // Only redirect if authenticated - middleware handles unauthenticated users
  //   if (status === 'authenticated' && session?.user) {
  //     router.push('/dashboard')
  //   } 
  // }, [status, session, router])

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

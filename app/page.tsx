'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()

        if (data.user?.id) {
          // Redirect to dashboard if authenticated
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error)
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            Cyber Risk Assessment
          </h1>
          <p className="text-xl text-muted-foreground">
            Identify, analyze, and mitigate cyber threats with intelligent risk scoring
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/signup')}
          >
            Create Account
          </Button>
        </div>

        <div className="pt-8 text-sm text-muted-foreground space-y-2">
          <p>Enterprise-grade threat assessment platform</p>
          <p>Powered by advanced risk scoring algorithms</p>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Cyber Risk Assessment',
  description: 'Sign in or create an account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background">
      {children}
    </div>
  )
}

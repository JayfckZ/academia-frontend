'use client'

import { useEffect, useState } from 'react'

interface RoleGuardProps {
  allowedRoles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function RoleGuard({
  allowedRoles,
  children,
  fallback = null
}: RoleGuardProps) {
  const [authState, setAuthState] = useState<{
    role: string | null
    loading: boolean
  }>({
    role: null,
    loading: true
  })

  useEffect(() => {
    const verifyToken = async () => {
      await Promise.resolve()

      const token = document.cookie.split('codefit_token=')[1]?.split(';')[0]
      let currentRole = null

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          currentRole = payload.role
        } catch {}
      }

      setAuthState({ role: currentRole, loading: false })
    }

    verifyToken()
  }, [])

  if (authState.loading) return null

  if (!authState.role || !allowedRoles.includes(authState.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

"use client"
import { useEffect } from 'react'
import { api } from '@/lib/api'
import type { UserProfile } from '@/types/api'
import { useAuth } from '@/hooks/use-auth'

export function AuthBootstrap() {
  const { user, setUser } = useAuth()
  useEffect(() => {
    let mounted = true
    if (user) return
    ;(async () => {
      try {
  const res = await api.get<{ valid: boolean; user?: UserProfile }>('/auth/validate')
  const maybeUser = res.data?.user
        if (mounted) {
          if (maybeUser) {
            setUser(maybeUser)
          } else {
            // try to fetch profile
            try {
              const me = await api.get<UserProfile>('/users/me')
              if (me.data) setUser(me.data)
            } catch {}
          }
        }
      } catch {
        // not authenticated; ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [user, setUser])
  return null
}

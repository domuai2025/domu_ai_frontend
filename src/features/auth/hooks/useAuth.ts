import { useCallback } from 'react'

export interface User {
  id: string
  email: string
}

export function useAuth(): { user: User | null; signOut: () => void } {
  const user: User | null = null // Replace with your actual user state management

  const signOut = useCallback(() => {
    // Implement your signout logic
  }, [])

  return {
    user,
    signOut,
  }
}
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function UserButton() {
  const { user, signOut } = useAuth()

  if (!user) {
    return null
  }

  return (
    <Button
      variant="ghost"
      onClick={() => signOut()}
      className="flex items-center gap-2"
    >
      <span>{user.email}</span>
      <span>Sign out</span>
    </Button>
  )
}
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch('/api/auth/sign-out', {
      method: 'POST',
    });

    if (response.ok) {
      router.push('/auth');
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
    >
      Sign out
    </Button>
  );
}
interface User {
  email: string;
  id: string;
}

export function useAuth() {
  // Basic implementation - expand based on your auth needs
  const user: User | null = null; // Replace with actual user state

  const signOut = () => {
    // Implement your signout logic
  };

  return {
    user,
    signOut,
  };
}
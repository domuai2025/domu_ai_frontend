export interface Activity {
  type: 'note' | 'call' | 'email' | 'meeting';
  description: string;
  userId: string;
} 
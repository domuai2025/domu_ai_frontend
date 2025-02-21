export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          read: boolean;
          created_at: string;
          user_id: string;
        };
      };
      activities: {
        Row: {
          id: string;
          created_at: string;
          type: 'new_lead' | 'status_change' | 'note_added' | 'contact_made';
          description: string;
          user_id: string;
        };
      };
    };
  };
};
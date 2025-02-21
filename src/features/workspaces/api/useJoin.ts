import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '@/components/supabase/provider';

export function useJoin() {
  const { supabase } = useSupabase();
  
  return useMutation({
    mutationFn: async ({ workspaceId, joinCode }: { workspaceId: string; joinCode: string }) => {
      const { error } = await supabase
        .from('workspace_members')
        .insert({ workspace_id: workspaceId, join_code: joinCode });
        
      if (error) throw error;
      return true;
    }
  });
} 
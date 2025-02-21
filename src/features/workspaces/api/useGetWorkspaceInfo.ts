import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@/components/supabase/provider';

interface WorkspaceInfo {
  id: string;
  name: string;
  isMember: boolean;
}

export function useGetWorkspaceInfo({ id }: { id: string }) {
  const { supabase } = useSupabase();

  return useQuery<WorkspaceInfo>({
    queryKey: ['workspace', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*, workspace_members!inner(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        isMember: data.workspace_members.length > 0
      };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30 // Updated from cacheTime to gcTime
  });
}
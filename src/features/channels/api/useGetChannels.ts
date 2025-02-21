import { useQuery } from "@tanstack/react-query"
import axios from "@/lib/axios"

interface Channel {
  id: string
  name: string
  description?: string
  createdAt: string
}

export function useGetChannels() {
  return useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { data } = await axios.get<Channel[]>("/api/channels")
      return data
    },
  })
}
import { createSupabaseClient } from "@/lib/supabase-client";
import { IUserChallenge } from "@/types/IChallenge";
import { useState } from "react";

export const useGetUserTodayChallenges = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IUserChallenge[]>([])

  const handle = async ({session, userId}: {session: any, userId: string}) => {
    const client = createSupabaseClient(session);
    setLoading(true)

    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await client.from('user_challenge_progress')
      .select('id, created_at, challenges(id, title, category, description, timer)')
      .eq('user_id', userId)
      .gte('created_at', start)
      .lte('created_at', end)

    if (!error) {
      const formatted = data?.map(item => ({
        id: item.id,
        created_at: item.created_at,
        challenge: item.challenges?.[0] || item?.challenges,
      }))

      setData(formatted)
    }
    setLoading(false)
  }

  return {data, loading, handle}
}

import { createSupabaseClient } from "@/lib/supabase-client";
import { IUserChallenge } from "@/types/IChallenge";
import { getDateRange } from "@/utils/getDateRange";
import { useState } from "react";

export const useGetUserTodayChallenges = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IUserChallenge[]>([])

  const handle = async ({session, userId}: {session: any, userId: string}) => {
    const client = createSupabaseClient(session);
    setLoading(true)
    const {start, end} = getDateRange()


    const { data, error } = await client.from('user_challenge_progress')
      .select('id, created_at, challenges(id, title, category, description, timer, image)')
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

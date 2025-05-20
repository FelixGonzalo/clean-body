import { createSupabaseClient } from "@/lib/supabase-client"
import { IDailyChallenge } from "@/types/IChallenge"
import { getDateRange } from "@/utils/getDateRange"
import { useState } from "react"

export const useGetTodayChallenges = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IDailyChallenge[]>([])

  const handle = async ({session}: {session?: any}) => {
    const client = createSupabaseClient(session);

    setLoading(true)
    const {start, end} = getDateRange()

    const { data, error } = await client
      .from('daily_challenges')
      .select('id, created_at, challenges(id, title, category, description, timer, image)')
      .gte('created_at', start)
      .lte('created_at', end)
      .limit(3);

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

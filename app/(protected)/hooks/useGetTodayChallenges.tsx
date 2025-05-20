import { useSupabase } from "@/lib/supabase-provider"
import { IDailyChallenge } from "@/types/IChallenge"
import { getDateRange } from "@/utils/getDateRange"
import { useState } from "react"

export const useGetTodayChallenges = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IDailyChallenge[]>([])

  const handle = async () => {
    if (!supabase) return;
    setLoading(true)
    const {start, end} = getDateRange()

    const { data, error } = await supabase
      .from('daily_challenges')
      .select('id, created_at, challenges(id, title, category, description, timer)')
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

import { createSupabaseClient } from "@/lib/supabase-client"
import { IUserChallenge } from "@/types/IChallenge"
import { useState } from "react"

export const useGetUserChallenges = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IUserChallenge[]>([])

  const handle = async ({session, userId}: {session: any, userId: string}) => {
    const client = createSupabaseClient(session);

    setLoading(true)

    const { data, error } = await client.from('user_challenge_progress')
      .select('id, created_at, challenges(id, title, category, description, timer, image)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

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

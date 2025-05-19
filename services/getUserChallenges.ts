import { IUserChallenge } from '@/types/IChallenge';
import { createClient } from '@/lib/supabase-server'

export async function getUserChallenges({userId}: {userId: string}): Promise<IUserChallenge[]>  {
  const supabase = await createClient()

  const { data, error } = await supabase.from('user_challenge_progress')
    .select('id, created_at, challenges(id, title, category, description, timer)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching challenges:', error)
    return []
  }

  if (!data) return []

  return data.map(item => ({
    id: item.id,
    created_at: item.created_at,
    challenge: item.challenges?.[0] || item?.challenges,
  }))
}

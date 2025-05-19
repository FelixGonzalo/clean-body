import { IDailyChallenge } from '@/types/IChallenge';
import { createClient } from '@/utils/supabase/server'

export async function getTodayChallenges(): Promise<IDailyChallenge[]>  {
  const supabase = await createClient()
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const { data, error } = await supabase
    .from('daily_challenges')
    .select('id, created_at, challenges(id, title, category, description, timer)')
    .gte('created_at', start)
    .lte('created_at', end)
    .limit(3);

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

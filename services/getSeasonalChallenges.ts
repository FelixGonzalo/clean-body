import { IChallenge } from '@/types/IChallenge'
import { createClient } from '@/lib/supabase-server'

export async function getSeasonalChallenges(): Promise<IChallenge[]>  {
  const supabase = await createClient()
  const { data: challenges, error } = await supabase.from('seasonal-challenges')
    .select('id, created_at, challenges(id, title, category, description, timer)')

  if (error) {
    console.error('Error fetching challenges:', error)
    return []
  }

  return challenges.reduce((acc, val) => acc.concat(val.challenges), [] as IChallenge[]);
}

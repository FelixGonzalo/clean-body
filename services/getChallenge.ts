import { IChallenge } from '@/types/IChallenge'
import { createClient } from '@/utils/supabase/server'

export async function getChallenge({ id }: {id?: string}): Promise<IChallenge | null>  {
  if (!id) return null

  const supabase = await createClient()
  const { data: challenge, error } = await supabase.from('challenges')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching challenges:', error)
    return null
  }

  return challenge
}

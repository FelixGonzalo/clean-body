import { createClient } from '@/utils/supabase/server'

export async function getChallenges() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('challenges').select('*')

  if (error) {
    console.error('Error fetching challenges:', error)
    return []
  }

  return data
}

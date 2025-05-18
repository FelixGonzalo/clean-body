import { createClient } from "@/utils/supabase/server"

export async function checkChallenge({ id }: {id?: string}): Promise<boolean>  {
  const supabase = await createClient()
  const {error} = await supabase.from('user_challenge_progress').insert({
    name: id,
  })
  if (error) {
    console.error('Error fetching challenges:', error)
    return false
  }

  return true
}

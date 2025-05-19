import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function createClient() {
  const cookieStore = cookies()

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })

  return supabase
}

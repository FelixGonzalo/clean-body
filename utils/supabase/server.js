import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { auth } from '@clerk/nextjs/server'

export async function createClient() {
  const cookieStore = cookies()
  const { token  } = auth()

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
    headers: () => ({
      Authorization: `Bearer ${token }`,
    }),
  })

  return supabase
}

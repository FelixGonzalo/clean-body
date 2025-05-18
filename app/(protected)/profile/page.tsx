'use client';

import { useSupabase } from "@/lib/supabase-provider";
import { IDailyChallenge, IUserChallenge } from "@/types/IChallenge";
import { useSession } from "@clerk/nextjs"
import { useEffect, useState } from "react";

export default function Profiles() {
  const { supabase } = useSupabase()
  const { session } = useSession()
  const user = session?.user
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<IUserChallenge[]>([])

  useEffect(() => {
      if (!supabase) return;

    async function loadChallenges() {
      if (!supabase) return;
      setLoading(true)
      const { data, error } = await supabase.from('user_challenge_progress').select('id, created_at, challenges(id, title, category, description)')
      if (!error) {
              const formatted = data?.map(item => ({
          id: item.id,
          created_at: item.created_at,
          challenge: item.challenges?.[0] || item?.challenges,
        }))

        setChallenges(formatted)
      }
      setLoading(false)
    }

    loadChallenges()
  }, [])


  return (
    <main className="p-2 md:p-4">
      <img src={user?.imageUrl} alt={user?.fullName || ""} className="rounded-full w-20 h-20 object-cover" />
      <h1 className="text-2xl">{user?.fullName || ""}</h1>
      {loading && <p>Cargando..</p>}
      {challenges?.map(obj => (
        <article key={obj.id}>
          {obj.challenge?.title}
        </article>
      ))}
    </main>
  )
}

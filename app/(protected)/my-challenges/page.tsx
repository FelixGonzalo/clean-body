'use client';

import { Badge } from "@/components/Badge";
import { Loader } from "@/components/Loader";
import { useSupabase } from "@/lib/supabase-provider";
import { IUserChallenge } from "@/types/IChallenge";
import { formatDate } from "@/utils/formatDate";
import { useSession } from "@clerk/nextjs"
import { useEffect, useState } from "react";

const useGetUserChallenges = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IUserChallenge[]>([])

  const handle = async () => {
    if (!supabase) return;
    setLoading(true)
    const { data, error } = await supabase.from('user_challenge_progress')
      .select('id, created_at, challenges(id, title, category, description, timer)')
      .order('created_at', { ascending: false })
      .limit(10);

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

export default function Profiles() {
  const { session } = useSession()
  const user = session?.user

  const GetUserChallenges = useGetUserChallenges()

  useEffect(() => {
    GetUserChallenges.handle()
  }, [])

  return (
    <main className="p-4">
      <img src={user?.imageUrl} alt={user?.fullName || ""} className="rounded-full w-20 h-20 object-cover" />
      <h1 className="text-2xl">{user?.fullName || ""}</h1>
      {GetUserChallenges.loading ? (
        <div className="flex justify-start h-20">
          <Loader />
        </div>
      ) : (
        <>
          <h2 className="my-4 text-gray-500 font-bold ">Últimos retos</h2>
          <div className="flex flex-col gap-4">
            {GetUserChallenges.data?.map(obj => (
              <article key={obj.id} className="border-l-2 border-gray-500 pl-4">
                <h2 className="mt-1">
                  {obj.challenge?.title}
                </h2>
                <Badge>
                  {obj.challenge?.category}
                </Badge>
                <span className="ml-1 text-gray-500 inline-block rounded-sm text-sm lowercase">
                  {formatDate(obj.created_at)}
                </span>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

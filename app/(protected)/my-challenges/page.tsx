'use client';

import { Loader } from "@/components/Loader";
import { useSupabase } from "@/lib/supabase-provider";
import { IDailyChallenge, IUserChallenge } from "@/types/IChallenge";
import { useSession } from "@clerk/nextjs"
import { useEffect, useState } from "react";

import { TodayChallenges } from "@/components/TodayChallenges";
import { Avatar } from "@/components/Avatar";
import { ProgressChart } from "@/components/ProgressChart";
import { createLastWeekObject, createWeekObject } from "@/utils/createWeekObject";
import { LastChallenges } from "@/components/LastChallenges";
import { ShareProgressButton } from "@/components/ShareProgressButon";

const useGetTodayChallenges = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IDailyChallenge[]>([])

  const handle = async () => {
    if (!supabase) return;
    setLoading(true)
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
      .from('daily_challenges')
      .select('id, created_at, challenges(id, title, category, description, timer)')
      .gte('created_at', start)
      .lte('created_at', end)
      .limit(3);

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

const useGetUserChallenges = () => {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IUserChallenge[]>([])

  const handle = async ({userId}: {userId: string}) => {
    if (!supabase) return;
    setLoading(true)
    const { data, error } = await supabase.from('user_challenge_progress')
      .select('id, created_at, challenges(id, title, category, description, timer)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

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
  const GetTodayChallenges = useGetTodayChallenges()

  const thisWeekObj = createWeekObject(new Date());
  const lastWeekObj = createLastWeekObject();

  GetUserChallenges.data?.forEach(item => {
    const date = new Date(item.created_at).toISOString().substring(0, 10);
    if (thisWeekObj.hasOwnProperty(date)) {
      thisWeekObj[date] += 1;
    }
    if (lastWeekObj.hasOwnProperty(date)) {
      lastWeekObj[date] += 1;
    }
  });

  const todayStr = new Date().toISOString().substring(0, 10);

  const thisWeekCount = Object.entries(thisWeekObj)
    .filter(([date]) => date <= todayStr)
    .map(([_, count]) => count);

  const lastWeekCount = Object.entries(lastWeekObj)
    .filter(([date]) => date <= todayStr)
    .map(([_, count]) => count);

  useEffect(() => {
    GetTodayChallenges.handle()
  }, [])

  useEffect(() => {
    if (!user) return
    GetUserChallenges.handle({userId: user.id})
  }, [user])

  const userTodayChallenges = GetUserChallenges.data?.filter(obj => {
    return obj.created_at.substring(0, 10) === todayStr
  })
  const userChallengesUuids = userTodayChallenges?.map(obj => obj.challenge.id) || []
  const pendingChallenges = GetTodayChallenges.data?.filter(obj => {
    return !userChallengesUuids.includes(obj.challenge.id)
  })

  return (
    <main className="p-4 max-w-100 mx-auto mb-20">
      <Avatar user={user} />
      {GetUserChallenges.loading ? (
        <div className="flex justify-center h-20">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-10 mt-4">
          <div className="flex gap-2 justify-center">
            <ShareProgressButton user={user} />
          </div>
          <ProgressChart thisWeekCount={thisWeekCount} lastWeekCount={lastWeekCount} />
          {GetTodayChallenges.loading ? (
            <div className="flex justify-center h-20">
              <Loader />
            </div>
          ) : pendingChallenges?.length > 0 ? (
            <div>
              <h2 className="mb-4 text-gray-500 font-bold ">Retos pendientes</h2>
              <TodayChallenges challenges={pendingChallenges} isMainDesign={false} />
            </div>
          ) : null}
          <LastChallenges userChallenges={GetUserChallenges.data} todayStr={todayStr} />
        </div>
      )}
    </main>
  )
}

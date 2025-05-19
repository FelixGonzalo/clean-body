'use client';

import { Badge } from "@/components/Badge";
import { Loader } from "@/components/Loader";
import { useSupabase } from "@/lib/supabase-provider";
import { IDailyChallenge, IUserChallenge } from "@/types/IChallenge";
import { formatDate } from "@/utils/formatDate";
import { useSession } from "@clerk/nextjs"
import { useEffect, useState } from "react";

import { Button, ConfirmButton } from "@/components/Button";
import { onShare } from "@/utils/onShare";
import { TodayChallenges } from "@/components/TodayChallenges";
import { Avatar } from "@/components/Avatar";
import { ProgressChart } from "@/components/ProgressChart";
import { createLastWeekObject, createWeekObject } from "@/utils/createWeekObject";

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

  const handle = async () => {
    if (!supabase) return;
    setLoading(true)
    const { data, error } = await supabase.from('user_challenge_progress')
      .select('id, created_at, challenges(id, title, category, description, timer)')
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
    GetUserChallenges.handle()
  }, [])


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
            <Button onClick={() => { }}>
              Compartir mi progreso
            </Button>
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
          <div>
            <h2 className="mb-4 text-gray-500 font-bold ">Últimos retos completados</h2>
            <div className="flex flex-col gap-4">
              {GetUserChallenges.data?.slice(0, 10)?.map(obj => <ChallengeCard userChallenge={obj} todayStr={todayStr} />)}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

const ChallengeCard = ({ userChallenge, todayStr}: { userChallenge: IUserChallenge, todayStr: string}) => {
  const isToday = new Date(userChallenge.created_at).toISOString().substring(0, 10) === todayStr;
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/challenges/${userChallenge.challenge.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
    onShare("Te desafío a que lo hagas", url); // opcional, si aún necesitas llamarlo
  };

  return (
    <article key={userChallenge.id} className="border-l-2 border-gray-500 pl-4 py-1">
      <h2>
        {userChallenge.challenge?.title}
      </h2>
      <div className="mt-1 mb-3">
        <Badge>
          {userChallenge.challenge?.category}
        </Badge>
        <span className="ml-1 text-gray-500 inline-block rounded-sm text-sm lowercase">
          {formatDate(userChallenge.created_at)}
        </span>
      </div>
      {isToday && (
        <ConfirmButton onClick={() => handleShare()}>
          {copied ? "¡Link copiado! Compártelo" : "¡Desafía ahora!"}
        </ConfirmButton>
      )}
    </article>
  )
}
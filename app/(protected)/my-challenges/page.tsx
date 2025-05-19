'use client';

import { Badge } from "@/components/Badge";
import { Loader } from "@/components/Loader";
import { useSupabase } from "@/lib/supabase-provider";
import { IDailyChallenge, IUserChallenge } from "@/types/IChallenge";
import { formatDate } from "@/utils/formatDate";
import { useSession } from "@clerk/nextjs"
import { useEffect, useState } from "react";

import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button, ConfirmButton } from "@/components/Button";
import { onShare } from "@/utils/onShare";
import { TodayChallenges } from "@/components/TodayChallenges";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function getWeekRange(today = new Date()) {
  const day = today.getDay(); // 0 = domingo, 1 = lunes, ...
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

function createWeekObject(today = new Date()) {
  const { monday } = getWeekRange(today);
  const weekObj: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekObj[d.toISOString().substring(0, 10)] = 0;
  }
  return weekObj;
}

function createLastWeekObject(): Record<string, number> {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const mondayLastWeek = new Date(today);
  mondayLastWeek.setDate(today.getDate() - daysSinceMonday - 7); // Ir al lunes pasado

  const result: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const current = new Date(mondayLastWeek);
    current.setDate(mondayLastWeek.getDate() + i);
    const key = current.toISOString().substring(0, 10);
    result[key] = 0;
  }

  return result;
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
      <div className="min-h-30 text-center flex flex-col gap-4 justify-center items-center">
        <img src={user?.imageUrl} alt={user?.fullName || ""} className="rounded-full w-20 h-20 object-cover" />
        <h1 className="text-2xl">{user?.fullName || ""}</h1>
      </div>
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
          <div className="min-h-50">
            <h2 className="mb-4 text-gray-500 font-bold ">Progreso</h2>
            <Line
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
              data={{
                labels,
                datasets: [
                  {
                    label: 'Esta semana',
                    data: thisWeekCount,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                  {
                    label: 'Semana pasada',
                    data: lastWeekCount,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  },
                ],
              }}
            />
          </div>
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
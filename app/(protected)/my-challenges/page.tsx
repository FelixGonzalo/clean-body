'use client';

import { Loader } from "@/components/Loader";
import { useSession } from "@clerk/nextjs"
import { useEffect } from "react";

import { TodayChallenges } from "@/components/TodayChallenges";
import { Avatar } from "@/components/Avatar";
import { ProgressChart } from "@/components/ProgressChart";
import { createLastWeekObject, createWeekObject } from "@/utils/createWeekObject";
import { LastChallenges } from "@/components/LastChallenges";
import { ProgressShareButton } from "@/components/ProgressShareButton";
import { useGetTodayChallenges } from "@/hooks/useGetTodayChallenges";
import { useGetUserChallenges } from "@/hooks/useGetUserChallenges";

export default function MyChallenges() {
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
      <Avatar user={{
        fullName: user?.fullName || "",
        imageUrl: user?.imageUrl
      }} />
      {GetUserChallenges.loading ? (
        <div className="flex justify-center h-20">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-10 mt-4">
          <div className="flex gap-2 justify-center">
            <ProgressShareButton user={user} />
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

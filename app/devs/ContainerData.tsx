'use client';
import { LastChallenges } from "@/components/LastChallenges";
import { ProgressChart } from "@/components/ProgressChart"
import { useGetUserChallenges } from "@/hooks/useGetUserChallenges";
import { createLastWeekObject, createWeekObject } from "@/utils/createWeekObject";
import { toDateYYYYMMDD } from "@/utils/toDateYYYMMDD";
import { useSession } from "@clerk/nextjs";
import { useEffect } from "react";

// Ya no hay tiempo para ordenar código zZz
export const ContainerData = ({userId}: {userId: string}) => {
  const { session } = useSession()

  const GetUserChallenges = useGetUserChallenges()

  const thisWeekObj = createWeekObject(new Date());
  const lastWeekObj = createLastWeekObject();

  GetUserChallenges.data?.forEach(item => {
    const date = toDateYYYYMMDD(item.created_at)
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
    GetUserChallenges.handle({session, userId})
  }, [session])


  return (
    <div className="flex flex-col gap-10 mt-4">
      <ProgressChart thisWeekCount={thisWeekCount} lastWeekCount={lastWeekCount} />
      {GetUserChallenges.data.length > 0 && (
        <LastChallenges userChallenges={GetUserChallenges.data} />
      )}
    </div>
  )
}

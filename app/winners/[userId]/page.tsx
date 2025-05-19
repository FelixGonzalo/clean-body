import { Avatar } from "@/components/Avatar";
import { ProgressChart } from "@/components/ProgressChart";
import {TodayChallenges} from "@/components/TodayChallenges";
import { getTodayChallenges } from "@/services/getTodayChallenges";
import { getUserChallenges } from "@/services/getUserChallenges";
import { createLastWeekObject, createWeekObject } from "@/utils/createWeekObject";
import { clerkClient} from "@clerk/nextjs/server";

interface Props {
  params: {
    userId: string;
  };
}

export default async function Home({ params }: Props) {
  const { userId } = await params;
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const challenges = await getTodayChallenges()
  const userChallenges = await getUserChallenges();

  const thisWeekObj = createWeekObject(new Date());
  const lastWeekObj = createLastWeekObject();

  userChallenges?.forEach(item => {
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

  return (
    <main className="p-4 max-w-100 mx-auto mb-20">
      <Avatar user={user} />
      <div className="flex flex-col gap-10 mt-4">
        <ProgressChart thisWeekCount={thisWeekCount} lastWeekCount={lastWeekCount} />
        <TodayChallenges challenges={challenges} isMainDesign={false} />
      </div>
    </main>
  );
}

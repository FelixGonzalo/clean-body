import { Avatar } from "@/components/Avatar";
import { LastChallenges } from "@/components/LastChallenges";
import { ProgressChart } from "@/components/ProgressChart";
import { getUserChallenges } from "@/services/getUserChallenges";
import { createLastWeekObject, createWeekObject } from "@/utils/createWeekObject";
import { clerkClient} from "@clerk/nextjs/server";

export default async function Dev({params}: {params: Promise<{ userId: string }>}) {
  const { userId } = await params;
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userChallenges = await getUserChallenges({userId});

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
        {userChallenges.length > 0 && (
          <LastChallenges userChallenges={userChallenges} />
        )}
      </div>
    </main>
  );
}

import { Avatar } from "@/components/Avatar";
import { LastChallenges } from "@/components/LastChallenges";
import { ProgressChart } from "@/components/ProgressChart";
import { getUserChallenges } from "@/services/getUserChallenges";
import { createLastWeekObject, createWeekObject } from "@/utils/createWeekObject";
import { toUTCDateYYYYMMDD } from "@/utils/toUTCDateYYYMMDD";
import { clerkClient} from "@clerk/nextjs/server";
import { Metadata } from "next";

type Props = {params: Promise<{ userId: string }>}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { userId } = await params
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  return {
    title: `${user.fullName || "Dev"} | Clean Body`,
    description: 'Eres tu principal framework, mantenlo actualizado',
  }
}

export default async function Dev({params}: Props) {
  const { userId } = await params;
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userChallenges = await getUserChallenges({userId});

  const thisWeekObj = createWeekObject(new Date());
  const lastWeekObj = createLastWeekObject();

  userChallenges?.forEach(item => {
    const date = toUTCDateYYYYMMDD(item.created_at)

    if (thisWeekObj.hasOwnProperty(date)) {
      thisWeekObj[date] += 1;
    }
    if (lastWeekObj.hasOwnProperty(date)) {
      lastWeekObj[date] += 1;
    }
  });

  const todayUTC = new Date();
  const todayStr = `${todayUTC.getUTCFullYear()}-${String(todayUTC.getUTCMonth() + 1).padStart(2, '0')}-${String(todayUTC.getUTCDate()).padStart(2, '0')}`;

  const thisWeekCount = Object.entries(thisWeekObj)
    .filter(([date]) => date <= todayStr)
    .map(([_, count]) => count);

  const lastWeekCount = Object.entries(lastWeekObj)
    .filter(([date]) => date <= todayStr)
    .map(([_, count]) => count);

  return (
    <main className="p-4 max-w-100 mx-auto mb-20">
      <Avatar user={{
        fullName: user.fullName || "",
        imageUrl: user.imageUrl,
      }} />
      <div className="flex flex-col gap-10 mt-4">
        <ProgressChart thisWeekCount={thisWeekCount} lastWeekCount={lastWeekCount} />
        {userChallenges.length > 0 && (
          <LastChallenges userChallenges={userChallenges} />
        )}
      </div>
    </main>
  );
}

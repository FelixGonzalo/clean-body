import { IUserChallenge } from "@/types/IChallenge"
import { ChallengeCard } from "./ChallengeCard"

export const LastChallenges = ({ userChallenges, todayStr }: { userChallenges: IUserChallenge[], todayStr?: string }) => {
  return (
    <div>
      <h2 className="mb-4 text-gray-500 font-bold ">Últimos retos completados</h2>
      <div className="flex flex-col gap-4">
        {userChallenges?.slice(0, 10)?.map(obj => <ChallengeCard userChallenge={obj} todayStr={todayStr} />)}
      </div>
    </div>
  )
}
import { IDailyChallenge, IUserChallenge } from "@/types/IChallenge"
import Link from "next/link"
import { Badge, DisabledBadge } from "../Badge"
import { defaultImg } from "@/utils/default"

export const TodayChallenges = ({challenges = [], isMainDesign = true, userTodayChallenges = []}: {challenges: IDailyChallenge[], isMainDesign?: boolean, userTodayChallenges?: IUserChallenge[]}) => {

  const mainDesignContainer = isMainDesign ? "max-w-[850] justify-center px-4 md:grid md:grid-cols-2" : "justify-center"

  return (
    <section>
      {challenges.length === 0 ? (
        <p className="text-center">Estamos eligiendo los retos de hoy...</p>
      ) : (
        <div className={`${mainDesignContainer} mx-auto flex flex-wrap gap-4 lg:p-0`}>
          {challenges.map((c, index) => {
            const isConfirmed = userTodayChallenges.find(obj => obj.challenge.id === c.challenge.id)
            return (
              <Link key={c.id} href={`/challenges/${c.challenge.id}`} className={`relative ${index === 2 ? "col-span-2 row-span-2" : ""} shadow-xl group`}>
                <article>
                  <img
                    className={`w-full ${(index === 2 && isMainDesign) ? "h-150" : "h-100"} object-cover rounded-lg bg-gray-900`}
                    src={c?.challenge?.image || defaultImg}
                    alt={c.challenge.title}
                  />
                  <div className={`absolute top-0 left-0 w-full h-full rounded-lg ${isConfirmed ? "opacity-60": "opacity-50 animate-background-shine"} duration-700 group-hover:opacity-30 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]`}></div>
                  <div className="absolute z-10 bottom-0 left-0 w-full p-4">
                    <h2 className={`${index === 2 ? "text-3xl" : "h-text-xl"} text-shadow-lg/30`}>
                      {c.challenge.title}
                    </h2>
                    <div className="flex gap-2 my-1">
                      {isConfirmed && (
                        <DisabledBadge>
                          Reto completado
                        </DisabledBadge>
                      )}
                      <Badge>
                        {c.challenge.category}
                      </Badge>
                    </div>
                    <p className={`${index === 2 ? "text-lg" : ""} text-gray-300 text-shadow-lg/30 mt-1 text-balance`}>
                      {c.challenge.description}
                    </p>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

import { IDailyChallenge } from "@/types/IChallenge"
import Link from "next/link"
import { Badge } from "../Badge"

export const TodayChallenges = ({challenges}: {challenges: IDailyChallenge[]}) => {
  return (
    <section>
      {challenges.length === 0 ? (
        <p className="text-center">Estamos eligiendo los retos de hoy...</p>
      ) : (
        <div className='max-w-[1200] mx-auto px-4 flex flex-wrap justify-center gap-4 md:grid md:grid-cols-2'>
          {challenges.map((c, index) => (
            <Link key={c.id} href={`challenges/${c.challenge.id}`} className={`relative ${index === 2 ? "col-span-2 row-span-2" : ""} shadow-xl`}>
              <article>
                <img
                  className="w-full h-100 object-cover rounded-lg md:h-150 bg-gray-900"
                  src="https://media.revistagq.com/photos/5d35929de887bb000828e8f3/16:9/w_1920,c_limit/GettyImages-982408932-(1).jpg"
                  alt=""
                />
                <div className="absolute top-0 left-0 w-full h-full rounded-lg opacity-50 duration-700 hover:opacity-30 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] animate-background-shine"></div>
                <div className="absolute z-10 bottom-0 left-0 w-full p-4">
                  <h2 className='text-xl text-shadow-lg/30'>
                    {c.challenge.title}
                  </h2>
                  <Badge>
                    {c.challenge.category}
                  </Badge>
                  <p className='text-gray-300 text-shadow-lg/30 mt-1'>
                    {c.challenge.description}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

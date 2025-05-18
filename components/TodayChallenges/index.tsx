import { IDailyChallenge } from "@/types/IChallenge"
import Link from "next/link"

export const TodayChallenges = ({challenges}: {challenges: IDailyChallenge[]}) => {
  return (
    <section>
      {challenges.length === 0 ? (
        <p className="text-center">Estamos eligiendo los retos de hoy...</p>
      ) : (
        <div className='max-w-[1200] mx-auto px-2 flex flex-wrap justify-center gap-4 md:grid md:grid-cols-2'>
          {challenges.map((c, index) => (
            <article key={c.id} className={`${index === 2 ? "col-span-2 row-span-2" : ""}`}>
              <img
                className="w-full h-100 object-cover rounded-lg md:h-150 bg-gray-900"
                src="https://media.revistagq.com/photos/5d35929de887bb000828e8f3/16:9/w_1920,c_limit/GettyImages-982408932-(1).jpg"
                alt=""
              />
              {index}
              <h2 className='text-xl'>
                {c.challenge.title}
              </h2>
              <span className='capitalize'>
                {c.challenge.category}
              </span>
              <p className='text-gray-300'>
                {c.challenge.description}
              </p>
              <Link className="block p-4 mt-6 bg-blue-800 rounded-md hover:bg-blue-700" href={`challenges/${c.challenge.id}`}>Iniciar reto</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

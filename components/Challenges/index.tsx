import { IChallenge, IUserChallenge } from '@/types/IChallenge';
import Link from 'next/link';
import { Badge, DisabledBadge } from '../Badge';
import { defaultImg } from '@/utils/default';

export const Challenges = ({
  challenges = [],
  isMainDesign = true,
  userTodayChallenges = [],
}: {
  challenges: IChallenge[];
  isMainDesign?: boolean;
  userTodayChallenges?: IUserChallenge[];
}) => {
  const mainDesignContainer = isMainDesign
    ? 'max-w-[850] justify-center px-4 md:grid md:grid-cols-2'
    : 'justify-center';

  return (
    <section>
      {challenges.length === 0 ? (
        <p className="text-center">Estamos eligiendo los retos de hoy...</p>
      ) : (
        <div
          className={`${mainDesignContainer} mx-auto flex flex-wrap gap-4 lg:p-0`}
        >
          {challenges.map((challenge, index) => {
            const isConfirmed = userTodayChallenges.find(
              (obj) => obj.challenge.id === challenge.id
            );

            return (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className={`relative ${
                  index === 2 ? 'col-span-2 row-span-2' : ''
                } shadow-xl group`}
              >
                <article>
                  <img
                    className={`w-full h-100 object-cover rounded-lg bg-gray-900`}
                    src={challenge?.image || defaultImg}
                    alt={challenge.title}
                  />
                  <div
                    className={`absolute top-0 left-0 w-full h-full rounded-lg opacity-50 animate-background-shine duration-700 group-hover:opacity-30 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]`}
                  ></div>
                  <div className="absolute z-10 bottom-0 left-0 w-full p-4">
                    <h2 className="text-xl text-shadow-lg/30">
                      {challenge.title}
                    </h2>
                    <div className="flex gap-2 my-1">
                      {isConfirmed && (
                        <DisabledBadge>Reto completado</DisabledBadge>
                      )}
                      <Badge>{challenge.category}</Badge>
                    </div>
                    <p className="text-gray-300 text-shadow-lg/30 mt-1 text-balance">
                      {challenge.description}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

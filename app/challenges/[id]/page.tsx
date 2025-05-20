import { Badge, DisabledBadge } from '@/components/Badge';
import { ChallengeOptions } from '@/app/challenges/[id]/components/ChallengeOptions';
import { getChallenge } from '@/services/getChallenge';
import { redirect } from 'next/navigation';
import { getTodayChallenges } from '@/services/getTodayChallenges';
import { Metadata } from 'next';

type Props = {params: Promise<{ id: string }>}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id } = await params

  const challenge = await getChallenge({ id });

  return {
    title: `${challenge?.title || "Reto"} | Clean Body`,
    description: challenge?.description || 'Un cuerpo activo compila mejor',
  }
}

export default async function Challenge({params}: Props) {
  const { id } = await params;
  if (!id) return redirect('/');

  const [challenge, todayChallenges] = await Promise.all([
    getChallenge({ id }),
    getTodayChallenges(),
  ]);

  if (!challenge) return redirect('/');

  const isTodayChallenge = todayChallenges.find(obj => obj.challenge.id === challenge.id)

  return (
    <main className='h-screen'>
      <img
        className="w-full h-screen max-h-screen object-cover opacity-5 absolute -z-10"
        src="https://media.revistagq.com/photos/5d35929de887bb000828e8f3/16:9/w_1920,c_limit/GettyImages-982408932-(1).jpg"
        alt=""
      />
      <div className='p-4 pt-10 lg:p-10'>
        <h1 className='text-5xl'>
          {challenge.title}
        </h1>
        <div className='my-2 flex gap-2'>
          {!isTodayChallenge && (
            <DisabledBadge>
              No disponible hoy
            </DisabledBadge>
          )}
          <Badge>
            {challenge.category}
          </Badge>
        </div>
        <p className='text-balance my-4 text-gray-300'>
          {challenge.description}
        </p>
        <ChallengeOptions
          challenge={challenge}
          todayChallenges={todayChallenges}
        />
      </div>
    </main>
  )
}

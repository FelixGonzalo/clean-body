import { Badge, DisabledBadge } from '@/components/Badge';
import { ChallengeOptions } from '@/app/challenges/[id]/components/ChallengeOptions';
import { getChallenge } from '@/services/getChallenge';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getSeasonalChallenges } from '@/services/getSeasonalChallenges';
import { defaultImg } from '@/utils/default';

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

  const [challenge, seasonalChallenges] = await Promise.all([
    getChallenge({ id }),
    getSeasonalChallenges(),
  ]);

  if (!challenge) return redirect('/');

  const isSeasonalChallenge = seasonalChallenges.find(obj => obj.id === challenge.id);

  return (
    <>
      <img
        className="w-full h-screen max-h-screen object-cover opacity-5 absolute -z-10"
        src={challenge?.image || defaultImg}
        alt={challenge.title}
      />
      <div className='p-4 pt-10 lg:p-10'>
        <h1 className='text-5xl'>
          {challenge.title}
        </h1>
        <div className='my-2 flex gap-2'>
          <Badge>
            {challenge.category}
          </Badge>
          {isSeasonalChallenge && (
            <DisabledBadge>
              Reto de temporada
            </DisabledBadge>
          )}
        </div>
        <p className='text-balance my-4 text-gray-300'>
          {challenge.description}
        </p>
        <ChallengeOptions
          challenge={challenge}
          seasonalChallenges={seasonalChallenges}
        />
      </div>
    </>
  )
}

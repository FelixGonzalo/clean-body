import { Badge } from '@/components/Badge';
import { ChallengeOptions } from '@/app/challenges/[id]/components/ChallengeOptions';
import { getChallenge } from '@/services/getChallenge';

interface Params {
  params: { id: string };
}

export default async function Challenge({ params }: Params) {

  if (!params?.id) return <main>No hay reto</main>

  const challenge = await getChallenge({id: params.id})

  if (!challenge) return <main>No hay reto</main>

  return (
    <main className='h-screen'>
      <img
        className="w-full max-h-screen object-cover opacity-5 absolute -z-10"
        src="https://media.revistagq.com/photos/5d35929de887bb000828e8f3/16:9/w_1920,c_limit/GettyImages-982408932-(1).jpg"
        alt=""
      />
      <div className='p-4 lg:p-10'>
        <h1 className='text-5xl'>
          {challenge.title}
        </h1>
        <Badge>
          {challenge.category}
        </Badge>
        <p className='text-balance my-4 text-gray-300'>
          {challenge.description}
        </p>
        <ChallengeOptions challenge={challenge} />
      </div>
    </main>
  )
}

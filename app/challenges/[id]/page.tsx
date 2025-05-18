'use client';

import { useSupabase } from '@/lib/supabase-provider';
import { IChallenge } from '@/types/IChallenge';
import { useEffect, useState } from 'react';

interface Params {
  params: { id: string };
}

export default function Challenge({ params }: Params) {
  const { supabase } = useSupabase()
  const [challenge, setChallenge] = useState<IChallenge | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      if (!params || !supabase) return;

    async function loadChallenge() {
      if (!params || !supabase) return;

      setLoading(true)
      const { data, error } = await supabase.from('challenges')
        .select('*')
        .eq('id', params.id)
        .single();
      if (!error) setChallenge(data)
      setLoading(false)
    }

    loadChallenge()
  }, [])

  const onChallengeCheck = async () => {
    console.log("iniciando")


    if (!challenge || !supabase) return;
    console.log("ejecutando")
    // const client = createClerkSupabaseClient()
    await supabase.from('user_challenge_progress').insert({
      challenge_id: challenge.id,
    })
  };

  if (loading) return <main>Cargando</main>

  if (!challenge) return <main>No hay reto</main>

  return (
    <main className='h-screen'>
      <img
        className="w-full max-h-screen object-cover opacity-5 absolute -z-10"
        src="https://media.revistagq.com/photos/5d35929de887bb000828e8f3/16:9/w_1920,c_limit/GettyImages-982408932-(1).jpg"
        alt=""
      />
      <div className='p-2 md:p-4 lg:p-10'>
        <h1 className='text-5xl'>
          {challenge.title}
        </h1>
        <span className='capitalize text-balance my-2 text-gray-300'>
          {challenge.category}
        </span>
        <p className='text-balance my-2 text-gray-300'>
          {challenge.description}
        </p>
        {/* <ChallengeCheck /> */}
        <button
          className="block p-4 mt-6 bg-blue-800 rounded-md hover:bg-blue-700"
          onClick={() => onChallengeCheck()}
        >
          Reto cumplido
        </button>
      </div>
    </main>
  )
}

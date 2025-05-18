'use client';

import { IChallenge } from "@/types/IChallenge";
import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

export const ChallengeCheck = ({challenge}: {challenge?: IChallenge}) => {
  const { session } = useSession()

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null
        },
      },
    )
  }

  const onChallengeCheck = async () => {
    console.log("iniciando")

    if (!challenge) return;
    console.log("ejecutando")
    const client = createClerkSupabaseClient()
    await client.from('user_challenge_progress').insert({
      name: challenge.id,
    })
  };


  return (
    <button
      className="block p-4 mt-6 bg-blue-800 rounded-md hover:bg-blue-700"
      onClick={onChallengeCheck}
    >
      Reto cumplido
    </button>
  );
};

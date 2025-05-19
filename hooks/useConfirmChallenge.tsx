import { createSupabaseClient } from "@/lib/supabase-client";
import { useState } from "react";

export const useConfirmChallenge = () => {
  const [loading, setLoading] = useState(false);
  const handle = async ({
    session,
    challenge_id,
  }: {
    session: any;
    challenge_id: string;
  }) => {
    setLoading(true);
    const client = createSupabaseClient(session);
    await client.from('user_challenge_progress').insert({
      challenge_id,
    });
    setLoading(false);
  };

  return { loading, handle };
};

'use client';

import { useGetTodayChallenges } from '@/hooks/useGetTodayChallenges';
import { useEffect } from 'react';
import { Loader } from '../Loader';
import { TodayChallenges } from '../TodayChallenges';
import { useSession } from '@clerk/nextjs';

export const DailyChallenges = () => {
  const GetTodayChallenges = useGetTodayChallenges();
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;
    GetTodayChallenges.handle({session});
  }, [session]);

  console.log('GetTodayChallenges', GetTodayChallenges.data);

  return (
    <>
      {GetTodayChallenges.loading ? (
        <div className="flex justify-center h-20">
          <Loader />
        </div>
      ) : (
        <TodayChallenges challenges={GetTodayChallenges.data} />
      )}
    </>
  );
};

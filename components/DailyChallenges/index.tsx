'use client';

import { useGetTodayChallenges } from '@/hooks/useGetTodayChallenges';
import { useEffect } from 'react';
import { Loader } from '../Loader';
import { TodayChallenges } from '../TodayChallenges';

export const DailyChallenges = () => {
  const GetTodayChallenges = useGetTodayChallenges();

  useEffect(() => {
    GetTodayChallenges.handle({});
  }, []);

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

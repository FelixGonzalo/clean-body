'use client';

import { IChallenge } from '@/types/IChallenge';
import { useClerk, useSession } from '@clerk/nextjs';
import CountdownTimer, { CountdownTimerHandle } from '../../../../../components/CountdownTimer';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@/components/Loader';
import { Button, buttonStyle, ConfirmButton } from '@/components/Button';
import { getRandomMessage } from '@/utils/getRandomMessage';
import { TodayChallenges } from '@/components/TodayChallenges';
import Link from 'next/link';
import { ProgressShareButton } from '@/components/ProgressShareButton';
import { useConfirmChallenge } from '@/hooks/useConfirmChallenge';
import { useGetUserTodayChallenges } from '@/hooks/useGetUserTodayChallenges';
import { useGetTodayChallenges } from '@/hooks/useGetTodayChallenges';
import { Challenges } from '@/components/Challenges';
import { defaultImg } from '@/utils/default';

const STEP = {
  INITIAL: 1,
  START_TIMER: 2,
  SHOW_CONFIRM: 3,
  SUCCESS: 4,
};

const getLastChallengeWithTimerCompleted = () => {
  const localStorageChallenge = localStorage.getItem("challenge");
  return localStorageChallenge ? JSON.parse(localStorageChallenge) : null;
}

const removeLastChallenge = () => {
  localStorage.removeItem("challenge");
}

export const ChallengeOptions = ({ challenge, seasonalChallenges}: { challenge: IChallenge, seasonalChallenges: IChallenge[]}) => {
  const challengeFromLocalStorage = getLastChallengeWithTimerCompleted()
  const GetTodayChallenges = useGetTodayChallenges()

  const clerk = useClerk();
  const { session } = useSession();
  const ConfirmChallenge = useConfirmChallenge();
  const GetUserChallenges = useGetUserTodayChallenges()

  const timerRef = useRef<CountdownTimerHandle  | null>(null);
  const messageRef = useRef("");
  const [step, setStep] = useState(challengeFromLocalStorage?.id === challenge.id ? STEP.SHOW_CONFIRM : STEP.INITIAL);

  const isTodayChallenge = GetTodayChallenges.data.find(obj => obj.challenge.id === challenge.id)
  const isConfirmedChallenge = GetUserChallenges.data.find(obj => obj.challenge.id === challenge.id)

  const userChallengeUuids = GetUserChallenges.data.map(obj => obj.challenge.id)
  const allConfirmedDailyChallenges = GetTodayChallenges.data.every(obj => userChallengeUuids.includes(obj.challenge.id));
  const allConfirmedSeasonalChallenges = seasonalChallenges.every(obj => userChallengeUuids.includes(obj.id))
  const allConfirmedChallenges = allConfirmedDailyChallenges && allConfirmedSeasonalChallenges;

  const isSeasonalChallenge = seasonalChallenges.find(obj => obj.id === challenge.id);

  useEffect(() => {
    messageRef.current = getRandomMessage(allConfirmedChallenges)
  }, [])

  useEffect(() => {
    if (!session) return;
    GetUserChallenges.handle({session, userId: session.user.id})
    GetTodayChallenges.handle({session})
  }, [session])

  const onStart = async () => {
    removeLastChallenge();
    timerRef?.current?.startTimer?.();
    setStep(STEP.START_TIMER);
  };

  const onConfirm = async () => {
    if (!session) {
      clerk.openSignIn({});
      return;
    }
    await ConfirmChallenge.handle({
      session,
      challenge_id: challenge.id,
    });
    removeLastChallenge();
    setStep(STEP.SUCCESS);
    GetUserChallenges.handle({session, userId: session.user.id})
  };

  const onReset = () => {
    removeLastChallenge();
    timerRef?.current?.resetTimer?.();
    setStep(STEP.START_TIMER);
  };

  if (session && (GetUserChallenges.loading || GetTodayChallenges.loading)) {
    return (
      <div className="flex justify-start h-20">
        <Loader />
      </div>
    )
  }

  if (!isTodayChallenge && !isSeasonalChallenge) {
    return (
      <div className='mt-20'>
        <p className='text-center text-5xl mt-4 mb-10 text-red-400'>
          Los retos de hoy
        </p>
        <TodayChallenges
          challenges={GetTodayChallenges.data}
          userTodayChallenges={GetUserChallenges.data}
          isMainDesign={false}
        />
      </div>
    )
  }

  if (allConfirmedChallenges) {
    return (
      <div className='text-center mt-20 max-w-200 mx-auto'>
        <p className='text-5xl mt-4 mb-10 text-red-400 text-balance'>
          {messageRef.current}
        </p>
        <p className='text-xl text-balance'>
          Has completado todos los retos de hoy. ¡Felicidades!
        </p>
        <div className='flex gap-4 justify-center mt-10'>
          <ProgressShareButton user={session?.user} isConfirmButton />
          <Link
            className={buttonStyle}
            href={"/my-challenges"}
            children="Mis retos"
          />
        </div>
      </div>
    )
  }

  if (isConfirmedChallenge && !isSeasonalChallenge) {
    return (
      <div className='mt-20'>
        <p className='text-center text-5xl mt-4 mb-10 text-red-400'>
          Reto del día completado
        </p>
        <TodayChallenges
          challenges={GetTodayChallenges.data}
          userTodayChallenges={GetUserChallenges.data}
          isMainDesign={false}
        />
        <p className='text-center text-4xl mt-4 mb-10 text-red-400 mt-10'>
          Retos de temporada
        </p>
        <Challenges challenges={seasonalChallenges} userTodayChallenges={GetUserChallenges.data} isMainDesign={false} />
      </div>
    )
  }

  if (isConfirmedChallenge && isSeasonalChallenge) {
    return (
      <div className='mt-20'>
        <p className='text-center text-5xl mt-4 mb-10 text-red-400'>
          Reto de temporada completado
        </p>
        <Challenges challenges={seasonalChallenges} userTodayChallenges={GetUserChallenges.data} isMainDesign={false} />
        <p className='text-center text-4xl mt-4 mb-10 text-red-400 mt-10'>
          Retos del día
        </p>
        <TodayChallenges
          challenges={GetTodayChallenges.data}
          userTodayChallenges={GetUserChallenges.data}
          isMainDesign={false}
        />
      </div>
    )
  }

  if (step === STEP.SUCCESS) {
    return (
      <div className='mt-20'>
        <TodayChallenges
          challenges={GetTodayChallenges.data}
          userTodayChallenges={GetUserChallenges.data}
          isMainDesign={false}
        />
      </div>
    )
  }

  return (
    <div>
      <CountdownTimer
        ref={timerRef}
        time={3}
        // time={challenge?.timer || 60}
        onFinish={() => {
          setStep(STEP.SHOW_CONFIRM);
          localStorage.setItem("challenge", JSON.stringify(challenge));
        }}
      />
      <div className="mt-4">
        {ConfirmChallenge.loading ? (
          <div className="flex justify-start h-20">
            <Loader />
          </div>
        ) : (
          <>
            {step === STEP.INITIAL && (
              <Button
                onClick={onStart}
                children="Iniciar"
              />
            )}
            <div className="flex gap-4">
              {step === STEP.SHOW_CONFIRM && (
                <ConfirmButton
                  onClick={onConfirm}
                  children="Guardar"
                />
              )}
              {(step === STEP.SHOW_CONFIRM || step === STEP.START_TIMER) && (
                <Button
                  onClick={onReset}
                  children="Volver a empezar"
                />
              )}
            </div>
          </>
        )}
      </div>
      <img
          className="w-full md:max-w-[300] object-cover my-4 rounded-2xl"
          src={challenge?.image || defaultImg}
          alt={challenge.title}
      />
    </div>
  );
};

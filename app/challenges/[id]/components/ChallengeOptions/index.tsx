'use client';

import { IChallenge, IDailyChallenge } from '@/types/IChallenge';
import { useClerk, useSession } from '@clerk/nextjs';
import CountdownTimer from '../../../../../components/CountdownTimer';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@/components/Loader';
import { Button, buttonStyle, ConfirmButton } from '@/components/Button';
import { getRandomMessage } from '@/utils/getRandomMessage';
import { TodayChallenges } from '@/components/TodayChallenges';
import Link from 'next/link';
import { ProgressShareButton } from '@/components/ProgressShareButton';
import { useConfirmChallenge } from '@/hooks/useConfirmChallenge';
import { useGetUserTodayChallenges } from '@/hooks/useGetUserTodayChallenges';

const STEP = {
  INITIAL: 1,
  START_TIMER: 2,
  SHOW_CONFIRM: 3,
  SUCCESS: 4,
};

export const ChallengeOptions = ({ challenge, todayChallenges }: { challenge: IChallenge, todayChallenges: IDailyChallenge[] }) => {

  const clerk = useClerk();
  const { session } = useSession();
  const ConfirmChallenge = useConfirmChallenge();
  const GetUserChallenges = useGetUserTodayChallenges()

  const timerRef = useRef(null);
  const messageRef = useRef("");
  const [step, setStep] = useState(STEP.INITIAL);

  const isTodayChallenge = todayChallenges.find(obj => obj.challenge.id === challenge.id)
  const isConfirmedChallenge = GetUserChallenges.data.find(obj => obj.challenge.id === challenge.id)

  const userChallengeUuids = GetUserChallenges.data.map(obj => obj.challenge.id)
  const allConfirmedChallenges = todayChallenges.every(obj => userChallengeUuids.includes(obj.challenge.id))


  useEffect(() => {
    messageRef.current = getRandomMessage(allConfirmedChallenges)
  }, [])

  useEffect(() => {
    if (!session) return;
    GetUserChallenges.handle({session, userId: session.user.id})
  }, [session])

  const onStart = async () => {
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
    setStep(STEP.SUCCESS);
    GetUserChallenges.handle({session})
  };

  const onReset = () => {
    timerRef?.current?.resetTimer?.();
    setStep(STEP.START_TIMER);
  };

  if (session && GetUserChallenges.loading)  {
    return (
      <div className="flex justify-start h-20">
        <Loader />
      </div>
    )
  }

  if (!isTodayChallenge) {
    return (
      <div className='text-center mt-20'>
        <p className='text-5xl mt-4 mb-10 text-red-400'>
          Los retos de hoy
        </p>
        <TodayChallenges
          challenges={todayChallenges}
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

  if (isConfirmedChallenge) {
    return (
      <div className='mt-20'>
        <p className='text-center text-5xl mt-4 mb-10 text-red-400'>
          Reto completado
        </p>
        <TodayChallenges
          challenges={todayChallenges}
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
          challenges={todayChallenges}
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
        time={challenge?.timer}
        onFinish={() => {
          setStep(STEP.SHOW_CONFIRM);
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
    </div>
  );
};

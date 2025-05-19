'use client';

import { IChallenge } from '@/types/IChallenge';
import { useClerk, useSession } from '@clerk/nextjs';
import CountdownTimer from '../../../../../components/CountdownTimer';
import { useRef, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase-client';
import { Loader } from '@/components/Loader';
import { Button, ConfirmButton } from '@/components/Button';
import { getRandomMessage } from '@/utils/getRandomMessage';

const STEP = {
  INITIAL: 1,
  START_TIMER: 2,
  SHOW_CONFIRM: 3,
  SUCCESS: 4,
};

const useConfirmChallenge = () => {
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

export const ChallengeOptions = ({ challenge }: { challenge: IChallenge }) => {
  const clerk = useClerk();
  const { session } = useSession();
  const ConfirmChallenge = useConfirmChallenge();
  const timerRef = useRef(null);
  const [step, setStep] = useState(STEP.INITIAL);

  const onStart = async () => {
    if (!session) {
      clerk.openSignIn({});
      return;
    }
    timerRef?.current?.startTimer?.();
    setStep(STEP.START_TIMER);
  };

  const onConfirm = async () => {
    await ConfirmChallenge.handle({
      session,
      challenge_id: challenge.id,
    });
    setStep(STEP.SUCCESS);
  };

  const onReset = () => {
    timerRef?.current?.resetTimer?.();
    setStep(STEP.START_TIMER);
  };

  if (step === STEP.SUCCESS) {
    return (
      <div className='text-center mt-20'>
        <p className='text-5xl mt-4 mb-10 text-red-400'>
          {getRandomMessage()}
        </p>
        <Button
          onClick={() => {}}
          children="Ver siguiente reto"
        />
      </div>
    )
  }

  return (
    <div>
      <CountdownTimer
        ref={timerRef}
        time={3}
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

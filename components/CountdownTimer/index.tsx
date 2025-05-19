'use client';

import { Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
/** Por defecto de 1 minuto */
const CountdownTimer = ({ref, time = 60, onFinish} : {ref: Ref<unknown>,time?: number, onFinish?: () => void}) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const [start, setStart] = useState(false);
  const ref_timer = useRef<NodeJS.Timeout | null>(null)

  const runTimer = () => {
    ref_timer.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  }

  const resetTimer = () => {
    if (ref_timer?.current) {
      clearInterval(ref_timer.current)
      setTimeLeft(time)
    }
  }

  useImperativeHandle(ref, () => {
    return {
      startTimer: () => setStart(true),
      resetTimer,
    };
  }, []);

  useEffect(() => {
    if (!start) return

    if (timeLeft === 0) {
      onFinish?.()
      return;
    }

    runTimer()

    return () => {
      if (ref_timer?.current) {
        clearInterval(ref_timer.current)
      }
    };
  }, [timeLeft, start]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const zeroStyle = timeLeft > 0 ? "" : "text-red-500"

  return (
    <div className={`text-5xl ${zeroStyle}`}>
      {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
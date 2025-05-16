'use client'

import { IDailyChallenge } from '@/types/IChallenge'
import { useEffect, useState } from 'react'

export const TodayChallenges = () => {
  const [challenges, setChallenges] = useState<IDailyChallenge[]>([])

  useEffect(() => {
    fetch('/api/today-challenges')
      .then(res => res.json())
      .then(data => setChallenges(data))
  }, [])

  return (
    <section>
      <h2>Retos del día</h2>
      {challenges.length === 0 ? (
        <p>Cargando retos...</p>
      ) : (
        <ul>
          {challenges.map(c => (
            <li key={c.id}>{c.challenge.title}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

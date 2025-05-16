import { getTodayChallenges } from '@/services/getTodayChallenges'

export default async function Challenges() {
  const challenges = await getTodayChallenges()

  return <pre>{JSON.stringify(challenges, null, 2)}</pre>
}

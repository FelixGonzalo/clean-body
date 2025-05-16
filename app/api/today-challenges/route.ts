
import { getTodayChallenges } from '@/services/getTodayChallenges'
import { NextResponse } from 'next/server'

export async function GET() {
  const challenges = await getTodayChallenges()
  return NextResponse.json(challenges)
}
const CHALLENGE_CATEGORY = {
  STRETCHING: "estiramiento",
  EXERCISE: "exercise",
  VISUAL: "visual",
  MENTAL: "mental"
}

type TChallengeCategory = typeof CHALLENGE_CATEGORY[keyof typeof CHALLENGE_CATEGORY]

export interface IChallenge {
  id: string
  title: string
  category: TChallengeCategory
  description: string
  timer: number
  image?: string
}

export interface IDailyChallenge {
  id: number
  created_at: string
  challenge: IChallenge
}

export interface IUserChallenge {
  id: number
  created_at: string
  challenge: IChallenge
}
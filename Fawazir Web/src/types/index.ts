// Shared TypeScript types derived from Prisma schema

export interface User {
    id: string
    email: string
    displayName: string | null
    avatar: string | null
    color: string | null
    bio: string | null
    role: string
    createdAt: Date
    updatedAt: Date
}

export interface Competition {
    id: string
    code: string
    title: string
    description: string | null
    bannerUrl: string | null
    ownerId: string
    status: string
    startDate: Date | null
    visibilityType: string
    createdAt: Date
    updatedAt: Date
}

export interface Day {
    id: string
    competitionId: string
    dayNumber: number
    title: string
    content: string | null
    challengeTitle: string | null
    challengeContent: string | null
    unlockDate: Date | null
    isManualOpen: boolean
    visibilityType: string
    createdAt: Date
    updatedAt: Date
}

export interface Team {
    id: string
    name: string
    competitionId: string
    createdAt: Date
}

export interface Participation {
    id: string
    userId: string
    competitionId: string
    teamId: string | null
    totalScore: number
    stars: number
    joinedAt: Date
    user: User
    team: Team | null
}

export interface Question {
    id: string
    dayId: string
    text: string
    type: string
    options: string[]
    correctAnswer: string | null
    points: number
    isMandatory: boolean
}

export interface Submission {
    id: string
    userId: string
    questionId: string
    answer: string
    isCorrect: boolean
    ratingStars: number | null
    feedback: string | null
    createdAt: Date
    user: User
    question: Question & { day: Day }
}

// Stats types
export interface CompetitionStats {
    activeDays: number
    totalParticipants: number
    questionsCount: number
    submissionsCount: number
    engagement: number
}

export interface ProgressStats {
    totalStars: number
    engagement: number
}

// Action result types
export interface ActionResult {
    success?: boolean
    error?: string
    message?: string
    errors?: Record<string, string | string[]>
}

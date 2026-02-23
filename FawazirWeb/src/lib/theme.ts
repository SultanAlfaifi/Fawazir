import { Shield, Stethoscope, Cat, MicOff } from 'lucide-react'

export const CHARACTER_THEMES = {
    NAJM: {
        color: 'emerald',
        icon: Shield,
        label: 'نجم',
        description: 'شجاعة • قوة',
        bgPattern: 'bg-[url("/patterns/shield.svg")]', // Placeholder
    },
    DOCTOR: {
        color: 'blue',
        icon: Stethoscope,
        label: 'دكتور',
        description: 'ذكاء • ابتكار',
        bgPattern: 'bg-[url("/patterns/plus.svg")]',
    },
    BISSA: {
        color: 'orange',
        icon: Cat,
        label: 'بسة',
        description: 'مرح • خدع',
        bgPattern: 'bg-[url("/patterns/paw.svg")]',
    },
    SAMIT: {
        color: 'red',
        icon: MicOff,
        label: 'صامت',
        description: 'غضب • حزم',
        bgPattern: 'bg-[url("/patterns/mute.svg")]',
    },
} as const

export type CharacterType = keyof typeof CHARACTER_THEMES

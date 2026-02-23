'use client'

import { useEffect, useState } from 'react'

export function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        const target = new Date(targetDate).getTime()

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = target - now

            if (distance < 0) {
                setTimeLeft('متاح الآن!')
                clearInterval(interval)
                return
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

            if (days > 0) {
                setTimeLeft(`${days} يوم و ${hours} ساعة`)
            } else {
                setTimeLeft(`${hours}س ${minutes}د`)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    return (
        <span className="font-mono text-amber-500 font-bold tracking-wider">
            {timeLeft || '...'}
        </span>
    )
}

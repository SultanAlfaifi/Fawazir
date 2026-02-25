import React from 'react'
import { HomeNavbar } from '@/components/home/HomeNavbar'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeHowItWorks } from '@/components/home/HomeHowItWorks'
import { HomeSultana } from '@/components/home/HomeSultana'
import { HomeFooter } from '@/components/home/HomeFooter'

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "فوازير",
        "url": "https://fawazir.com",
        "description": "اصنع مسابقتك، كُن القائد - منصة إدارة التحديات الذكية",
    }

    return (
        <div className="min-h-dynamic bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeNavbar />
            <main>
                <HomeHero />
                <HomeHowItWorks />
                <HomeSultana />
            </main>
            <HomeFooter />
        </div>
    )
}

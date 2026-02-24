import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'فوازير',
        short_name: 'فوازير',
        description: 'منصة التحديات والمعرفة الأولى المدعومة بالذكاء الاصطناعي',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f59e0b',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/images/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}

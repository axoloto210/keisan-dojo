import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/ja', '/en-US', '/fr'],
            disallow: ['/$', '/guide/'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
    }
}

export const dynamic = 'force-static';

export default function robots() {
    const baseUrl = 'https://cnvmp3.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

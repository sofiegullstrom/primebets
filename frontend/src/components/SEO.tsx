import { Helmet } from 'react-helmet-async'

interface SEOProps {
    title?: string
    description?: string
    keywords?: string
    ogImage?: string
    ogType?: string
    canonical?: string
}

export function SEO({
    title = 'PrimeBets - Travintelligens med AI-analys | Bästa travtipsen',
    description = 'PrimeBets kombinerar expertkunskap med AI-analys för att ge dig de bästa travtipsen. Dagliga PrimePicks, statistik och analys för smartare travspel.',
    keywords = 'trav, travtips, travintelligens, AI-analys, travspel, hästar, odds, PrimeBets, svenska spel, travstatistik, ROI, speltips',
    ogImage = 'https://primebets.se/logo.png',
    ogType = 'website',
    canonical
}: SEOProps) {
    const fullTitle = title.includes('PrimeBets') ? title : `${title} | PrimeBets`
    const url = canonical || 'https://primebets.se'

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="PrimeBets" />
            <meta property="og:locale" content="sv_SE" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />

            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Swedish" />
            <meta name="author" content="PrimeBets" />
            <meta name="geo.region" content="SE" />
            <meta name="geo.placename" content="Sweden" />

            {/* Mobile */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#10b981" />

            {/* Schema.org for Google */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "PrimeBets",
                    "description": description,
                    "url": "https://primebets.se",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://primebets.se/analys?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "PrimeBets",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://primebets.se/logo.png"
                        }
                    }
                })}
            </script>
        </Helmet>
    )
}

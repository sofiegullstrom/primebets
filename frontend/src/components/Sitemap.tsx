import { useEffect } from 'react'

export function Sitemap() {
    useEffect(() => {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://primebets.se/</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://primebets.se/auth</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://primebets.se/analys</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://primebets.se/metod</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://primebets.se/historik</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://primebets.se/kontakt</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://primebets.se/terms</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://primebets.se/privacy</loc>
    <lastmod>2025-12-14</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`

        // Set content type and output
        const blob = new Blob([sitemap], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        window.location.href = url
    }, [])

    return null
}

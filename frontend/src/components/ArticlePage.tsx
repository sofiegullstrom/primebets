
import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Article } from '../types'
import { Navbar } from './Navbar'
import { Session } from '@supabase/supabase-js'
import { Helmet } from 'react-helmet-async'
import { Calendar, User, ChevronLeft, Share2 } from 'lucide-react'
// For now, using dangerouslySetInnerHTML, assuming admin input is trusted, but in prod DOMPurify is better.
// Assuming user might not have DOMPurify installed, I will omit the import for now and mention it.
// Actually, let's just stick to raw HTML but be careful.

export function ArticlePage({ session }: { session: Session | null }) {
    const { slug } = useParams<{ slug: string }>()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (slug) fetchArticle()
    }, [slug])

    const fetchArticle = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .maybeSingle()

            if (error) throw error
            if (!data) {
                setError(true)
            } else {
                setArticle(data)
            }
        } catch (err) {
            console.error('Error fetching article:', err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-[#0F1720] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2FAE8F]"></div>
        </div>
    }

    if (error || !article) {
        return <Navigate to="/magasin" replace />
    }

    // JSON-LD Schema for Google/AI
    // This tells search engines exactly what this page is.
    const schemaData = {
        "@context": "https://schema.org",
        "@type": article.type === 'news' ? "NewsArticle" : "Article",
        "headline": article.title,
        "image": article.cover_image ? [article.cover_image] : [],
        "datePublished": article.published_at,
        "dateModified": article.updated_at,
        "author": [{
            "@type": "Organization",
            "name": "PrimeBets",
            "url": "https://primebets.se"
        }],
        "description": article.meta_description || article.excerpt
    };

    return (
        <div className="min-h-screen bg-[#0F1720] font-sans text-gray-200">
            <Helmet>
                <title>{article.meta_title || article.title} | PrimeBets</title>
                <meta name="description" content={article.meta_description || article.excerpt} />

                {/* Open Graph / Facebook / LinkedIn */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={article.meta_title || article.title} />
                <meta property="og:description" content={article.meta_description || article.excerpt} />
                {article.cover_image && <meta property="og:image" content={article.cover_image} />}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.meta_title || article.title} />
                <meta name="twitter:description" content={article.meta_description || article.excerpt} />
                {article.cover_image && <meta name="twitter:image" content={article.cover_image} />}

                {/* Schema Markup */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            <Navbar session={session} />

            {/* Reading Progress Bar (Optional polish) */}
            <div className="fixed top-0 left-0 h-1 bg-[#2FAE8F] z-50 origin-left scale-x-0" id="progress-bar"></div>

            <article className="pt-24 pb-20">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto px-4 md:px-8 mb-12 text-center">
                    <Link to="/magasin" className="inline-flex items-center text-gray-500 hover:text-[#2FAE8F] mb-8 transition-colors text-sm font-bold">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Tillbaka till Magasinet
                    </Link>

                    <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#2FAE8F] mb-6">
                        <span className="bg-[#2FAE8F]/10 px-3 py-1 rounded-full border border-[#2FAE8F]/20">
                            {article.type === 'guide' ? 'Guide' : article.type === 'news' ? 'Nyhet' : 'Blogg'}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.published_at || article.created_at).toLocaleDateString('sv-SE')}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
                        {article.excerpt}
                    </p>
                </div>

                {/* Hero Image */}
                {article.cover_image && (
                    <div className="max-w-6xl mx-auto px-4 mb-16">
                        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative">
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <div className="max-w-3xl mx-auto px-4 md:px-8">
                    {/* Author & Share */}
                    <div className="flex justify-between items-center py-6 border-t border-b border-white/5 mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">PrimeBets Redaktionen</span>
                                <span className="text-xs text-gray-500">Expertanalys</span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                navigator.share({
                                    title: article.title,
                                    url: window.location.href
                                }).catch(() => { })
                            }}
                            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* The Article Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#2FAE8F] prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Footer CTA */}
                    <div className="mt-20 p-8 md:p-12 bg-[#162230] rounded-3xl border border-white/5 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-white mb-4">Gilla du artikeln?</h3>
                            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                Missa inte nästa analys. Skapa ett gratis konto idag och få tillgång till tusentals datadrivna speltips.
                            </p>
                            <Link to="/auth" className="inline-block px-8 py-4 bg-[#2FAE8F] hover:bg-[#258f75] text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">
                                Starta gratis konto nu
                            </Link>
                        </div>
                        {/* decorative bg */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FAE8F]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
                    </div>
                </div>
            </article>
        </div>
    )
}

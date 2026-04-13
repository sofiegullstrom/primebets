
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Article } from '../types'
import { Link } from 'react-router-dom'
import { Newspaper, ChevronRight, BookOpen, Calendar } from 'lucide-react'
import { Navbar } from './Navbar'
import { Session } from '@supabase/supabase-js'

export function ContentHub({ session }: { session: Session | null }) {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'blog' | 'news' | 'report' | 'guide'>('all')

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('status', 'published')
                .order('published_at', { ascending: false })

            if (error) throw error
            if (data) setArticles(data)
        } catch (error) {
            console.error('Error fetching articles:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredArticles = filter === 'all'
        ? articles
        : articles.filter(a => a.type === filter)

    // Featured Article (Most recent)
    const featuredArticle = articles.length > 0 ? articles[0] : null
    // The rest
    const listArticles = articles.length > 0 ? filteredArticles.filter(a => a.id !== featuredArticle?.id) : []

    const categories = [
        { id: 'all', label: 'Alla' },
        { id: 'news', label: 'Nyheter' },
        { id: 'blog', label: 'Blogg' },
        { id: 'guide', label: 'Betting School' },
        { id: 'report', label: 'Rapporter' },
    ]

    return (
        <div className="min-h-screen bg-[#0F1720] font-sans">
            <Navbar session={session} />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#2FAE8F]/10 text-[#2FAE8F] text-xs font-bold uppercase tracking-widest mb-4 border border-[#2FAE8F]/20">
                        Kunskapsbanken
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        PrimeBets Magasin
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Analyser, nyheter, guider och djupgående reportage om trav och spel.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id as any)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat.id
                                ? 'bg-white text-black shadow-lg scale-105'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2FAE8F]"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Featured Article */}
                        {featuredArticle && filter === 'all' && (
                            <Link to={`/magasin/${featuredArticle.slug}`} className="group relative block w-full rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[21/8]">
                                <div className="absolute inset-0 bg-gray-800">
                                    {featuredArticle.cover_image ? (
                                        <img
                                            src={featuredArticle.cover_image}
                                            alt={featuredArticle.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#162230] to-[#0F1720]" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1720] via-[#0F1720]/50 to-transparent" />

                                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${featuredArticle.type === 'news' ? 'bg-blue-500/20 text-blue-400' :
                                            featuredArticle.type === 'guide' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-[#2FAE8F]/20 text-[#2FAE8F]'
                                            }`}>
                                            {featuredArticle.type === 'guide' ? 'Guide' :
                                                featuredArticle.type === 'news' ? 'Nyhet' :
                                                    featuredArticle.type === 'report' ? 'Rapport' : 'Blogg'}
                                        </span>
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {featuredArticle.published_at ? new Date(featuredArticle.published_at).toLocaleDateString('sv-SE') : ''}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-[#2FAE8F] transition-colors">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-gray-300 text-base md:text-xl line-clamp-2 md:line-clamp-3 max-w-2xl font-light leading-relaxed">
                                        {featuredArticle.excerpt}
                                    </p>
                                </div>
                            </Link>
                        )}

                        {/* Grid of Articles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {listArticles.map((article) => (
                                <Link key={article.id} to={`/magasin/${article.slug}`} className="group flex flex-col bg-[#162230] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="relative aspect-video bg-gray-800 overflow-hidden">
                                        {article.cover_image ? (
                                            <img
                                                src={article.cover_image}
                                                alt={article.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#1B2A3B]">
                                                <Newspaper className="w-12 h-12 text-gray-600" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${article.type === 'news' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' :
                                                article.type === 'guide' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' :
                                                    'bg-[#2FAE8F]/20 text-[#2FAE8F] border border-[#2FAE8F]/30'
                                                }`}>
                                                {article.type === 'guide' ? 'Guide' :
                                                    article.type === 'news' ? 'Nyhet' :
                                                        article.type === 'report' ? 'Rapport' : 'Blogg'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                            <Calendar className="w-3 h-3" />
                                            {article.published_at ? new Date(article.published_at).toLocaleDateString('sv-SE') : ''}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2FAE8F] transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                            {article.excerpt}
                                        </p>

                                        <div className="flex items-center text-[#2FAE8F] text-sm font-bold group/btn">
                                            Läs mer <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {articles.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Inga artiklar hittades ännu.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

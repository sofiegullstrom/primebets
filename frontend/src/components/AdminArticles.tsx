import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Article } from '../types'
import { Edit2, Trash2, Plus, Save, Image as ImageIcon, X, Type, AlignLeft, MoveUp, MoveDown } from 'lucide-react'

// Block Editor Types
type BlockType = 'h2' | 'p' | 'img'

interface ContentBlock {
    id: string
    type: BlockType
    value: string
}

export function AdminArticles() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Editor State
    const [blocks, setBlocks] = useState<ContentBlock[]>([])

    // Form State
    const [formData, setFormData] = useState<Partial<Article>>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        type: 'blog',
        status: 'draft',
        meta_title: '',
        meta_description: '',
        cover_image: ''
    })

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setArticles(data)
        setLoading(false)
    }

    // --- BLOCK EDITOR LOGIC ---

    const generateId = () => Math.random().toString(36).substr(2, 9)

    const parseHtmlToBlocks = (html: string): ContentBlock[] => {
        if (!html) return [{ id: generateId(), type: 'p', value: '' }]

        const doc = new DOMParser().parseFromString(html, 'text/html')
        const nodes = Array.from(doc.body.children)

        if (nodes.length === 0 && html.trim()) {
            // Fallback for plain text without tags
            return [{ id: generateId(), type: 'p', value: html }]
        }

        if (nodes.length === 0) return [{ id: generateId(), type: 'p', value: '' }]

        return nodes.map(node => {
            const tagName = node.tagName.toLowerCase()
            if (tagName === 'h2') return { id: generateId(), type: 'h2', value: node.textContent || '' }
            if (tagName === 'img') return { id: generateId(), type: 'img', value: node.getAttribute('src') || '' }
            // Default to paragraph, keeping innerHTML to preserve links/bold if any existing
            return { id: generateId(), type: 'p', value: node.innerHTML || '' }
        })
    }

    const blocksToHtml = (currentBlocks: ContentBlock[]): string => {
        return currentBlocks.map(block => {
            if (block.type === 'h2') return `<h2>${block.value}</h2>`
            if (block.type === 'img') return `<img src="${block.value}" alt="Article Image" class="article-image" />`
            return `<p>${block.value}</p>`
        }).join('')
    }

    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: generateId(), type, value: '' }])
    }

    const updateBlock = (id: string, value: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, value } : b))
    }

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id))
    }

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === blocks.length - 1) return

        const newBlocks = [...blocks]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        const temp = newBlocks[index]
        newBlocks[index] = newBlocks[swapIndex]
        newBlocks[swapIndex] = temp
        setBlocks(newBlocks)
    }

    // --- IMAGE UPLOAD LOGIC ---

    const handleFileUpload = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('article-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('article-images')
                .getPublicUrl(filePath);

            return data.publicUrl
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
            return null
        }
    }

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const url = await handleFileUpload(e.target.files[0])
        if (url) setFormData(prev => ({ ...prev, cover_image: url }));
    };

    const handleBlockImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const url = await handleFileUpload(e.target.files[0])
        if (url) updateBlock(blockId, url)
    }


    // --- CRUD HANDLERS ---

    const handleCreate = () => {
        setEditingId('new')
        setFormData({
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            type: 'blog',
            status: 'draft',
            meta_title: '',
            meta_description: '',
            cover_image: ''
        })
        setBlocks([{ id: generateId(), type: 'p', value: '' }])
    }

    const handleEdit = (article: Article) => {
        setEditingId(article.id)
        setFormData(article)
        setBlocks(parseHtmlToBlocks(article.content))
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Är du säker på att du vill ta bort den här artikeln?')) return
        const { error } = await supabase.from('articles').delete().eq('id', id)
        if (!error) fetchArticles()
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        // Auto-generate slug
        let finalSlug = formData.slug
        if (!finalSlug && formData.title) {
            finalSlug = formData.title
                .toLowerCase()
                .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
        }

        // Convert Blocks to HTML
        const finalContent = blocksToHtml(blocks)

        const payload = {
            ...formData,
            slug: finalSlug,
            content: finalContent,
            updated_at: new Date().toISOString(),
            published_at: formData.status === 'published' && !formData.published_at
                ? new Date().toISOString()
                : formData.published_at
        }

        if (editingId === 'new') {
            const { error } = await supabase.from('articles').insert(payload)
            if (error) alert('Error: ' + error.message)
            else {
                setEditingId(null)
                fetchArticles()
            }
        } else {
            const { error } = await supabase.from('articles').update(payload).eq('id', editingId)
            if (error) alert('Error: ' + error.message)
            else {
                setEditingId(null)
                fetchArticles()
            }
        }
    }


    if (loading) return <div className="text-white">Laddar artiklar...</div>

    // EDITOR VIEW
    if (editingId) {
        return (
            <div className="bg-[#162230] p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {editingId === 'new' ? '📝 Skapa ny artikel' : '✏️ Redigera artikel'}
                    </h2>
                    <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto">

                    {/* TOP METADATA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#0F1720]/50 rounded-xl border border-white/5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rubrik (H1 Main Title)</label>
                            <input
                                className="w-full bg-[#0F1720] border border-white/10 rounded-lg p-3 text-white focus:border-[#2FAE8F] outline-none font-serif text-xl"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Artikelns huvudrubrik..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Typ & Status</label>
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 bg-[#0F1720] border border-white/10 rounded-lg p-3 text-white focus:border-[#2FAE8F] outline-none"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="blog">Blogg</option>
                                    <option value="news">Nyhet</option>
                                    <option value="guide">Guide</option>
                                    <option value="report">Rapport</option>
                                </select>
                                <select
                                    className="flex-1 bg-[#0F1720] border border-white/10 rounded-lg p-3 text-white focus:border-[#2FAE8F] outline-none"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="draft">Utkast</option>
                                    <option value="published">Publicerad</option>
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Omslagsbild</label>
                            <div className="flex items-center gap-4">
                                {formData.cover_image && (
                                    <img src={formData.cover_image} alt="Cover" className="h-16 w-24 object-cover rounded-lg border border-white/10" />
                                )}
                                <label className="cursor-pointer bg-[#2FAE8F]/10 hover:bg-[#2FAE8F]/20 text-[#2FAE8F] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                                    <ImageIcon className="w-4 h-4" />
                                    Välj bild
                                    <input type="file" onChange={handleCoverImageUpload} className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ingress (Utkasttext)</label>
                            <textarea
                                className="w-full bg-[#0F1720] border border-white/10 rounded-lg p-3 text-white focus:border-[#2FAE8F] outline-none h-20 resize-none text-sm"
                                value={formData.excerpt || ''}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* CONTENT BUILDER */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <AlignLeft className="w-5 h-5 text-[#2FAE8F]" />
                                Innehåll
                            </h3>
                            <div className="text-xs text-gray-500">
                                Bygg din artikel med block nedan
                            </div>
                        </div>

                        <div className="space-y-4 min-h-[300px] mb-20">
                            {blocks.map((block, index) => (
                                <div key={block.id} className="group relative flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {/* Block Controls */}
                                    <div className="flex flex-col gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -left-10">
                                        <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-30">
                                            <MoveUp className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-30">
                                            <MoveDown className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={() => removeBlock(block.id)} className="p-1 text-red-500 hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Block Content */}
                                    <div className="flex-1">
                                        {block.type === 'h2' && (
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#2FAE8F] bg-[#2FAE8F]/10 px-1.5 py-0.5 rounded">H2</div>
                                                <input
                                                    className="w-full bg-[#0F1720] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xl font-bold text-white focus:border-[#2FAE8F] outline-none placeholder-gray-600"
                                                    placeholder="Rubrik..."
                                                    value={block.value}
                                                    onChange={e => updateBlock(block.id, e.target.value)}
                                                    autoFocus={!block.value}
                                                />
                                            </div>
                                        )}

                                        {block.type === 'p' && (
                                            <textarea
                                                className="w-full bg-[#0F1720] border border-white/5 rounded-xl p-4 text-gray-300 focus:border-[#2FAE8F]/50 outline-none leading-relaxed resize-y overflow-hidden"
                                                placeholder="Skriv din text här..."
                                                value={block.value}
                                                onChange={e => {
                                                    updateBlock(block.id, e.target.value);
                                                    e.target.style.height = 'auto'; // Auto-grow
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                                style={{ minHeight: '100px' }}
                                            />
                                        )}

                                        {block.type === 'img' && (
                                            <div className="bg-[#0F1720] border border-white/10 rounded-xl p-4">
                                                {block.value ? (
                                                    <div className="relative">
                                                        <img src={block.value} alt="Content" className="w-full max-h-96 object-contain rounded-lg bg-black/50" />
                                                        <button
                                                            type="button"
                                                            onClick={() => updateBlock(block.id, '')}
                                                            className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-lg hover:border-[#2FAE8F] transition-colors cursor-pointer group">
                                                        <ImageIcon className="w-12 h-12 text-gray-600 group-hover:text-[#2FAE8F] mb-4 transition-colors" />
                                                        <p className="text-gray-400 font-medium">Klicka för att ladda upp bild</p>
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlockImageUpload(e, block.id)} />
                                                    </label>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ADD ACTIONS STRIP (STICKY BOTTOM) */}
                        <div className="sticky bottom-0 bg-[#162230]/95 backdrop-blur-md p-4 border-t border-white/10 -mx-6 px-6 pb-6 flex items-center justify-between z-10">
                            <div className="flex gap-2">
                                <button type="button" onClick={() => addBlock('h2')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                    <Type className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Rubrik</span>
                                </button>
                                <button type="button" onClick={() => addBlock('p')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                    <AlignLeft className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Text</span>
                                </button>
                                <button type="button" onClick={() => addBlock('img')} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                    <ImageIcon className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Bild</span>
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="px-8 py-3 rounded-xl bg-[#2FAE8F] hover:bg-[#258f75] text-white font-bold shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
                            >
                                <Save className="w-5 h-5" />
                                Publicera / Spara
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    // LIST VIEW
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Dina Artiklar (Block Editor 2.0)</h2>
                <button
                    onClick={handleCreate}
                    className="bg-[#2FAE8F] hover:bg-[#258f75] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Skapa ny
                </button>
            </div>

            <div className="grid gap-4">
                {articles.map(article => (
                    <div key={article.id} className="bg-[#162230] border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            {article.cover_image ? (
                                <img src={article.cover_image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-800" />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-white text-lg">{article.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                    <span className={`px-2 py-0.5 rounded uppercase font-bold tracking-wider ${article.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {article.status}
                                    </span>
                                    <span>{article.type}</span>
                                    <span>{new Date(article.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(article)}
                                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(article.id)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {articles.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Inga artiklar än. Klicka på "Skapa ny" för att börja.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

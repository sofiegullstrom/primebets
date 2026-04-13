import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { Shield, Search, CheckCircle, XCircle, Send, MoreVertical, Crown, StarOff, ShieldAlert, Trash2 } from 'lucide-react'
import { Navbar } from './Navbar'
import { AdminArticles } from './AdminArticles'
import { AdminGameForm } from './AdminGameForm';
import { AdminGameList } from './AdminGameList';

export function AdminPage({ session }: { session: Session | null }) {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<any[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Force refresh debug

    useEffect(() => {
        console.log('Admin Page V2 Loaded (Content Hub)')
    }, [])

    const [activeTab, setActiveTab] = useState<'users' | 'content' | 'game'>('game') // Default to game management


    // Tool States
    const [notificationStatus, setNotificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [recipientCount, setRecipientCount] = useState(0);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleAction = async (userId: string, action: string, confirmMsg: string) => {
        if (!confirm(confirmMsg)) return;

        try {
            setLoading(true); // Maybe just localized loading? for simplicity global loading
            const { error } = await supabase.functions.invoke('admin-action', {
                body: { action, userId }
            })

            if (error) throw error

            alert('Åtgärd utförd!')
            fetchUsers()
            setOpenMenuId(null)
        } catch (err: any) {
            console.error('Action failed:', err)
            alert('Fel: ' + err.message)
            setLoading(false)
        }
    }

    const handleSendNotification = async () => {
        if (!confirm('Är du säker på att du vill skicka notis till ALLA prenumeranter?')) return;

        setNotificationStatus('loading');
        try {
            const { data, error } = await supabase.functions.invoke('notify-subscribers', {
                body: { secret: 'primebets-secret-release-key' }
            })

            if (error) throw error

            setRecipientCount(data?.count || 0);
            setNotificationStatus('success');
        } catch (err: any) {
            console.error('Notification failed:', err);
            setNotificationStatus('error');
        }
    };

    useEffect(() => {
        checkAdmin()
    }, [session])

    async function checkAdmin() {
        if (!session?.user.id) return

        // Emergency Admin Bypass for specific emails
        // This bypasses the Database RLS check which is currently erroring
        const adminEmails = ['sofie.g63@outlook.com', 'primebets.se@gmail.com', 'adam.sundqvistt@gmail.com'];
        if (session.user.email && adminEmails.includes(session.user.email)) {
            console.log('Admin Access Granted via Email Whitelist');
            setIsAdmin(true);
            // We attempt to fetch users, but if that fails due to RLS, we handle it
            fetchUsers();
            return;
        }

        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle() // Use maybeSingle to avoid 406 error if row missing

            if (error) throw error

            if (!profile) {
                // Profile missing, handle gracefully
                console.log('No profile found for user')
                setError('Ingen profil hittades i databasen. Kontakta support.')
                setLoading(false)
                return
            }

            if (profile.role === 'admin') {
                setIsAdmin(true)
                fetchUsers()
            } else {
                setError('Åtkomst nekad. Endast för administratörer.')
                setLoading(false)
            }
        } catch (err: any) {
            console.error('Admin check failed:', err)
            setError(`Kunde inte verifiera behörighet. ${err.message || ''}`)
            setLoading(false)
        }
    }

    async function fetchUsers() {
        try {
            setLoading(true)
            const { data, error } = await supabase.functions.invoke('admin-get-users')

            if (error) throw error

            if (data?.users) {
                setUsers(data.users)
            }
        } catch (err: any) {
            console.error('Fetch users failed:', err)
            setError(err.message || 'Kunde inte hämta användare.')
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.includes(searchQuery)
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F1720] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2FAE8F]"></div>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#0F1720] flex flex-col items-center justify-center p-4 text-center">
                <Shield className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Åtkomst Nekad</h1>
                <p className="text-gray-400 mb-4">{error || 'Du har inte behörighet att visa denna sida.'}</p>

                <div className="bg-white/5 p-4 rounded-lg text-left text-xs font-mono text-gray-500 max-w-lg overflow-auto">
                    <p><strong>Debug Info:</strong></p>
                    <p>User ID: {session?.user?.id}</p>
                    <p>Email: {session?.user?.email}</p>
                    <p>Role Check: {isAdmin ? 'TRUE' : 'FALSE'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0F1720] font-sans">
            <Navbar session={session} />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2FAE8F]/10 border border-[#2FAE8F]/20 text-[#2FAE8F] text-xs font-bold uppercase tracking-widest mb-2">
                            <Shield className="w-3 h-3" />
                            Admin Panel
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Systemöversikt</h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-white/5 mb-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'users'
                            ? 'border-[#2FAE8F] text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                    >
                        Användare
                    </button>
                    <button
                        onClick={() => setActiveTab('game')}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'game'
                            ? 'border-[#2FAE8F] text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                    >
                        HANTERA SPEL
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'content'
                            ? 'border-[#2FAE8F] text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                            }`}
                    >
                        Magasin / Artiklar
                    </button>
                </div>

                {activeTab === 'content' ? (
                    <AdminArticles />
                ) : activeTab === 'game' ? (
                    <div className="space-y-12">
                        <AdminGameForm />
                        <AdminGameList onEdit={(game, table) => console.log('Edit', game, table)} />
                    </div>
                ) : (
                    <>
                        {/* Utils / Tools */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-[#162230] border border-white/5 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#2FAE8F]/10 rounded-lg text-[#2FAE8F]">
                                        <Send className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">Mailutskick</h3>
                                        <p className="text-xs text-gray-400">Skicka "Dagens PrimePick"-notis till alla prenumeranter</p>
                                    </div>
                                </div>

                                {notificationStatus === 'success' ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                                        <p className="text-emerald-500 font-bold mb-1">✅ Utskick klart!</p>
                                        <p className="text-xs text-emerald-400/80">Skickades till {recipientCount} mottagare.</p>
                                        <button
                                            onClick={() => setNotificationStatus('idle')}
                                            className="mt-3 text-[10px] text-emerald-500 hover:text-white underline"
                                        >
                                            Återställ
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                                            <p className="text-[10px] text-yellow-500/80 leading-relaxed">
                                                ⚠️ Detta skickar ett mail till <strong>ALLA</strong> prenumeranter i databasen.
                                                Kör endast detta när analysen är publicerad och klar på sajten.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleSendNotification}
                                            disabled={notificationStatus === 'loading'}
                                            className="w-full py-3 rounded-xl bg-[#2FAE8F] hover:bg-[#258f75] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            {notificationStatus === 'loading' ? 'Skickar...' : 'Skicka Notis Nu 🚀'}
                                        </button>
                                        {notificationStatus === 'error' && (
                                            <p className="text-center text-xs text-red-400 font-medium">Misslyckades. Kolla konsolen.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Placeholder for future tools */}
                            <div className="bg-[#162230]/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-50">
                                <p className="text-gray-500 font-bold text-sm">Fler verktyg kommer snart...</p>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Sök på e-post eller ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#162230] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#2FAE8F]/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-[#162230] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-[#0F1720]/50 text-xs uppercase font-bold text-gray-500 border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-4">Användare</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Roll</th>
                                            <th className="px-6 py-4">Nivå</th>
                                            <th className="px-6 py-4">Skapad</th>
                                            <th className="px-6 py-4">Senast inloggad</th>
                                            <th className="px-6 py-4 text-right">Åtgärd</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium">{user.email}</span>
                                                        <span className="text-xs text-gray-500 font-mono">{user.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.status === 'active' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                                            <CheckCircle className="w-3 h-3" /> Aktiv
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                                                            <XCircle className="w-3 h-3" /> Spärrad
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`capitalize ${user.role === 'admin' ? 'text-[#2FAE8F] font-bold' : ''}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.subscription_tier === 'premium' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                                                            <Crown className="w-3 h-3" /> Premium
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 text-xs">Free</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.last_sign_in ? new Date(user.last_sign_in).toLocaleString() : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div key={user.id} className="relative">
                                                        <button
                                                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                            className={`p-2 rounded-lg transition-colors ${openMenuId === user.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>

                                                        {openMenuId === user.id && (
                                                            <div className="absolute right-0 mt-2 w-56 bg-[#0F1720] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                                <div className="p-1">
                                                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                                        Hantera
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleAction(user.id, 'set_premium', 'Ge Premium-status (Gratis)?')}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors text-left"
                                                                    >
                                                                        <Crown className="w-4 h-4" />
                                                                        Ge Premium
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAction(user.id, 'remove_premium', 'Ta bort Premium-status?')}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-left"
                                                                    >
                                                                        <StarOff className="w-4 h-4" />
                                                                        Ta bort Premium
                                                                    </button>
                                                                </div>
                                                                <div className="h-px bg-white/5 my-1" />
                                                                <div className="p-1">
                                                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                                        Behörighet
                                                                    </div>
                                                                    {user.role === 'admin' ? (
                                                                        <button
                                                                            onClick={() => handleAction(user.id, 'remove_admin', 'Vill du verkligen ta bort Admin-behörighet?')}
                                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                                                                        >
                                                                            <Shield className="w-4 h-4" />
                                                                            Ta bort Admin
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleAction(user.id, 'make_admin', 'Vill du göra denna användare till Admin? De får full tillgång till systemet.')}
                                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#2FAE8F] hover:bg-[#2FAE8F]/10 rounded-lg transition-colors text-left"
                                                                        >
                                                                            <Shield className="w-4 h-4" />
                                                                            Gör till Admin
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="h-px bg-white/5 my-1" />
                                                                <div className="p-1">
                                                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                                        Fara
                                                                    </div>
                                                                    {user.status === 'active' ? (
                                                                        <button
                                                                            onClick={() => handleAction(user.id, 'block', 'Är du säker på att du vill SPÄRRA denna användare?')}
                                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors text-left"
                                                                        >
                                                                            <ShieldAlert className="w-4 h-4" />
                                                                            Spärra konto
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleAction(user.id, 'unblock', 'Häv spärr för användare?')}
                                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors text-left"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4" />
                                                                            Aktivera konto
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        onClick={() => handleAction(user.id, 'delete', 'VARNING: Detta tar bort användaren permanent. Är du säker?')}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        Radera konto
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* Backdrop to close */}
                                                        {openMenuId === user.id && (
                                                            <div
                                                                className="fixed inset-0 z-40"
                                                                onClick={() => setOpenMenuId(null)}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                    Inga användare hittades
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, HelpCircle, Lightbulb, MessageSquare, GripHorizontal, Minimize2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Step = 'category' | 'form' | 'success';
type Category = 'Support' | 'Fråga' | 'Önskemål' | null;

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<Step>('category');
    const [category, setCategory] = useState<Category>(null);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Determine screen position styles
    // We use 'bottom' and 'right' so it stays anchored to the corner by default
    // But for dragging, we might need to switch to fixed top/left logic or use transforms.
    // Simpler: Use fixed bottom/right standard, and `transform: translate(-x, -y)` where x/y are offsets from the corner.
    // Wait, dragging usually implies absolute coords.
    // Let's rely on standard fixed positioning 'bottom-6 right-6' (24px) initially.
    // Then we add `transform: translate(${offset.x}px, ${offset.y}px)`
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only allow dragging from the specific grip handle or header
        setIsDragging(true);
        setDragStart({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            // Calculate new offset
            // Typically dragging moves the element.
            // If we use translate, increasing X moves RIGHT.
            // Mouse going Left (decreasing clientX) should decrease X.
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setOffset({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);


    const handleCategorySelect = (cat: Category) => {
        setCategory(cat);
        setStep('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare payload
            const finalMessage = `[Kategori: ${category}] ${message}`;
            const senderName = "Chat Widget User";
            const senderEmail = email || "no-reply@primebets.se"; // Use dummy if empty (assuming optional)

            const { error: functionError } = await supabase.functions.invoke('send-contact-email', {
                body: { name: senderName, email: senderEmail, message: finalMessage }
            })

            if (functionError) throw functionError

            setStep('success');
            // Reset after delay or let user close
            setTimeout(() => {
                // setIsOpen(false); 
                // setStep('category'); 
                // setCategory(null);
                // setMessage('');
            }, 3000);

        } catch (err) {
            console.error('Chat error:', err);
            alert('Kunde inte skicka meddelandet. Försök igen.');
        } finally {
            setLoading(false);
        }
    };

    const resetChat = () => {
        setStep('category');
        setCategory(null);
        setMessage('');
        setEmail('');
    }

    return (
        <div
            className="fixed z-50 flex flex-col items-end"
            style={{
                bottom: '24px',
                right: '24px',
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                touchAction: 'none' // Helps with touch dragging if implemented later
            }}
        >
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[260px] bg-[#162230] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[450px] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div
                        className="bg-[#0F1720] p-3 flex items-center justify-between border-b border-white/5 cursor-move active:cursor-grabbing select-none"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="font-bold text-white text-xs">PrimeBets Chatt</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GripHorizontal className="w-3.5 h-3.5 text-gray-500" />
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <Minimize2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 bg-[#162230]">
                        {step === 'category' && (
                            <div className="space-y-3">
                                <p className="text-gray-300 text-xs text-center">Hej! 👋 <br />Vad kan vi hjälpa dig med?</p>
                                <div className="grid gap-2">
                                    <button
                                        onClick={() => handleCategorySelect('Support')}
                                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
                                            <HelpCircle className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-xs text-gray-200 group-hover:text-white">Support & Hjälp</span>
                                    </button>

                                    <button
                                        onClick={() => handleCategorySelect('Fråga')}
                                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-xs text-gray-200 group-hover:text-white">Ställ en fråga</span>
                                    </button>

                                    <button
                                        onClick={() => handleCategorySelect('Önskemål')}
                                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:scale-105 transition-all">
                                            <Lightbulb className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium text-xs text-gray-200 group-hover:text-white">Önskemål på sidan</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'form' && (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="flex items-center gap-2 mb-1 text-[10px] text-gray-500 uppercase tracking-wider">
                                    <span>Ämne:</span>
                                    <span className="text-[#2FAE8F] font-bold">{category}</span>
                                    <button type="button" onClick={() => setStep('category')} className="ml-auto underline hover:text-white">Ändra</button>
                                </div>

                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Skriv meddelande..."
                                    className="w-full h-24 bg-[#0F1720] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#2FAE8F] transition-colors resize-none"
                                />

                                <div className="space-y-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Din e-post (valfritt)"
                                        className="w-full bg-[#0F1720] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#2FAE8F] transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="w-full py-2.5 bg-[#2FAE8F] hover:bg-[#258E74] disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1720] font-bold rounded-xl transition-all shadow-lg shadow-[#2FAE8F]/10 flex items-center justify-center gap-2 text-xs"
                                >
                                    {loading ? (
                                        <div className="w-3.5 h-3.5 border-2 border-[#0F1720]/30 border-t-[#0F1720] rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            Skicka
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 'success' && (
                            <div className="py-6 text-center space-y-3">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 animate-in zoom-in duration-300">
                                    <Send className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Tack!</h3>
                                    <p className="text-gray-400 text-xs mt-1">Vi har tagit emot ditt meddelande.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setTimeout(resetChat, 300);
                                    }}
                                    className="text-[#2FAE8F] text-xs font-medium hover:underline"
                                >
                                    Stäng fönstret
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Launcher Button */}
            <button
                // Also allow dragging the CLOSED button
                onMouseDown={!isOpen ? handleMouseDown : undefined}
                onClick={() => !isDragging && setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-center w-10 h-10 rounded-full shadow-2xl transition-all duration-300 relative group
                    ${isOpen ? 'bg-[#162230] text-gray-400 rotate-90' : 'bg-[#2FAE8F] text-[#0F1720] hover:scale-110 hover:shadow-[#2FAE8F]/50'}
                    ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}
                `}
            >
                {isOpen ? (
                    <X className="w-4 h-4" />
                ) : (
                    <>
                        <MessageCircle className="w-5 h-5" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F1720]"></span>
                    </>
                )}
            </button>
        </div>
    )
}

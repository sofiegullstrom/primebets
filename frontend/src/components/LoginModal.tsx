import { AuthForm } from './AuthForm'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors"
                >
                    Stäng
                </button>
                <AuthForm
                    mode="login"
                    title="Välkommen tillbaka"
                    subtitle="Logga in med din e-post"
                    buttonText="Logga in"
                    loadingText="Loggar in..."
                    onSuccess={onClose}
                />
            </div>
        </div>
    )
}

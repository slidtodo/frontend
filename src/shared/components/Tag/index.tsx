// shared/components/Tag/index.tsx

type TagVariant = 'default' | 'green' | 'yellow' | 'pink'

interface TagProps {
    children: React.ReactNode
    variant?: TagVariant
    onClose?: () => void
    className?: string
}

const variantStyles: Record<TagVariant, string> = {
    default: 'bg-white text-gray-400 border border-gray-300',
    green: 'bg-green-100 text-green-600 border border-green-300',
    yellow: 'bg-yellow-100 text-yellow-600 border border-yellow-300',
    pink: 'bg-pink-100 text-pink-600 border border-pink-300',
}

export default function Tag({
    children,
    variant = 'default',
    onClose,
    className = '',
}: TagProps) {
    return (
        <span
            className={`
        inline-flex items-center gap-1
        rounded-full px-4 py-1.5 text-sm font-medium
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {variant === 'default' && <span className="text-gray-400">#</span>}
            {children}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-1 hover:opacity-70"
                >
                    ×
                </button>
            )}
        </span>
    )
}
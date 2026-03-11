'use client'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    className?: string
    children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-orange-400 text-white rounded-full font-semibold hover:bg-orange-400/90',
    secondary: 'bg-white text-orange-400 border-2 border-orange-400 rounded-full font-semibold hover:bg-orange-400/10',
    danger: 'bg-gray-300 text-white rounded-full font-semibold',
    icon: 'bg-white text-orange-400 border-2 border-orange-400 rounded-full flex items-center justify-center hover:bg-orange-400/10',
}

export default function Button({
    variant = 'primary',
    className = '',
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    )
}
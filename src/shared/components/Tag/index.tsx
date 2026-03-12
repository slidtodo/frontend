'use client'
import { X } from 'lucide-react'

interface TagProps {
    string: string
    onClose?: () => void
    variant?: 'green' | 'orange' | 'purple'
}

const variantStyles = {
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-500',
    purple: 'bg-purple-100 text-purple-500',
}

export default function Tag({ string, onClose, variant = 'green' }: TagProps) {
    return (
        <div className={`flex items-center justify-center gap-1 w-fit h-[24px] px-2 rounded-full text-xs font-medium ${variantStyles[variant]}`}>            <span>{string}</span>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="hover:opacity-70 transition-opacity"
                >
                    <X size={10} />
                </button>
            )}
        </div>
    )
}
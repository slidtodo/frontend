'use client'
import { useState } from 'react'
import Image from 'next/image'

type InputType = 'text' | 'email' | 'password'

interface InputProps {
    label?: string
    type?: InputType
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    // error?: string ← 스타일 작업할 때 추가
    className?: string
    ref?: React.Ref<HTMLInputElement>  // ← 그냥 props로 받으면 됨
}

export default function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    className,
    ref,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">{label}</label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`
                        w-full rounded-2xl border border-gray-200
                        px-6 py-5 text-lg text-gray-400
                        outline-none bg-white
                        ${className ?? ''}
                    `}
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        <Image
                            src="/icons/Icon (Stroke).png"
                            alt={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                            width={22}
                            height={22}
                        />
                    </button>
                )}
            </div>
        </div>
    )
}
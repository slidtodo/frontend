'use client';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon' | 'cancel' | 'confirm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'w-[223px] h-[56px] bg-[#FF8442] text-white rounded-full font-semibold hover:bg-[#FF8442]/90',
  secondary: 'bg-white text-[#FF8442] border-2 border-[#FF8442] rounded-full font-semibold hover:bg-[#FF8442]/10',
  danger: 'bg-red-500 text-white rounded-full font-semibold hover:bg-red-500/90',
  icon: 'bg-white text-[#FF8442] border-2 border-[#FF8442] rounded-full hover:bg-[#FF8442]/10',
  cancel: 'bg-white text-gray-800 border border-gray-200 rounded-full font-medium hover:bg-gray-50',
  confirm: 'bg-[#FF8442] text-white rounded-full font-medium hover:bg-[#FF8442]/90',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          'flex items-center justify-center gap-1 cursor-pointer',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;

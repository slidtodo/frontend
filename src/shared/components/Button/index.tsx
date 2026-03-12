'use client';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon' | 'cancel' | 'confirm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#FF8442] text-white rounded-full font-semibold hover:bg-[#FF8442]/90',
  secondary: 'bg-white text-[#FF8442] border-2 border-[#FF8442] rounded-full font-semibold hover:bg-[#FF8442]/10',
  danger: 'bg-gray-300 text-white rounded-full font-semibold',
  icon: 'bg-white text-[#FF8442] border-2 border-[#FF8442] rounded-full hover:bg-[#FF8442]/10',
  cancel: 'bg-white text-gray-800 border border-gray-200 rounded-full font-medium hover:bg-gray-50',
  confirm: 'bg-[#FF8442] text-white rounded-full font-medium hover:bg-[#FF8442]/90',
};

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`
                flex items-center justify-center gap-1
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantStyles[variant]}
                ${className}
            `}
      {...props}
    >
      {children}
    </button>
  );
}

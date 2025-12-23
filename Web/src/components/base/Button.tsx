
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-sf font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-darker',
    secondary: 'bg-white text-text border border-gray-300 hover:bg-gray-50',
    accent: 'bg-accent text-white hover:bg-accent-dark'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-8',
    md: 'px-6 py-3 text-base rounded-12',
    lg: 'px-8 py-4 text-lg rounded-16'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

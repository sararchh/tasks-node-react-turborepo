import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Icon } from './icon';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText = '',
  disabled = false,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseClasses = 'font-medium h-[2.5rem] cursor-pointer !rounded-sm outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantClasses = {
    primary: '!bg-blue-600 !hover:bg-blue-700 !focus:ring-blue-500 !text-white disabled:bg-blue-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white disabled:bg-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white disabled:bg-red-300',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700 disabled:text-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    sm: 'sm' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading ? (
        <>
          <AiOutlineLoading3Quarters className={`animate-spin ${iconSizes[size] === 'sm' ? 'h-4 w-4' : 'h-5 w-5'}`} />
          {loadingText}
        </>
      ) : (
        <>
          {leftIcon && <Icon name={leftIcon} size={iconSizes[size]} />}
          {children}
          {rightIcon && <Icon name={rightIcon} size={iconSizes[size]} />}
        </>
      )}
    </button>
  );
};

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    const baseClasses = 'vq-btn';
    const variantClasses = `vq-btn-${variant}`;
    const sizeClasses = `vq-btn-${size}`;
    const widthClass = fullWidth ? 'vq-w-full' : '';
    
    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

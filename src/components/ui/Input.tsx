import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, required, ...props }, ref) => {
    return (
      <div className={`vq-input-wrapper ${className}`}>
        {label && (
          <label className="vq-label">
            {label} {required && <span className="vq-text-danger">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`vq-input ${error ? 'vq-input-error' : ''}`}
          required={required}
          {...props}
        />
        {error && <span className="vq-error-text">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

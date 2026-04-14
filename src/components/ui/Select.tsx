import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, required, ...props }, ref) => {
    return (
      <div className={`vq-input-wrapper ${className}`}>
        {label && (
          <label className="vq-label">
            {label} {required && <span className="vq-text-danger">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`vq-input vq-select ${error ? 'vq-input-error' : ''}`}
          required={required}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="vq-error-text">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';

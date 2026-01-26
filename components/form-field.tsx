import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
  type?: 'text' | 'email' | 'textarea' | 'select';
  options?: string[];
  rows?: number;
  helperText?: string;
  isComplete?: boolean;
  className?: string;
}

export default function FormField({
  label,
  name,
  register,
  error,
  placeholder,
  type = 'text',
  options,
  rows = 3,
  helperText,
  isComplete = false,
  className = '',
}: FormFieldProps) {
  const baseInputClass = 'w-full px-3 py-2 border rounded-md transition-all duration-200';
  const completionClass = isComplete ? 'border-green-500 bg-green-50' : 'border-gray-300';
  const errorClass = error ? 'border-red-500 bg-red-50' : '';
  const inputClassName = `${baseInputClass} ${errorClass || completionClass} ${className}`;

  const isRequired = label.includes('*');

  return (
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
        {label}
        {isComplete && !error && (
          <span className="text-green-600 text-xs font-normal flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
      </label>

      {helperText && (
        <p className="text-sm text-gray-600 mb-2">{helperText}</p>
      )}

      {type === 'textarea' ? (
        <textarea
          {...register(name)}
          className={inputClassName}
          rows={rows}
          placeholder={placeholder}
        />
      ) : type === 'select' ? (
        <select {...register(name)} className={inputClassName}>
          <option value="">Select...</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...register(name)}
          type={type}
          className={inputClassName}
          placeholder={placeholder}
        />
      )}

      {error && (
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}

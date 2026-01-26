'use client';

import { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
  color?: string;
}

interface InlineSelectProps {
  value: string | null;
  options: Option[];
  onSave: (value: string) => Promise<void>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  showBadge?: boolean;
}

export default function InlineSelect({
  value,
  options,
  onSave,
  label,
  placeholder = 'Select...',
  disabled = false,
  showBadge = false,
}: InlineSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = async (optionValue: string) => {
    if (optionValue === value) {
      setIsOpen(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(optionValue);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (disabled) {
    return (
      <div className="text-sm">
        <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-gray-900">
          {selectedOption ? (
            showBadge ? (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: selectedOption.color ? `${selectedOption.color}15` : '#e5e7eb',
                  color: selectedOption.color || '#374151',
                }}
              >
                {selectedOption.label}
              </span>
            ) : (
              selectedOption.label
            )
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm relative" ref={dropdownRef}>
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSaving}
        className="group w-full text-left px-2 py-1.5 rounded border border-transparent hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-between disabled:opacity-50"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? (
            showBadge ? (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: selectedOption.color ? `${selectedOption.color}15` : '#e5e7eb',
                  color: selectedOption.color || '#374151',
                }}
              >
                {selectedOption.label}
              </span>
            ) : (
              selectedOption.label
            )
          ) : (
            placeholder
          )}
        </span>
        <div className="flex items-center gap-1">
          {isSaving ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {isOpen && !isSaving && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                option.value === value ? 'bg-indigo-50' : ''
              }`}
            >
              {showBadge ? (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: option.color ? `${option.color}15` : '#e5e7eb',
                    color: option.color || '#374151',
                  }}
                >
                  {option.label}
                </span>
              ) : (
                <span className="text-sm text-gray-900">{option.label}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}

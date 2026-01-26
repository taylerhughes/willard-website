'use client';

import { useState, useEffect, useRef } from 'react';

interface InlineCurrencyProps {
  value: number | null; // Value in cents or dollars depending on your schema
  onSave: (value: number | null) => Promise<void>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

export default function InlineCurrency({
  value,
  onSave,
  label,
  placeholder = 'Click to set amount...',
  disabled = false,
  allowClear = true,
}: InlineCurrencyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value?.toString() || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = async () => {
    const numValue = currentValue ? parseFloat(currentValue.replace(/[^0-9.-]/g, '')) : null;

    if (numValue === value) {
      setIsEditing(false);
      return;
    }

    if (currentValue && (isNaN(numValue as number) || (numValue as number) < 0)) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(numValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setCurrentValue(value?.toString() || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value?.toString() || '');
    setIsEditing(false);
    setError(null);
  };

  const handleClear = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await onSave(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  if (disabled) {
    return (
      <div className="text-sm">
        <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-gray-900 font-semibold">
          {value !== null && value !== undefined ? (
            formatCurrency(value)
          ) : (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          )}
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="group text-sm">
        <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 text-left px-2 py-1.5 rounded border border-transparent hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span className={value !== null && value !== undefined ? 'text-gray-900 font-semibold' : 'text-gray-400'}>
              {value !== null && value !== undefined ? formatCurrency(value) : placeholder}
            </span>
            <svg
              className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {allowClear && value !== null && value !== undefined && (
            <button
              onClick={handleClear}
              disabled={isSaving}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Clear amount"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className="space-y-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              setCurrentValue(val);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            disabled={isSaving}
            className="w-full pl-7 pr-3 py-2 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 disabled:opacity-50"
            placeholder="0"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isSaving ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            <span>Press Enter to save, Esc to cancel</span>
          )}
        </div>
        {error && <div className="text-xs text-red-600">{error}</div>}
      </div>
    </div>
  );
}

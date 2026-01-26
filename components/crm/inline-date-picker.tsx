'use client';

import { useState, useEffect } from 'react';

interface InlineDatePickerProps {
  value: string | null; // ISO date string
  onSave: (value: string | null) => Promise<void>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

export default function InlineDatePicker({
  value,
  onSave,
  label,
  placeholder = 'Click to set date...',
  disabled = false,
  allowClear = true,
}: InlineDatePickerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ? value.split('T')[0] : '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentValue(value ? value.split('T')[0] : '');
  }, [value]);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleSave = async () => {
    if (currentValue === (value ? value.split('T')[0] : '')) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const isoDate = currentValue ? new Date(currentValue).toISOString() : null;
      await onSave(isoDate);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setCurrentValue(value ? value.split('T')[0] : '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value ? value.split('T')[0] : '');
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

  if (disabled) {
    return (
      <div className="text-sm">
        <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-gray-900">
          {value ? formatDate(value) : <span className="text-gray-400">{placeholder}</span>}
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
            <span className={value ? 'text-gray-900' : 'text-gray-400'}>
              {value ? formatDate(value) : placeholder}
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          {allowClear && value && (
            <button
              onClick={handleClear}
              disabled={isSaving}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Clear date"
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
        <input
          type="date"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          disabled={isSaving}
          autoFocus
          className="w-full px-3 py-2 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 disabled:opacity-50"
        />
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
            <span>Click outside to save, or clear the field</span>
          )}
        </div>
        {error && <div className="text-xs text-red-600">{error}</div>}
      </div>
    </div>
  );
}

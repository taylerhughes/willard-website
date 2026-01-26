'use client';

import { useState, useEffect, useRef } from 'react';

interface InlineTextFieldProps {
  value: string | null;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  label: string;
  multiline?: boolean;
  disabled?: boolean;
}

export default function InlineTextField({
  value,
  onSave,
  placeholder = 'Click to add...',
  label,
  multiline = false,
  disabled = false,
}: InlineTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        (inputRef.current as HTMLTextAreaElement).select();
      } else {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = async () => {
    if (currentValue === (value || '')) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setCurrentValue(value || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value || '');
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (disabled) {
    return (
      <div className="text-sm">
        <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-gray-900">{value || <span className="text-gray-400">{placeholder}</span>}</div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="group text-sm">
        <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
        <button
          onClick={() => setIsEditing(true)}
          className="w-full text-left px-2 py-1.5 rounded border border-transparent hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value || placeholder}
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className="space-y-2">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 disabled:opacity-50"
            rows={3}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 disabled:opacity-50"
            placeholder={placeholder}
          />
        )}
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

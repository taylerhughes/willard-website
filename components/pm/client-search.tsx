'use client';

import { useState, useRef, useEffect } from 'react';

interface Client {
  id: string;
  clientId: string;
  businessName: string | null;
  clientFullName: string | null;
}

interface Account {
  id: string;
  name: string;
}

type SearchResult =
  | { type: 'lead'; data: Client }
  | { type: 'account'; data: Account }
  | { type: 'none' };

interface ClientSearchProps {
  clients: Client[];
  accounts: Account[];
  value: SearchResult;
  onChange: (result: SearchResult) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ClientSearch({
  clients,
  accounts,
  value,
  onChange,
  placeholder = 'Search clients and accounts...',
  disabled = false,
}: ClientSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('ClientSearch - clients:', clients?.length, clients);
    console.log('ClientSearch - accounts:', accounts?.length, accounts);
  }, [clients, accounts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter results based on search (show all if no search term)
  const filteredClients = !isOpen ? [] : clients.filter((client) => {
    if (!search) return true; // Show all when no search term

    const searchLower = search.toLowerCase();
    const businessName = client.businessName?.toLowerCase() || '';
    const fullName = client.clientFullName?.toLowerCase() || '';
    const clientId = client.clientId.toLowerCase();

    return businessName.includes(searchLower) ||
           fullName.includes(searchLower) ||
           clientId.includes(searchLower);
  });

  const filteredAccounts = !isOpen ? [] : accounts.filter((account) => {
    if (!search) return true; // Show all when no search term

    const searchLower = search.toLowerCase();
    const name = account.name.toLowerCase();

    return name.includes(searchLower);
  });

  const hasResults = filteredClients.length > 0 || filteredAccounts.length > 0;

  // Get display value
  const getDisplayValue = () => {
    if (value.type === 'lead') {
      return value.data.businessName || value.data.clientFullName || value.data.clientId;
    } else if (value.type === 'account') {
      return value.data.name;
    }
    return '';
  };

  const handleSelect = (result: SearchResult) => {
    onChange(result);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ type: 'none' });
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? search : getDisplayValue()}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 pr-20 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        {/* Type badge and clear button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {value.type !== 'none' && (
            <>
              <span className={`text-xs px-2 py-0.5 rounded ${
                value.type === 'lead'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {value.type === 'lead' ? 'Lead' : 'Account'}
              </span>
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {!hasResults && search && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results found for &quot;{search}&quot;
            </div>
          )}

          {!hasResults && !search && value.type === 'none' && (
            <div className="px-3 py-2 text-sm text-gray-500">
              {clients.length === 0 && accounts.length === 0
                ? 'No clients or accounts available'
                : 'Start typing to search or scroll to browse...'}
            </div>
          )}

          {/* Clear option */}
          {value.type !== 'none' && (
            <button
              type="button"
              onClick={() => handleSelect({ type: 'none' })}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100"
            >
              <span className="text-gray-500">Clear selection</span>
            </button>
          )}

          {/* Leads section */}
          {filteredClients.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                Leads ({filteredClients.length})
              </div>
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleSelect({ type: 'lead', data: client })}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 transition-colors ${
                    value.type === 'lead' && value.data.id === client.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {client.businessName || client.clientFullName || client.clientId}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {client.clientId}
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Accounts section */}
          {filteredAccounts.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                Accounts ({filteredAccounts.length})
              </div>
              {filteredAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => handleSelect({ type: 'account', data: account })}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 transition-colors ${
                    value.type === 'account' && value.data.id === account.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {account.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Account
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isPrimary: boolean;
}

interface SelectContactModalProps {
  accountId: string;
  accountName: string;
  contacts: Contact[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ndaStatus: string, ndaDocumentUrl: string) => void;
}

export default function SelectContactModal({
  accountId,
  accountName,
  contacts,
  isOpen,
  onClose,
  onSuccess,
}: SelectContactModalProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    contacts.find((c) => c.isPrimary)?.id || contacts[0]?.id || null
  );
  const [isSending, setIsSending] = useState(false);

  const contactsWithEmail = contacts.filter((c) => c.email);

  const handleSend = async () => {
    if (!selectedContactId) {
      toast.error('Please select a contact');
      return;
    }

    const selectedContact = contacts.find((c) => c.id === selectedContactId);
    if (!selectedContact || !selectedContact.email) {
      toast.error('Selected contact must have an email address');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`/api/accounts/${accountId}/send-nda`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: selectedContactId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send NDA');
      }

      toast.success('NDA sent successfully');
      onSuccess(data.account.ndaStatus, data.account.ndaDocumentUrl);
      onClose();
    } catch (error: any) {
      console.error('Error sending NDA:', error);
      toast.error(error.message || 'Failed to send NDA');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  if (contactsWithEmail.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
              <div className="flex items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    No Contacts with Email
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    This account doesn't have any contacts with email addresses. Please add a
                    contact with an email address before sending an NDA.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
              Send NDA to Contact
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Select which contact at <span className="font-medium">{accountName}</span> should receive the NDA:
            </p>

            <div className="space-y-2">
              {contactsWithEmail.map((contact) => (
                <label
                  key={contact.id}
                  className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="contact"
                    value={contact.id}
                    checked={selectedContactId === contact.id}
                    onChange={(e) => setSelectedContactId(e.target.value)}
                    className="mt-1 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </span>
                      {contact.isPrimary && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          Primary
                        </span>
                      )}
                    </div>
                    {contact.role && (
                      <p className="text-xs text-gray-600">{contact.role}</p>
                    )}
                    <p className="text-xs text-gray-600">{contact.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !selectedContactId}
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400 sm:w-auto"
            >
              {isSending ? 'Sending...' : 'Send NDA'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-100 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

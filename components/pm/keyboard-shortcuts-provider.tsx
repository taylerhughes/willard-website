'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CreateIssueModal from './create-issue-modal';

interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

interface Project {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

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

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  users: User[];
  projects: Project[];
  clients: Client[];
  accounts: Account[];
}

export default function KeyboardShortcutsProvider({
  children,
  users,
  projects,
  clients,
  accounts,
}: KeyboardShortcutsProviderProps) {
  const pathname = usePathname();
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Escape - Close modals
      if (e.key === 'Escape') {
        if (showShortcutsModal) {
          e.preventDefault();
          setShowShortcutsModal(false);
          return;
        }
      }

      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.isContentEditable)
      ) {
        return;
      }

      // C - Create new issue (only on PM pages)
      if (
        e.key === 'c' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey &&
        pathname?.startsWith('/admin')
      ) {
        e.preventDefault();
        setShowCreateIssueModal(true);
        // Also dispatch event for IssuesPageWrapper to refresh its list
        window.dispatchEvent(new CustomEvent('openCreateIssueModal'));
      }

      // ? - Show shortcuts modal
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pathname, showShortcutsModal]);

  const handleIssueCreated = (newIssue: any) => {
    // Dispatch event to notify IssuesPageWrapper to refresh its list
    window.dispatchEvent(new CustomEvent('issueCreated', { detail: newIssue }));
  };

  return (
    <>
      {children}

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={showCreateIssueModal}
        onClose={() => setShowCreateIssueModal(false)}
        onIssueCreated={handleIssueCreated}
        users={users}
        projects={projects}
        clients={clients}
        accounts={accounts}
      />

      {/* Shortcuts Modal */}
      {showShortcutsModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowShortcutsModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setShowShortcutsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <div className="space-y-6">
                  {/* Navigation */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Navigation</h3>
                    <div className="space-y-2">
                      <ShortcutRow
                        keys={['⌘', 'K']}
                        description="Open command palette"
                      />
                      <ShortcutRow
                        keys={['Esc']}
                        description="Close modals and dialogs"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
                    <div className="space-y-2">
                      <ShortcutRow
                        keys={['C']}
                        description="Create new issue"
                      />
                      <ShortcutRow
                        keys={['⌘', 'Enter']}
                        description="Submit forms / Post comments"
                      />
                    </div>
                  </div>

                  {/* Help */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Help</h3>
                    <div className="space-y-2">
                      <ShortcutRow
                        keys={['?']}
                        description="Show keyboard shortcuts"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <p className="text-xs text-gray-500">
                  Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd> to close
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

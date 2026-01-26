'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { toast } from 'sonner';

interface CommandPaletteProviderProps {
  userId: string;
  children: ReactNode;
}

export default function CommandPaletteProvider({
  userId,
  children,
}: CommandPaletteProviderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Toggle command palette with Cmd/Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search issues with debounce
  useEffect(() => {
    if (!search) {
      setIssues([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/pm/issues?search=${encodeURIComponent(search)}`
        );
        if (response.ok) {
          const data = await response.json();
          setIssues(data.slice(0, 5)); // Show top 5 results
        }
      } catch (error) {
        console.error('Error searching issues:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleNavigate = useCallback(
    (path: string) => {
      setOpen(false);
      setSearch('');
      router.push(path);
    },
    [router]
  );

  const handleCreateIssue = useCallback(() => {
    setOpen(false);
    setSearch('');
    // Trigger the create issue modal via custom event
    window.dispatchEvent(new CustomEvent('openCreateIssueModal'));
  }, []);

  const handleIssueClick = useCallback(
    (issueId: string) => {
      setOpen(false);
      setSearch('');
      router.push(`/admin/issues?issue=${issueId}`);
    },
    [router]
  );

  return (
    <>
      {children}

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command Menu"
        className="fixed inset-0 z-50"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

        {/* Command Palette */}
        <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search issues or type a command..."
            className="w-full px-4 py-3 text-base border-b border-gray-200 outline-none"
          />

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              {loading ? 'Searching...' : 'No results found.'}
            </Command.Empty>

            {/* Search Results */}
            {issues.length > 0 && (
              <Command.Group heading="Issues" className="px-2 py-1 text-xs font-semibold text-gray-500">
                {issues.map((issue) => (
                  <Command.Item
                    key={issue.id}
                    value={issue.identifier}
                    onSelect={() => handleIssueClick(issue.id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-mono text-xs text-gray-500 shrink-0">
                        {issue.identifier}
                      </span>
                      <span className="text-sm text-gray-900 truncate">{issue.title}</span>
                    </div>
                    {issue.project && (
                      <div className="flex items-center gap-1 shrink-0">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: issue.project.color || '#6366f1' }}
                        />
                        <span className="text-xs text-gray-500">{issue.project.name}</span>
                      </div>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Actions */}
            <Command.Group heading="Actions" className="px-2 py-1 text-xs font-semibold text-gray-500">
              <Command.Item
                onSelect={handleCreateIssue}
                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm text-gray-900">Create new issue</span>
                <kbd className="ml-auto px-1.5 py-0.5 text-xs font-mono bg-gray-100 rounded border border-gray-300">
                  C
                </kbd>
              </Command.Item>
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navigate" className="px-2 py-1 text-xs font-semibold text-gray-500">
              <Command.Item
                onSelect={() => handleNavigate('/admin/issues')}
                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm text-gray-900">Issues</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleNavigate('/admin/issues/board')}
                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <span className="text-sm text-gray-900">Board</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleNavigate('/admin/projects')}
                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-sm text-gray-900">Projects</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleNavigate('/admin/cycles')}
                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm text-gray-900">Cycles</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleNavigate('/admin/crm')}
                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm text-gray-900">CRM</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer with keyboard hints */}
          <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono bg-gray-100 rounded border border-gray-300">↑</kbd>
                <kbd className="px-1.5 py-0.5 font-mono bg-gray-100 rounded border border-gray-300">↓</kbd>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono bg-gray-100 rounded border border-gray-300">↵</kbd>
                <span>to select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono bg-gray-100 rounded border border-gray-300">esc</kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}

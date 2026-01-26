import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/pm/admin-nav';
import CommandPaletteProvider from '@/components/pm/command-palette-provider';
import KeyboardShortcutsProvider from '@/components/pm/keyboard-shortcuts-provider';
import { Toaster } from 'sonner';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch users, projects, clients, and accounts for global create issue modal
  const { prisma } = await import('@/lib/db');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
    },
  });

  const clients = await prisma.onboardingClient.findMany({
    select: {
      id: true,
      clientId: true,
      businessName: true,
      clientFullName: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <KeyboardShortcutsProvider users={users} projects={projects} clients={clients} accounts={accounts}>
      <div className="flex h-screen bg-gray-50">
        {/* Side Navigation */}
        <AdminNav userEmail={user.email || ''} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Command Palette */}
          <CommandPaletteProvider userId={user.id}>
            {children}
          </CommandPaletteProvider>
        </div>

        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
      </div>
    </KeyboardShortcutsProvider>
  );
}

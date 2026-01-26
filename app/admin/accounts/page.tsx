import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import AccountsPageWrapper from '@/components/accounts/accounts-page-wrapper';

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const accounts = await prisma.account.findMany({
    include: {
      _count: {
        select: { projects: true, contacts: true },
      },
      convertedFromLead: {
        select: {
          id: true,
          clientId: true,
          businessName: true,
          clientFullName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <AccountsPageWrapper initialAccounts={accounts} />;
}

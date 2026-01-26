import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import AccountSummary from '@/components/account-summary';

type Params = Promise<{ accountId: string }>;

export default async function AccountDetailPage({ params }: { params: Params }) {
  const { accountId } = await params;

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      contacts: {
        orderBy: [
          { isPrimary: 'desc' },
          { createdAt: 'asc' },
        ],
      },
      projects: {
        include: {
          lead: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      convertedFromLead: {
        select: {
          id: true,
          clientId: true,
          businessName: true,
          clientFullName: true,
          email: true,
        },
      },
      _count: {
        select: {
          projects: true,
          contacts: true,
        },
      },
    },
  });

  if (!account) {
    notFound();
  }

  return <AccountSummary account={account as any} />;
}

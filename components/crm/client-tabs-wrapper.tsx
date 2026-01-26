'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientTabs from './client-tabs';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface ClientTabsWrapperProps {
  initialClient: any;
  users: User[];
}

export default function ClientTabsWrapper({ initialClient, users }: ClientTabsWrapperProps) {
  const [client, setClient] = useState(initialClient);
  const router = useRouter();

  const handleClientUpdated = () => {
    // Refresh the page data
    router.refresh();

    // Optionally, you could also refetch the client data here
    // and update the local state instead of full page refresh
  };

  return (
    <ClientTabs
      client={client}
      activities={client.activityLogs || []}
      notes={client.notes || []}
      users={users}
      onClientUpdated={handleClientUpdated}
    />
  );
}

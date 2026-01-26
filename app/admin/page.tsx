import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import TimezoneOverlap from '@/components/timezone-overlap';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's an overview of your availability and timezone overlaps.
            </p>
          </div>

          {/* Timezone Overlap Component */}
          <TimezoneOverlap />

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/issues"
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Issues</h3>
              <p className="text-sm text-gray-600">Manage project issues and tasks</p>
            </a>
            <a
              href="/admin/projects"
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
              <p className="text-sm text-gray-600">View and manage all projects</p>
            </a>
            <a
              href="/admin/accounts"
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accounts</h3>
              <p className="text-sm text-gray-600">Manage client accounts and contacts</p>
            </a>
            <a
              href="/admin/crm"
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CRM</h3>
              <p className="text-sm text-gray-600">View leads and pipeline</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

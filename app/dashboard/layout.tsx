import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  // Check if onboarding is complete. This usually checks a database field, but simplified for now.
  // In a real app, you'd check `user.onboardingComplete` or similar.

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-white/50 px-6 backdrop-blur-xl dark:bg-black/50 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold opacity-0 md:opacity-100 transition-opacity">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="hidden md:block text-sm font-medium">{session.user?.name}</span>
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-neutral-200 dark:ring-neutral-800"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {session.user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
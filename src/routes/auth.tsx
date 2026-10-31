import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AccountForm } from '@/components/AccountForm';
import { useAccount } from '@/lib/sheconnect-account';
export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => ({ mode: search.mode === 'register' ? 'register' as const : 'login' as const }),
  head: () => ({ meta: [{ title: 'Log in or register — SheConnect' }, { name: 'description', content: 'Create your SheConnect profile and save your learning progress.' }, { property: 'og:title', content: 'Your SheConnect account' }, { property: 'og:description', content: 'Log in or create a personal learning profile.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: AuthPage,
});
function AuthPage() {
  const { user } = useAccount(); const navigate = useNavigate(); const { mode } = Route.useSearch();
  useEffect(() => { if (user) void navigate({ to: '/profile', replace: true }); }, [user, navigate]);
  return <AccountForm initialMode={mode} />;
}
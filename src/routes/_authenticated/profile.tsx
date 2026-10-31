import { createFileRoute } from '@tanstack/react-router';
import SheConnectApp from '@/components/SheConnectApp';
export const Route = createFileRoute('/_authenticated/profile')({
  head: () => ({ meta: [{ title: 'My profile and progress — SheConnect' }, { name: 'description', content: 'Your personal profile and saved learning progress.' }, { property: 'og:title', content: 'My SheConnect progress' }, { property: 'og:description', content: 'Follow your learning journey with SheConnect.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: () => <SheConnectApp initialScreen="profile" />,
});
'use client';

import UserProfile from '@/components/supaauth/user-profile';
import UserShortLinks from '@/components/user-short-links';
import { useTranslations } from 'next-intl';
import ErrorBoundary from '@/components/error-boundary';

export default function ProfilePage() {
  const t = useTranslations('Profile');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t('PageTitle')}
        </h1>
        <section className="space-y-6">
          <ErrorBoundary>
            <UserProfile />
            <UserShortLinks />
          </ErrorBoundary>
        </section>
      </div>
    </main>
  );
}

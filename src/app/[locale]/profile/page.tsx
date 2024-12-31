'use client';

import UserProfile from '@/components/supaauth/user-profile';
import UserShortLinks from '@/components/user-short-links';
import { useTranslations } from 'next-intl';
import ErrorBoundary from '@/components/error-boundary';

export default function ProfilePage() {
  const t = useTranslations('Profile');

  return (
    <div className="flex flex-col gap-4 m-4 min-h-96">
      <ErrorBoundary>
        <UserProfile />
        <UserShortLinks />
      </ErrorBoundary>
    </div>
  );
}

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import UserProfile from '@/components/supaauth/user-profile';
import UserShortLinks from '@/components/user-short-links';
import ErrorBoundary from '@/components/error-boundary';

export default function ProfilePageContent() {
  const t = useTranslations('Profile');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t('PageTitle')}
      </h1>
      <div className="max-w-4xl mx-auto space-y-8">
        <ErrorBoundary>
          <UserProfile />
        </ErrorBoundary>
        <ErrorBoundary>
          <UserShortLinks />
        </ErrorBoundary>
      </div>
    </div>
  );
}

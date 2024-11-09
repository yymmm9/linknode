import UserProfile from '@/components/supaauth/user-profile';
import UserShortLinks from '@/components/user-short-links';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function page() {
  const messages = await getMessages();
  // const t = useTranslations('Profile');
  return (
    <div className="flex flex-col gap-4 m-4 min-h-96">
      <UserProfile />
      <NextIntlClientProvider messages={messages}>
        {/* todo show links */}
        <UserShortLinks />
      </NextIntlClientProvider>
    </div>
  );
}

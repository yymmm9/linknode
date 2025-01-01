import React from 'react';
import dynamic from 'next/dynamic';
import ExtraLinksForm from '@/components/forms/extra-links-form';
import ProfileForm from '@/components/forms/profile-form';
import SocialLinksForm from '@/components/forms/social-links-form';
import MobileMockup from '@/components/mobile-mockup';
import PreviewButton from '@/components/buttons/preview-button';
import { DemoButton, Shortener } from '@/components/buttons/demo-button';
const EditShortLink = dynamic(
  () => import('@/components/buttons/edit-short-link'), 
  { ssr: false }
);
import BackgroundShell from '@/components/backgrounds/background-shell';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// export const siteConfig = {
//   name: 'hov - links',
//   description: '',
//   // ogImage: 'https://linknode.vercel.app/og-image.png',
//   url: '',
// };

export default async function Home() {
  const messages = await getMessages();

  return (
    <main className="relative grid min-h-screen px-4 md:container lg:grid-cols-3 lg:px-0">
      <NextIntlClientProvider messages={messages}>
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 pb-6 lg:col-span-2 lg:px-20 lg:pb-0">
          <div className="hide_scrollbar flex w-full flex-col gap-5 overflow-y-auto pb-12 lg:pb-0">
            {/* todo edit link button, check if logged in */}
            <div className="flex justify-end w-full">
              <EditShortLink linkKey="" />
            </div>

            <ProfileForm />
            <SocialLinksForm />
            <ExtraLinksForm />

            <BackgroundShell />

            <div className="grid w-full grid-cols-2 items-center justify-center gap-2 md:grid-cols-4 ">
              <DemoButton />
              {/* <PublishButton /> */}
              <Shortener />
              {/* <GithubButton /> */}
            </div>
          </div>
        </section>

        <section className="hidden items-center justify-end lg:flex">
          <MobileMockup />
        </section>

        <div className="lg:hidden">
          <PreviewButton />
          
        </div>
      </NextIntlClientProvider>
    </main>
  );
}

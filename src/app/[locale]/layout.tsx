import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/app/page';
import { Providers } from '@/components/providers';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import QueryProvider from '@/components/query-provider';
import Header from '@/components/Header';
import ContactDrawer from '@/components/contact-drawer';
import { cn } from '@/lib/utils';
import { Footer } from '../layout';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Original source: https://github.com/sadmann7/skateshop/blob/main/src/app/layout.tsx
export const metadata: Metadata = {
  // metadataBase: new URL('https://linknode.vercel.app'),
  title: {
    default: siteConfig.name,
    template: `%s - hov`,
  },
  description: siteConfig.description,
  verification: {
    google: '5z2lDnQ6mdG9S2qZm74DNfOk3xdwLR-orzDHc5XiJxs',
  },
  // added new keywords for seo
  keywords: [
    // 'bitly url shortener',
    // 'bitly link shortener',
    // 'link shortener',
    // 'url shortener',
    // 'link management',
    // 'tinyurls',
    // 'bio for instagram',
    // 'linknode',
    // 'link node',
    // 'sujjeee',
    // 'onelink',
    // 'social links',
    // 'free linktree',
    // 'link in bio',
    // 'link in bio instagram',
    // 'linktree',
    // 'dub.co',
    // 'dub',
  ],
  // authors: [
  //   {
  //     name: 'sujjeee',
  //     url: 'https://github.com/sujjeee',
  //   },
  // ],
  // creator: 'sujjeee',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    // images: [`${siteConfig.url}/og-image.png`],
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    // images: [`${siteConfig.url}/og-image.png`],
    // creator: '@',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  // const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={cn(inter.className, 'mt-2 pt-16 md:pt-24')}>
        {/* <NextIntlClientProvider locale={locale} messages={messages}> */}
        <QueryProvider>
          <Providers>
            <Header />
            <div className="flex items-center justify-center">{children}</div>
            <Footer />
          </Providers>
        </QueryProvider>
        {/* </NextIntlClientProvider> */}
        <Analytics />
        {/* <Toaster /> */}
      </body>
    </html>
  );
}

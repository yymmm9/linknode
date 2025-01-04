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
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
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
  const messages = await getMessages();
  const isValidLocale = routing.locales.includes(locale as any);
  if (!isValidLocale) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background antialiased', inter.variable)}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <Providers>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <div className="mb-20"></div>
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
              <Analytics />
            </Providers>
          </QueryProvider>
        </NextIntlClientProvider>
        <Toaster/>
      </body>
    </html>
  );
}

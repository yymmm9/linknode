import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/app/page';
import { Providers } from '@/components/providers';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import QueryProvider from '@/components/query-provider';
import Header from '@/components/Header';

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
    // creator: '@sujjeeee',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Providers>
            <Header />
            {children}
            <section>
              <div className="px-8 py-24 mx-auto md:px-12 lg:px-32 max-w-screen-xl">
                <div className="w-full rounded-3xl shadow-box shadow-blue-500/50 bg-gradient-to-t from-violet-500 to-fuchsia-600 lg:px-20 lg:py-32 p-8 py-20 flex flex-col gap-14 text-center">
                  <div>
                    <p className="text-4xl tracking-tighter font-semibold text-white md:text-6xl">
                      Take control of your
                      <span className="block"> financial future today</span>
                    </p>
                    <p className="mt-4 text-white max-w-sm mx-auto">
                      Explore our range of services and start your journey
                      towards financial success.
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row justify-center gap-3">
                    <a
                      href="#_"
                      title="your link title"
                      aria-label="your links label"
                      className="rounded-full px-4 py-2 text-sm font-semibold transition-all flex items-center justify-center text-white bg-blue-950 shadow-button shadow-blue-950/50 h-10 focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 duration-200 ring-offset-white hover:shadow-none hover:bg-white hover:text-blue-950"
                    >
                      Get Started for free
                    </a>
                    <a
                      href="/forms/contact"
                      title="your link title"
                      aria-label="your links label"
                      className="rounded-full px-4 border py-2 text-sm font-semibold transition-all flex items-center justify-center bg-white text-gray-500 h-10 border-gray-300 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-blue-950 focus:ring-offset-2 duration-200 ring-offset-white hover:shadow-none hover:bg-white/5 hover:text-blue-700"
                    >
                      Talk to sales
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </Providers>
        </QueryProvider>
        <Analytics />
        {/* <Toaster /> */}
      </body>
    </html>
  );
}

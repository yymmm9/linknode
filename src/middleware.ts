import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/',
    '/(zh|en)/:path*',
    '/(n|create)/:path*',
    '/link',
  ],
  redirect: [
    {
      source: '/link',
      destination: '/:locale/link',
      permanent: true,
    },
  ],
};

// if no locale code and path starts with /n/ redirect by adding locale
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 创建国际化中间件
const intlMiddleware = createMiddleware(routing);

// 自定义中间件处理函数
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 处理直接访问 /signin 和 /signup 的情况
  if (pathname === '/signin' || pathname === '/signup') {
    // 获取用户的首选语言，默认为 'en'
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en';
    // 只接受已配置的语言
    const validLocale = ['en', 'zh'].includes(locale) ? locale : 'en';
    
    // 构建新的 URL
    const newUrl = new URL(`/${validLocale}${pathname}`, request.url);
    // 保留原有的查询参数
    newUrl.search = request.nextUrl.search;
    
    return NextResponse.redirect(newUrl);
  }

  // 对其他路由使用 next-intl 中间件
  return intlMiddleware(request);
}

export const config = {
  // 匹配需要处理的路径
  matcher: [
    // 国际化路径
    '/',
    '/(zh|en)/:path*',
    // 需要重定向的路径
    '/signin',
    '/signup',
    // 其他路径
    '/(n|create|profile)/:path*',
    '/link',
  ],
  redirect: [
    {
      source: '/link',
      destination: '/:locale/link',
      permanent: true,
    },
    //   {
    //     source: '/profile',
    //     destination: '/:locale/profile',
    //     permanent: true,
    //   },
  ],
};

// if no locale code and path starts with /n/ redirect by adding locale
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import useUser from '@/app/hook/useUser';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Logo } from './brand';
import { HideOnScroll } from '@/lib/hooks/scroll';
import UserProfile from './supaauth/user-profile';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// 定义导航项的类型
type NavItem = {
  href: string;
  label: string;
};

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const locale = useLocale();

  // 防御性编程：安全的登出函数
  const signOut = async () => {
    try {
      const supabase = createSupabaseBrowser();
      await supabase.auth.signOut();
      // 使用可选链确保安全
      router.push(`/${locale ?? 'en'}/signin`);
    } catch (error) {
      console.error('登出失败:', error);
      // 可以添加错误通知
    }
  };

  // 定义导航项，使用类型安全的方式
  const navItems: NavItem[] = [
    { href: '/', label: t('Home') },
    { href: '/create', label: t('Create') },
  ];

  // 渲染导航链接的函数，支持移动和桌面视图
  const renderNavLinks = (mobile = false) => (
    <ul className={`${mobile ? 'space-y-4' : 'flex items-center space-x-4'}`}>
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`
              block py-2 px-3 
              ${pathname === item.href 
                ? 'text-primary font-semibold' 
                : 'text-gray-600 hover:text-primary'}
            `}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  // 安全地获取用户头像和名称
  const getUserAvatar = () => {
    const avatarUrl = data?.user_metadata?.avatar_url ?? '/default-avatar.png';
    const userName = data?.user_metadata?.name ?? 'U';
    return { avatarUrl, userName };
  };

  return (
    <HideOnScroll
      id="site-header"
      className="fixed top-2 md:top-6 w-full z-30 max-w-screen-xl px-8 mx-auto md:px-12 lg:px-32"
    >
      <div className="flex items-center justify-between gap-3 h-14 rounded-2xl px-3 backdrop-blur-md bg-white bg-opacity-80 ring-violet-50 ring-2">
        <div>
          <Link
            className="block"
            href="/"
            rel="home"
          >
            <span className="sr-only">Hov.sh</span>
            <Logo className="text-violet-500 h-5" />
          </Link>
        </div>
        <div className="inline-flex items-center space-x-2">
          <nav className="hidden sm:flex sm:grow">
            <ul className="flex grow justify-end flex-wrap items-center text-sm gap-6 px-4">
              {renderNavLinks()}
              {!data && (
                <>
                  <li>
                    <Link
                      href={`/${locale ?? 'en'}/signin`}
                      className="block font-medium text-gray-400"
                    >
                      {t('Login')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale ?? 'en'}/register`}
                      className="block font-medium text-gray-400"
                    >
                      {t('Signup')}
                    </Link>
                  </li>
                </>
              )}
              {data && (
                <li>
                  <UserProfile />
                </li>
              )}
            </ul>
          </nav>

          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button
                className="group inline-flex w-8 h-8 text-gray-800 text-center items-center justify-center transition"
                aria-controls="header-nav"
                aria-expanded={isDrawerOpen}
              >
                <span className="sr-only">Menu</span>
                {isDrawerOpen ? <X /> : <Menu />}
              </button>
            </DrawerTrigger>
            <DrawerContent className=''>
              <div className='w-full max-w-2xl mx-auto'>
              <DrawerHeader>
                <DrawerTitle>{t('Navigation')}</DrawerTitle>
                <DrawerDescription>
                  {t('ExploreOurPages')}
                </DrawerDescription>
              </DrawerHeader>
              
              {data && (
                <div className="px-4 py-4">
                  <div className="w-full">
                    <div className="flex gap-5 items-center">
                      <Avatar>
                        <AvatarImage 
                          src={getUserAvatar().avatarUrl} 
                          alt={getUserAvatar().userName} 
                        />
                        <AvatarFallback>{getUserAvatar().userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">{getUserAvatar().userName}</h2>
                        <p className="text-sm text-gray-500">{data.email ?? '未知邮箱'}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          document.getElementById('manage-profile')?.click();
                        }}
                      >
                        {t('ManageAccount')}
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={signOut}
                      >
                        {t('Logout')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-4 py-6">
                {renderNavLinks(true)}
              </div>

              <DrawerFooter>
                {!data && (
                  <div className="space-y-2">
                    <Link href={`/${locale ?? 'en'}/signin`} className="w-full">
                      <Button variant="outline" className="w-full">
                        {t('Login')}
                      </Button>
                    </Link>
                    <Link href={`/${locale ?? 'en'}/register`} className="w-full">
                      <Button className="w-full">
                        {t('Signup')}
                      </Button>
                    </Link>
                  </div>
                )}
              </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </HideOnScroll>
  );
}

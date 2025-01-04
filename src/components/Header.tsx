'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import { cn } from '@/lib/utils';
import { Logo } from './brand';
import { HideOnScroll } from '@/lib/hooks/scroll';
import UserProfile from './supaauth/user-profile';
import { User } from '@supabase/supabase-js';

const menuItems = [
  {
    name: '敬拜工具',
    description: '敬拜主带领 / 歌谱 / 敬拜历史记录',
    url: '/tools/worship',
    icon: <Menu className="h-5 w-5 xl:h-7 xl:w-7" />,
    className: 'bg-white',
  },
  {
    name: '雅比斯团契',
    description: '团契活动 / 小组 / 服事',
    url: '/ministry/jabez',
    icon: <Menu className="h-5 w-5 xl:h-7 xl:w-7" />,
    className: 'bg-white',
  },
];

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const { data, signOut } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('Home') },
    { href: '/create', label: t('Create') },
    { href: '/docs', label: t('Docs') },
  ];

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
                      href="/login"
                      className="block font-medium text-gray-400"
                    >
                      {t('Login')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
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
            <DrawerContent>
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
                          src={data.user_metadata?.avatar_url || '/default-avatar.png'} 
                          alt={data.user_metadata?.name || 'User Avatar'} 
                        />
                        <AvatarFallback>{data.user_metadata?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">{data.user_metadata?.name}</h2>
                        <p className="text-sm text-gray-500">{data.email}</p>
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
                <ul className="space-y-4 mt-4">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.url}
                        className={`
                          block py-2 px-3 text-gray-600 hover:text-primary
                          ${pathname === item.url ? 'text-primary font-semibold' : ''}
                        `}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <DrawerFooter>
                {!data ? (
                  <div className="space-y-2">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full">
                        {t('Login')}
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button className="w-full">
                        {t('Signup')}
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </HideOnScroll>
  );
}

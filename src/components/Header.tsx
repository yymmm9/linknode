'use client';
import Link from 'next/link';
// import Boards from "./icons/boards";
// import Logo from "./icons/logo";
// import Mark from "./icons/mark";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
// import Ellipsis from "./icons/Ellipsis";
import { MenuIcon } from 'lucide-react';
// import { pathHasGroup, useUserData } from "../services/getUser";
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './brand';

const menuItems = [
  {
    name: '过往聚会',
    url: '/services',
    className: 'bg-white',
    // icon: <Boards className="h-7 w-7 xl:h-8 xl:w-8" />,
  },
  {
    name: '敬拜服侍工具',
    description: '敬拜主带领 / 歌谱 / 敬拜历史记录',
    url: '/tools/worship',
    className: 'bg-white',
    icon: <Music className="h-5 w-5 xl:h-7 xl:w-7" />,
  },
  {
    name: '雅比斯团契',
    url: '/group/yabisi',
    className: '',
    icon: null,
  },
  {
    name: '锡安团契',
    url: '/group/xian',
    className: '',
    icon: null,
  },
  {
    name: '主日学小班',
    url: '/group/xiaoban',
    className: '',
    icon: null,
  },
];

const Header = () => {
  return (
    <header
      id="site-header"
      className="fixed top-2 md:top-6 w-full z-30 max-w-screen-xl px-8 mx-auto md:px-12 lg:px-32 "
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 h-14 rounded-2xl px-3 backdrop-blur-md bg-white bg-opacity-80 ring-violet-50 ring-2">
          <div>
            <Link
              className="block"
              href="https://cruip.com/"
              rel="home"
              // style="outline: none;"
            >
              <span className="sr-only">Hov.sh</span>
              <Logo className="text-violet-500 h-5" />
            </Link>
          </div>
          <div className="inline-flex items-center">
            <nav className="hidden sm:flex sm:grow">
              <ul className="flex grow justify-end flex-wrap items-center text-sm gap-6 px-4">
                {/* <li className="ml-6 flex gap-1.5 items-start">
                  <Link
                    href="https://originui.com"
                    className="flex items-center font-medium text-gray-800 hover:underline"
                    target="_blank"
                    // style="outline: none;"
                  >
                    OriginUI
                    <svg
                      className="fill-current text-gray-500 ml-1 -mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="9"
                      fill="none"
                    >
                      <path d="M1.65 8.514.74 7.6l5.514-5.523H2.028l.01-1.258h6.388v6.394H7.16l.01-4.226L1.65 8.514Z"></path>
                    </svg>
                  </Link>
                  <span className="uppercase text-violet-500 text-[10px] font-semibold">
                    New
                  </span>
                </li> */}
                <li className="">
                  <Link
                    href="/contact"
                    className="block font-medium text-gray-400"
                    // style="outline: none;"
                  >
                    联系
                  </Link>
                </li>
                {/* <li className="border-l background-gray-200 h-full"></li>
                <li className="flex items-center">
                  <Drawer>
                    <DrawerTrigger>
                      <MenuIcon className="size-6 md:size-8 xl:size-10 block font-medium text-gray-400" />
                    </DrawerTrigger>
                    <DrawerContent className="bg-white">
                      <div
                        className="mx-auto mt-4 grid w-full grid-cols-2 grid-rows-2
                         items-center justify-center gap-2 p-2 xl:my-6 xl:max-w-xl"
                      >
                        {menuItems.map((item, index) => (
                          <DrawerClose key={index}>
                            <Link
                              href={item.url}
                              className={cn(
                                'rounded-lg border bg-neutral-50 border-neutral-200 text-neutral-500 hover:text-neutral-900',
                                { 'row-span-2': index === 0 },
                                item.className,
                              )}
                            >
                              <div className="flex w-full items-center justify-center gap-2 py-6 text-xl lg:py-16 lg:text-2xl h-full">
                                {item.icon}
                                {item.name}
                              </div>
                            </Link>
                          </DrawerClose>
                        ))}
                      </div>
                    </DrawerContent>
                  </Drawer>
                </li> */}
              </ul>
            </nav>

            <div className="flex sm:hidden ml-2">
              <button
                id="header-nav-toggle"
                className="group inline-flex w-8 h-8 text-gray-800 text-center items-center justify-center transition"
                aria-controls="header-nav"
                aria-expanded="false"
                // style="outline: none;"
              >
                <span className="sr-only">Menu</span>
                <svg
                  className="fill-current pointer-events-none"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] -translate-y-[5px] translate-x-[7px] group-[[aria-expanded=true]]:rotate-[315deg] group-[[aria-expanded=true]]:translate-y-0 group-[[aria-expanded=true]]:translate-x-0"
                    y="7"
                    width="9"
                    height="2"
                    rx="1"
                  ></rect>
                  <rect
                    className="origin-center group-[[aria-expanded=true]]:rotate-45 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]"
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                  ></rect>
                  <rect
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] translate-y-[5px] group-[[aria-expanded=true]]:rotate-[135deg] group-[[aria-expanded=true]]:translate-y-0"
                    y="7"
                    width="9"
                    height="2"
                    rx="1"
                  ></rect>
                </svg>
              </button>
              <nav
                id="header-nav"
                className="grid grid-rows-[0fr] rounded-xl [&amp;.menu-is-open]:grid-rows-[1fr] [&amp;.menu-is-open]:visible absolute inset-x-0 top-full mt-1 z-50 [&amp;.menu-is-open]:bg-white [&amp;.menu-is-open]:shadow-lg shadow-black/[.04] transition-all duration-300 [&amp;>div]:opacity-0 [&amp;.menu-is-open>div]:opacity-100"
              >
                <div className="overflow-hidden transition-opacity duration-300">
                  <ul className="text-sm py-1.5 px-3 divide-y divide-gray-100">
                    <li className="relative">
                      <Link
                        href="https://originui.com"
                        className="flex items-center text-gray-800 hover:underline py-2 px-2"
                        target="_blank"
                        // style="outline: none;"
                      >
                        OriginUI
                        <svg
                          className="fill-current text-gray-500 ml-1 -mt-0.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="9"
                          height="9"
                          fill="none"
                        >
                          <path d="M1.65 8.514.74 7.6l5.514-5.523H2.028l.01-1.258h6.388v6.394H7.16l.01-4.226L1.65 8.514Z"></path>
                        </svg>
                      </Link>
                      <span className="uppercase text-violet-500 text-[10px] font-semibold absolute top-2 left-20">
                        New
                      </span>
                    </li>
                    <li>
                      <Link
                        href="https://cruip.com/docs/"
                        className="flex text-gray-800 hover:underline py-2 px-2"
                        // style="outline: none;"
                      >
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex text-gray-800 hover:underline py-2 px-2"
                        href="https://cruip.com/login/"
                        // style="outline: none;"
                      >
                        Login
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

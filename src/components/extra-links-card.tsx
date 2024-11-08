import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface ExtraLinksCardProps {
  label: string;
  url: string;
  icon?: string;
}

export default function ExtraLinksCard({
  label,
  url,
  icon,
}: ExtraLinksCardProps) {
  return (
    <li className="group relative flex items-center justify-between w-full border shadow rounded-full hover:scale-105 transition-all ease-in-out duration-300 dark:bg-black/90 bg-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 max-w-lg cursor-pointer">
      {label && url && (
        <Link href={url} className="flex items-center w-full p-2 rounded-full">
          <dt className="flex w-full items-center relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center size-6">
              {icon ? (
                <Icon icon={icon} className="size-5" />
              ) : (
                <Icon icon="ph:link-simple" className="size-5" />
              )}
            </div>
            <p className="flex justify-center font-medium font-monoo w-full dark:text-neutral-100 text-neutral-800">
              {label}
            </p>
          </dt>
        </Link>
      )}
      {/* <div className="absolute group-hover:flex right-3 top-1/2 -translate-y-1/2 items-center md:hidden md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
          <CopyToClipboard url={url} />
        </div> */}
    </li>
  );
}

'use client';

import useUser from '@/app/hook/useUser';
import { supabase } from '@/lib/utils';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import EditShortLink from './edit-link';

export default async function UserShortLinks() {
  const [hasCopied, setHasCopied] = React.useState(false);
  const { data: user, isLoading: userIsLoading, isError, error } = useUser();
  if (userIsLoading) return <div>Loading...</div>;
  if (!user) {
    window.location.href = '/signup';
  }
  // if (isError) return <div>Error: {error.message}</div>;
  const res = await supabase.from('links').select().eq('user_id', user?.id);
  if (res.error) return <div>Error: {res.error.message}</div>;

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setHasCopied(true);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
      return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 ">
      {res.data.map((link) => {
        const url = 'hov.sh/' + link.key;
        return (
          <div
            key={link.id}
            className="border-gray-200 bg-white border rounded-xl transition-[filter] hover:drop-shadow-card-hover"
          >
            <div className=" py-2.5 px-4 flex items-center gap-5 sm:gap-8 md:gap-12 text-sm justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar Image */}
                <div className="relative shrink-0 items-center justify-center sm:flex">
                  <div className="absolute inset-0 shrink-0 rounded-full border border-gray-200 opacity-0 transition-opacity opacity-100">
                    <div className="h-full w-full rounded-full border border-white bg-gradient-to-t from-gray-100"></div>
                  </div>
                  <div className="relative p-2">
                    <img
                      alt={link.key}
                      draggable="false"
                      width="20"
                      height="20"
                      className="blur-0 rounded-full h-5 w-5 shrink-0 transition-[width,height] sm:h-6 sm:w-6"
                      src={'https://avatar.vercel.sh/' + link.key} // 动态头像链接
                      style={{ color: 'transparent' }}
                    />
                  </div>
                </div>

                {/* Link */}
                <div className="min-w-0 grow flex flex-col">
                  <div className="flex items-center gap-2">
                    <Link
                      href={url}
                      className="truncate font-semibold leading-6 text-gray-800 transition-colors hover:text-black"
                    >
                      {url}
                    </Link>
                    <Button
                      variant={'ghost'}
                      className="relative group  flex items-center !p-1.5 h-fit"
                      onClick={() => copyToClipboard(url)}
                    >
                      {hasCopied ? (
                        <>
                          <Check className="size-4" />
                          <span className="sr-only">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          <span className="sr-only">复制</span>
                        </>
                      )}
                    </Button>
                  </div>
                  {/* Timestamps */}
                  <div className="text-sm text-gray-400 flex gap-2">
                    <p>{dayjs(link?.created_at).format('YYYY-MM-DD')}</p>
                    {/* <p>
                      Last Modified:{' '}
                      {dayjs(link?.last_modified).format('YYYY-MM-DD HH:mm')}
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <EditShortLink linkKey={link.key} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

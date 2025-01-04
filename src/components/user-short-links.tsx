'use client';

import useUser from '@/app/hook/useUser';
// import { supabase } from '@/lib/utils';
import { Button } from './ui/button';
import { Check, Copy, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import EditShortLink from './edit-link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';

interface LinkData {
  id: string;
  link_id: string;
  key: string;
  user_id: string;
  created_at: string; // Adjust type based on your actual data structure
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function UserShortLinks() {
  // {Links}
  // :{Links: any}
  const [links, setLinks] = useState<LinkData[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { data: user, isLoading: userIsLoading } = useUser();
  const router = useRouter();
  const t = useTranslations('Profile');
  useEffect(() => {
    // Redirect if the user is loading or not found
    if (userIsLoading) return; // Loading state
    if (!user) {
      router.push('/signup'); // Use Next.js router for redirection
      return;
    }

    // Fetch links for the user
    const fetchLinks = async () => {
      const res = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id);
      if (res.error) {
        toast.error(`Error fetching links: ${res.error.message}`);
      } else {
        setLinks(res.data as LinkData[]); // Cast to LinkData array
      }
    };

    fetchLinks();
  }, [userIsLoading, user, router]);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success(t('LinkCopied'));
      setTimeout(() => {
        setCopiedUrl('');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error(t('CopyFailed'));
    }
  };

  if (userIsLoading) return <div>{t('Loading')}...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* 创建链接按钮 */}
      <Button
        variant="default"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => router.push('/create')}
      >
        <Plus className="h-4 w-4" />
        {t('CreateLink')}
      </Button>

      {/* 链接列表 */}
      
        <div className="flex flex-col gap-4">
          <h3>{t('LinksTitle')}</h3>
          {links?.length && links.map((link) => {
            const url = 'hov.sh/' + link.key;
            return (
              <div
                key={link.id}
                className="border-gray-200 bg-white border rounded-xl transition-[filter] hover:drop-shadow-card-hover"
              >
                <div className="relative py-2.5 px-4 flex items-center gap-5 sm:gap-8 md:gap-12 text-sm justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar Image */}
                    <div className="relative shrink-0 items-center justify-center sm:flex">
                      <div className="absolute inset-0 shrink-0 rounded-full border border-gray-200 transition-opacity">
                        <div className="h-full w-full rounded-full border border-white bg-gradient-to-t from-gray-100"></div>
                      </div>
                      <div className="relative p-2">
                        <img
                          alt={link.key}
                          draggable="false"
                          width="20"
                          height="20"
                          className="blur-0 rounded-full h-5 w-5 shrink-0 transition-[width,height] sm:h-6 sm:w-6"
                          src={'https://avatar.vercel.sh/' + link.key}
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
                          className="relative group flex items-center !p-1.5 h-fit"
                          onClick={() => handleCopy(url)}
                        >
                          {copiedUrl === url ? (
                            <>
                              <Check className="size-4" />
                              <span className="sr-only">{t('Copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-4" />
                              <span className="sr-only">{t('Copy')}</span>
                            </>
                          )}
                        </Button>
                      </div>
                      {/* Timestamps */}
                      <div className="text-sm text-gray-400 flex gap-2">
                        <p>{dayjs(link?.created_at).format('YYYY-MM-DD')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <EditShortLink linkKey={link.key} linkId={link.link_id} />
                </div>
              </div>
            );
          })}
        </div>
      {/* ) : (
        <div className="text-center py-8 text-gray-500">
          {t('NoLinks')}
        </div>
      )} */}
    </div>
  );
}

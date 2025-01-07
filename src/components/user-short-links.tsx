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
import { useLocale } from 'next-intl';

interface LinkData {
  id: string;
  link_id: string;
  key: string;
  user_id: string;
  n?: string;  // 名
  ln?: string; // 姓
  link_name?: string;
  created_at: string;
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
  const locale = useLocale();

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
        // toast.error(`Error fetching links: ${res.error.message}`);
      } else {
        // 根据 locale 更新每个链接的显示名称
        const processedLinks = res.data?.map(link => {
          if (link.n && link.ln) {
            const linkName = locale === 'zh' 
              ? `${link.n} ${link.ln}` 
              : `${link.ln} ${link.n}`;
            
            // 如果显示名称需要更新
            if (link.link_name !== linkName) {
              supabase
                .from('links')
                .update({ link_name: linkName })
                .eq('id', link.id)
                .then(({ error }) => {
                  if (error) console.error('更新链接名称失败', error);
                });
            }

            return { ...link, link_name: linkName };
          }
          return link;
        }) || [];

        setLinks(processedLinks);
      }
    };

    fetchLinks();
  }, [userIsLoading, user, router, locale]);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      // toast.success(t('LinkCopied'));
      setTimeout(() => {
        setCopiedUrl('');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // toast.error(t('CopyFailed'));
    }
  };

  const updateLinkName = async (link: LinkData, newName: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .update({ link_name: newName })
        .eq('id', link.id);

      if (error) {
        toast.error(`更新链接名称失败: ${error.message}`);
      } else {
        // 更新本地状态
        setLinks(prevLinks => 
          prevLinks.map(l => 
            l.id === link.id ? { ...l, link_name: newName } : l
          )
        );
      }
    } catch (error) {
      console.error('更新链接名称时出错:', error);
      toast.error('更新链接名称失败');
    }
  };

  if (userIsLoading) return <div>载入中...</div>;

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
                          {link?.link_name ?? url}
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
                        {link.link_name && <p>{url}</p>}
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

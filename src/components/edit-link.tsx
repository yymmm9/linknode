'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Edit } from 'lucide-react';
import updateShortLink from '@/app/_actions/shortlink/update';
import retrieveShortLink from '@/app/_actions/shortlink/retrieve';
import { useData } from '@/lib/context/link-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BackgroundShell from './backgrounds/background-shell';
import ExtraLinksForm from './forms/extra-links-form';
import ProfileForm from './forms/profile-form';
import SocialLinksForm from './forms/social-links-form';
import { toast } from "sonner"

interface EditShortLinkProps {
  linkKey: string;
  linkId: string;
}

// 解析链接数据的函数
const parseLinkData = (url: string) => {
  try {
    const urlParts = url.split('?');
    const queryString = urlParts[1];
    if (!queryString) return null;

    const params = new URLSearchParams(queryString);
    const rawData = params.get('data');
    if (!rawData) return null;

    return JSON.parse(decodeURIComponent(rawData));
  } catch (error) {
    console.error('[parseLinkData] Error:', error);
    return null;
  }
};

export default function EditShortLink({ linkKey: key, linkId: id }: EditShortLinkProps) {
  const t = useTranslations('EditShortLink');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: contextData, setData } = useData();
  const queryClient = useQueryClient();

  // 使用 useQuery 获取链接数据
  const { data: linkData, isLoading } = useQuery({
    queryKey: ['link', key],
    queryFn: async () => {
      const result = await retrieveShortLink(key);
      if (!result?.data?.url) return null;
      return parseLinkData(result.data.url);
    },
    enabled: Boolean(key) && isDrawerOpen, // 只在抽屉打开时获取数据
    staleTime: 1000 * 60 * 5, // 5分钟内认为数据是新鲜的
    cacheTime: 1000 * 60 * 30, // 缓存30分钟
  });

  // 更新链接
  const updateLink = useCallback(async () => {
    if (!key || !contextData) {
      console.log('[updateLink] Missing key or data');
      return;
    }

    try {
      const encodedData = encodeURIComponent(JSON.stringify(contextData));
      const updateUrl = `${window.location.protocol}//${window.location.host}?data=${encodedData}`;
      
      const result = await updateShortLink({
        id,
        url: updateUrl,
        key,
      });

      if (result.success) {
        // 更新缓存
        queryClient.setQueryData(['link', key], contextData);
        // 关闭抽屉
        setIsDrawerOpen(false);
      } else {
        console.error('[updateLink] Update failed:', result.error);
      }
    } catch (error) {
      console.error('[updateLink] Error:', error);
    }
  }, [key, id, contextData, queryClient]);

  // 处理抽屉状态变化
  const handleDrawerChange = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
    if (open && linkData) {
      setData(linkData);
    }
  }, [linkData, setData]);

  // 测试 toast 的函数
  const testToast = useCallback(() => {
    // toast('测试成功 Toast');
    console.log('测试 Toast 按钮被点击');
  }, []);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleDrawerChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => {
            console.log('[EditButton] Clicked');
            handleDrawerChange(true);
          }}
        >
          {t('edit')}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t('edit-short-link')}</DrawerTitle>
            <DrawerDescription>
              {t('modify-your-short-link-settings')}
            </DrawerDescription>
          </DrawerHeader>

          <div className="max-h-[calc(75vh-10rem)] overflow-y-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                {t('loading')}...
              </div>
            ) : linkData ? (
              <div className="flex w-full flex-col gap-5">
                <ProfileForm />
                <SocialLinksForm />
                <ExtraLinksForm />
                <BackgroundShell />
              </div>
            ) : (
              <div className="flex items-center justify-center p-4">
                {t('no-data-available')}
              </div>
            )}
          </div>

          <DrawerFooter className="mt-4">
            <div className="flex w-full gap-2">
              <Button
                className="flex-1"
                onClick={updateLink}
                disabled={isLoading || !contextData}
              >
                {isLoading ? t('updating') : t('submit')}
              </Button>
              <DrawerClose asChild>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    console.log('[CancelButton] Clicked');
                    handleDrawerChange(false);
                  }}
                >
                  {t('cancel')}
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>

          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              onClick={testToast} 
              className="w-full"
            >
              测试 Toast 通知
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

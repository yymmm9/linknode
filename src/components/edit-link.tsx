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
import { encodeData, decodeData } from '@/lib/utils';

interface EditShortLinkProps {
  linkKey: string;
  linkId: string;
}

// 解析链接数据的函数
const parseLinkData = (url: string) => {
  console.log("parseLinkData 输入", {url})
  try {
    // 方法1：尝试从查询参数解析
    const parseFromQueryString = () => {
      const queryString = url.split('?')[1];
      const params = new URLSearchParams(queryString);
      const rawData = params.get('data');
      if (rawData) {
        const parsedData = decodeData(rawData);
        console.log("parseLinkData 查询参数解析结果", parsedData);
        return parsedData;
      }
      return null;
    };

    // 方法2：尝试从 URL 解析
    const parseFromUrl = () => {
      try {
        const parsedUrl = new URL(url);
        const dataParam = parsedUrl.searchParams.get('data');
        if (dataParam) {
          const parsedData = decodeData(dataParam);
          console.log("parseLinkData URL解析结果", parsedData);
          return parsedData;
        }
      } catch (urlError) {
        console.warn('URL解析失败:', urlError);
      }
      return null;
    };

    // 方法3：尝试直接解析 JSON
    const parseDirectJson = () => {
      try {
        const parsedData = decodeData(url);
        console.log("parseLinkData JSON解析结果", parsedData);
        return parsedData;
      } catch (jsonError) {
        console.warn('JSON解析失败:', jsonError);
      }
      return null;
    };

    // 依次尝试解析方法
    return parseFromQueryString() 
      || parseFromUrl() 
      || parseDirectJson() 
      || null;
  } catch (error) {
    console.error('[parseLinkData] 解析错误:', error);
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
      console.log('retrieveShortLink 结果', {result, key});
      
      // 如果没有 URL，返回 null
      if (!result?.data?.url) {
        console.warn('没有找到链接 URL');
        return null;
      }

      // 解析链接数据
      const parsedData = parseLinkData(result.data.url);
      console.log('解析后的链接数据', parsedData);
      
      return parsedData;
    },
    enabled: Boolean(key), // 只要有 key 就获取数据，不依赖抽屉状态
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
      const encodedData = encodeData(contextData);
      console.log({encodedData})
      const updateUrl = `${window.location.protocol}//${window.location.host}/link?data=${encodedData}`;
      
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
      // 如果有数据，更新 context
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
        <div className="mx-auto w-full max-w-2xl">
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

          <DrawerFooter className="">
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

          {/* <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              onClick={testToast} 
              className="w-full"
            >
              测试 Toast 通知
            </Button>
          </div> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

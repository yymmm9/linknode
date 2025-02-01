'use client';

import React from 'react';
import { env } from '@/env.mjs';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/lib/context/link-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShortener } from '@/lib/context/shortlink-context';
import createShortLink from '@/app/_actions/shortlink/create';
import { CreateShortLinkInput, shortlinkSchema, isValidShortLinkKey, normalizeShortLinkValue } from '@/types';
import { useAPIResponse } from '@/lib/context/api-response-context';
import { catchError, checkCustomCredentials, cn, encodeData } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useUser from '@/app/hook/useUser';
import { createClient } from '@supabase/supabase-js';
import { useLocale } from 'next-intl';
import { LinkCreationStore } from '@/stores/link-creation-store';
import { useRouter } from 'next/navigation';
import { useRedirect } from '@/lib/utils/redirect';
import { useTranslations } from 'next-intl';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateShortlinkFormProps {
  handleCreateLink?: () => Promise<void>;
}

type CreateShortlinkFormData = {
  url: string;
  domain?: string;
  shortLink: string;
  n?: number | string;
  ln?: number | string;
};

export default function CreateShortlinkForm({
  handleCreateLink,
}: {
  handleCreateLink?: () => Promise<void>;
}) {
  const { data } = useData();
  const { shortUrlInfo } = useShortener();
  const isValid = checkCustomCredentials(shortUrlInfo);
  const [isLoading, setIsLoading] = React.useState(false);
  const { setSomeResponseInfo, setAuthKey, setProjectSlug, setShortedLink } = useAPIResponse();

  const { data: user } = useUser();

  const locale = useLocale();

  const { redirect } = useRedirect();

  const [shortUrlInfoState, setShortUrlInfoState] = React.useState<CreateShortlinkFormData>({
    url: '',
    shortLink: '',
  });

  const form = useForm<CreateShortlinkFormData>({
    resolver: zodResolver(shortlinkSchema),
    defaultValues: {
      url: '',
      domain: '',
      shortLink: '',
    },
  });

  const router = useRouter();

  const t = useTranslations('CreateShortLink');
  const tCommon = useTranslations('Common');

  // Utility function to convert value to string or undefined
  const convertToStringOrUndefined = (value: string | number | boolean | undefined): string | undefined => {
    if (value === undefined || value === '') return undefined;
    return String(value);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    if (name in form.getValues()) {
      form.setValue(name as keyof CreateShortlinkFormData, value);
      setShortUrlInfoState((prevData) => ({
        ...prevData,
        [name]: convertToStringOrUndefined(value) ?? value,
      }));
    }
  }

  function handleGlobalState(name: keyof CreateShortlinkFormData, value: string | number | boolean | undefined) {
    const stringValue = convertToStringOrUndefined(value);
    
    if (stringValue !== undefined) {
      form.setValue(name, stringValue);
      setShortUrlInfoState((prevInfo) => ({
        ...prevInfo,
        [name]: stringValue,
      }));
      return;
    }
    
    form.resetField(name, { defaultValue: '' });
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/link?data=${encodeData(data)}`;
    form.setValue('url', url);
    setShortUrlInfoState((prevInfo) => ({
      ...prevInfo,
      url: url,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function onSubmit(formData: CreateShortlinkFormData) {
    console.group('🔍 短链接创建调试');
    console.log('🚀 提交数据:', formData);
    console.log('👤 用户信息:', user);
    console.log('🌐 当前语言:', locale);

    try {
      console.log('🔒 开始创建短链接流程');
      setIsLoading(true);

      // 详细的输入验证日志
      if (!formData.url || formData.url.trim() === '') {
        console.error('❌ URL 验证失败: URL 为空');
        console.log('表单数据:', formData);
        console.groupEnd();
        return;
      }

      // 用户登录状态检查
      if (!user) {
        console.warn('⚠️ 用户未登录，重定向到登录页');
        LinkCreationStore.setLinkData({
          destination: formData.url,
          customDomain: formData.domain !== undefined 
            ? typeof formData.domain === 'string' 
              ? formData.domain 
              : String(formData.domain) 
            : undefined,
          shortLink: formData.shortLink,
          n: formData.n !== undefined 
            ? typeof formData.n === 'string' 
              ? formData.n 
              : String(formData.n)
            : undefined,
          ln: formData.ln !== undefined 
            ? typeof formData.ln === 'string' 
              ? formData.ln 
              : String(formData.ln)
            : undefined
        });
        
        console.log('🔄 重定向到:', `/${locale}/signup?next=/${locale}/create`);
        router.push(`/${locale}/signup?next=/${locale}/create`);
        console.groupEnd();
        return;
      }

      // 外部处理函数
      if (handleCreateLink) {
        console.log('🔧 执行外部 handleCreateLink');
        await handleCreateLink();
        console.groupEnd();
        return;
      }

      // 主要提交逻辑
      console.log('📤 调用 createShortLink');
      const response = await createShortLink(formData);
      console.log('📥 createShortLink 响应:', response);

      if (!response) {
        console.error('❌ 创建短链接返回空响应');
        console.groupEnd();
        return;
      }

      if (response.error) {
        console.error('❌ 创建短链接错误:', response.error);
        console.groupEnd();
        return;
      }

      // 成功创建链接后的处理
      if (response.data?.key) {
        console.log('✅ 成功生成短链接 Key:', response.data.key);
        
        const linkName = locale === 'zh' 
          ? `${formData.n} ${formData.ln}` 
          : `${formData.ln} ${formData.n}`;
        
        console.log('📝 链接名称:', linkName);
        
        const body = [
          {
            user_id: user.id,
            key: response.data.key,
            n: formData.n,  
            ln: formData.ln, 
            link_name: linkName, 
          },
        ];

        console.log('💾 准备保存到 Supabase:', body);
        const { error: supabaseError } = await supabase.from('links').insert(body);
        
        if (supabaseError) {
          console.error('❌ Supabase 插入错误:', supabaseError);
        }
      }

      // 更新状态
      const shortLink = `https://${response.data?.domain}/${response.data?.key}`;
      console.log('🔗 生成的短链接:', shortLink);
      
      setShortedLink(shortLink);
      setSomeResponseInfo(response.data);
      
      // 管理员特殊处理
      const isAdmin = user.id === 'your-admin-id';
      const token = isAdmin ? env.DUB_DOT_CO_TOKEN ?? '' : '';
      const projectSlug = isAdmin ? env.DUB_DOT_CO_SLUG ?? '' : '';

      console.log('🔑 管理员信息:', { isAdmin, token, projectSlug });

      setAuthKey(token);
      setProjectSlug(projectSlug);

      console.log('✨ 短链接创建流程完成');
      console.groupEnd();

    } catch (error) {
      console.error('❌ 创建短链接异常:', error);
      console.groupEnd();
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        className="grid gap-2"
      >
        <FormField
          control={form.control}
          name="shortLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customShortLink')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('enterCustomShortLink')}
                  {...field}
                  value={
                    shortUrlInfoState.shortLink 
                      ?? field.value 
                      ?? ''
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(e);
                  }}
                  name="shortLink"
                  className="h-8"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          // className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <AiOutlineLoading3Quarters
                className={cn(
                  !isLoading ? "hidden" : "block animate-spin"
                )}
                aria-hidden="true"
              />
              {tCommon('creating')}
            </>
          ) : (
            t('createShortLink')
          )}
        </Button>
      </form>
    </Form>
  );
}
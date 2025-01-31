'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/lib/context/link-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShortener } from '@/lib/context/shortlink-context';
import createShortLink from '@/app/_actions/shortlink/create';
import { CreateShortLinkInput, shortlinkSchema, isValidShortLinkKey, normalizeShortLinkValue, DataProps } from '@/types';
import { useAPIResponse } from '@/lib/context/api-response-context';
import { catchError, checkCustomCredentials, cn, encodeData } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useUser from '@/app/hook/useUser';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { useLocale } from 'next-intl';
import { LinkCreationStore } from '@/stores/link-creation-store';
import { useRouter } from 'next/navigation';
import { useRedirect } from '@/lib/utils/redirect';
import { useTranslations } from 'next-intl';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateShortlinkFormProps {
  handleCreateLink?: () => Promise<void>;
}

// 更新类型定义，确保 url 为必填且非可选
type CreateShortlinkFormData = {
  url: string;  // 明确指定为必填 string
  domain?: string;
  shortLink: string;
  n?: string;  // 更改为 string 类型
  ln?: string;  // 更改为 string 类型
};

// 添加新的类型定义
type LinkData = {
  user_id: string;
  key: string;
  link_id: string;
  link_name: string;
  last_modified: string;
  destination: string;
  custom_domain: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 工具函数：生成唯一的 linkId
const generateLinkId = (): string => {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
};

// 数据验证函数
const validateLinkData = (data: unknown): data is LinkData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'user_id' in data &&
    'key' in data &&
    'link_id' in data &&
    'link_name' in data &&
    'last_modified' in data &&
    'destination' in data &&
    'custom_domain' in data
  );
};

// 安全的数据解码函数
const safeDecodeData = (url: string): Record<string, any> => {
  try {
    const dataParam = url.split('data=')[1];
    return dataParam 
      ? JSON.parse(atob(dataParam)) 
      : {};
  } catch (error) {
    console.error('数据解码失败:', error);
    return {};
  }
};

// 安全的链接 ID 生成函数
const safeLinkIdGeneration = (decodedData?: Record<string, any>): string => {
  // 尝试从解码数据中获取 ID
  if (decodedData?.ls && Array.isArray(decodedData.ls) && decodedData.ls.length > 0) {
    const firstLinkId = decodedData.ls[0]?.id;
    if (firstLinkId) return firstLinkId.toString();
  }

  // 如果无法获取，生成随机 ID
  return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
};

// 安全的链接名称生成函数
const safeLinkNameGeneration = (
  formData: CreateShortlinkFormData, 
  decodedData: Record<string, any>, 
  locale: string
): string => {
  // 安全地获取名称
  const firstName = formData.n ?? decodedData.n ?? '';
  const lastName = formData.ln ?? '';

  return locale === 'zh' 
    ? `${firstName} ${lastName}`.trim() 
    : `${lastName} ${firstName}`.trim() || 'Untitled Link';
};

// 安全的数据编码函数，防止编码失败
const safeEncodeData = (data: CreateShortlinkFormData | DataProps): string => {
  // 如果传入的是 DataProps，先转换为 CreateShortlinkFormData
  const formData = 'url' in data 
    ? data as CreateShortlinkFormData 
    : convertToCreateShortlinkFormData(data as DataProps);

  try {
    // 确保 url 非空
    if (!formData.url) {
      throw new Error('URL 不能为空');
    }
    
    // 使用 JSON.stringify 进行安全编码
    return encodeURIComponent(JSON.stringify(formData));
  } catch (error) {
    console.error('编码数据时发生错误:', error);
    return '';
  }
};

// 安全的链接创建 Hook
const useLinkCreation = (supabase: SupabaseClient, user: User | null) => {
  const [isCreationLoading, setIsCreationLoading] = useState(false);

  const createLink = useCallback(async (
    formData: CreateShortlinkFormData, 
    url: string, 
    locale: string
  ): Promise<ApiResponse<LinkData>> => {
    // 严格的用户和 Supabase 存在性检查
    if (!user?.id || !supabase) {
      return { 
        success: false, 
        error: '用户未登录或数据库连接异常' 
      };
    }

    try {
      setIsCreationLoading(true);

      // 生成安全的链接数据
      const linkData: LinkData = {
        user_id: user.id,
        key: `link-${Date.now()}`,
        link_id: crypto.randomUUID().replace(/-/g, '').substring(0, 16),
        link_name: formData.shortLink || 'Untitled Link',
        last_modified: new Date().toISOString(),
        destination: formData.url || '',
        custom_domain: formData.domain || ''
      };

      // 严格的数据验证
      if (!validateLinkData(linkData)) {
        throw new Error('无效的链接数据');
      }

      // 安全的数据库插入
      const { data: result, error } = await supabase
        .from('links')
        .insert([linkData])
        .select();

      if (error) throw error;

      return { 
        success: true, 
        data: result[0] 
      };
    } catch (error) {
      console.error('链接创建失败:', error);
      return { 
        success: false, 
        error: error instanceof Error 
          ? error.message 
          : '未知错误' 
      };
    } finally {
      setIsCreationLoading(false);
    }
  }, [supabase, user]);

  return { 
    createLink, 
    isCreationLoading 
  };
};

// 安全地将 DataProps 转换为 CreateShortlinkFormData
function convertToCreateShortlinkFormData(data: DataProps): CreateShortlinkFormData {
  return {
    url: data.url || data.website || '', // 确保返回非 undefined 的字符串
    shortLink: data.shortLink || '',
    domain: data.o,
    n: data.n ? String(data.n) : undefined,  // 安全转换为字符串
    ln: data.ln ? String(data.ln) : undefined  // 安全转换为字符串
  };
}

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

  if(!user){return}

  const locale = useLocale();

  const { redirect } = useRedirect();

  const [shortUrlInfoState, setShortUrlInfoState] = React.useState<CreateShortlinkFormData>({
    url: '',
    shortLink: '',
  });

  const { createLink, isCreationLoading } = useLinkCreation(supabase, user);

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

  useEffect(() => {
    console.log('CreateShortlinkForm 组件挂载');
    return () => {
      console.log('CreateShortlinkForm 组件卸载');
    };
  }, []);

  useEffect(() => {
    const subscription = form.watch((values) => {
      console.log('表单当前值:', values);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (typeof window !== 'undefined' && data) {
      const url = `${window.location.origin}/link?data=${safeEncodeData(data)}`;
      console.log('🔗 初始化 URL:', url);
      
      // 直接设置表单值和状态
      form.setValue('url', url);
      setShortUrlInfoState(prev => ({
        ...prev,
        url: url
      }));
    }
  }, [data]);

  const debugFormState = () => {
    console.group('🔍 CreateShortlinkForm 调试信息');
    console.log('用户信息:', user);
    console.log('表单值:', form.getValues());
    console.log('短链接状态:', shortUrlInfoState);
    console.log('是否正在加载:', isLoading);
    console.log('短链接信息有效性:', isValid);
    console.groupEnd();
  };

  async function onSubmit(formData: CreateShortlinkFormData | DataProps) {
    try {
      console.group('🚀 提交短链接');
      
      // 转换数据为 CreateShortlinkFormData
      const safeFormData: CreateShortlinkFormData = 'url' in formData 
        ? formData as CreateShortlinkFormData 
        : convertToCreateShortlinkFormData(formData as DataProps);

      console.log('提交数据:', safeFormData);
      debugFormState();

      // 安全地处理外部函数
      if (handleCreateLink) {
        try {
          await handleCreateLink();
        } catch (error) {
          console.warn('外部处理函数执行失败:', error);
        }
      }

      // 安全地生成 URL
      const url = safeFormData.url?.trim() || 
        (typeof window !== 'undefined' 
          ? `${window.location.origin}/link?data=${safeEncodeData(safeFormData)}` 
          : '');

      // 安全检查：如果 url 仍为空，抛出错误
      if (!url) {
        console.error('无法生成有效的 URL');
        return;  // 提前返回，避免继续执行
      }

      // 后续处理逻辑
      const response = await createLink(safeFormData, url, locale);
      if (response.success) {
        toast.success(tCommon('linkCreatedSuccessfully'));
        form.reset();
      } else {
        toast.error(response.error || tCommon('createLinkFailed'));
      }

      console.groupEnd();
    } catch (error) {
      console.error('❌ 创建短链接发生异常:', error);
      toast.error(tCommon('createLinkFailed'));
    }
  }

  // 测试 Supabase 插入的占位数据
  const testSupabaseInsertion = async () => {
    try {
      // 生成随机 linkId
      const linkId = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
      
      // 准备测试数据
      const testLinkData = {
        user_id: user?.id || '', // 确保有用户 ID
        key: `test-${Date.now()}`, // 使用时间戳创建唯一 key
        link_id: linkId,
        link_name: '测试链接',
        last_modified: new Date().toISOString(),
        destination: '',
        custom_domain: ''
      };

      console.group('🧪 Supabase 测试插入');
      console.log('准备插入的测试数据:', testLinkData);

      // 执行插入
      const { data, error } = await supabase
        .from('links')
        .insert([testLinkData])
        .select();

      if (error) {
        console.error('❌ Supabase 插入失败:', error);
        toast.error(`插入失败：${error.message}`);
      } else {
        console.log('✅ Supabase 插入成功:', data);
        toast.success('测试数据插入成功');
      }

      console.groupEnd();
    } catch (err) {
      console.error('❌ Supabase 测试发生异常:', err);
      toast.error('测试发生异常');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-center text-gray-600">
          {t('Common.createShortlink.loginRequired')}
        </p>
        <Button 
          onClick={() => {
            LinkCreationStore.setLinkData({
              destination: '',
              customDomain: '',
              shortLink: '',
            });
            router.push(`/${locale}/signup?next=/${locale}/create`);
          }}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {t('Common.auth.signIn')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
            className="w-full h-8 bg-indigo-500 hover:bg-indigo-600 transition-all text-white flex items-center justify-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              console.log('🖱️ 点击提交按钮');
              debugFormState(); // 点击时显示调试信息
              if (!isLoading) {
                form.handleSubmit(onSubmit)(e);
              }
            }}
            disabled={isCreationLoading}
          >
            {isCreationLoading ? (
              <>
                <AiOutlineLoading3Quarters
                  className="block animate-spin"
                  aria-hidden="true"
                />
                <span>{tCommon('creating')}</span>
              </>
            ) : (
              t('createShortLink')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

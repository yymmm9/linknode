'use server';

import { env } from '@/env.mjs';
import { catchError, dub, generateNanoId } from '@/lib/utils';
import { 
  APIResponse, 
  CreateShortLinkInput, 
  normalizeShortLinkValue 
} from '@/types';
import { z } from 'zod';

// 定义输入验证模式
const ShortLinkInputSchema = z.object({
  url: z.string().url('请提供有效的目标链接'),
  domain: z.string().optional(),
  shortLink: z.string().optional(),
  projectSlug: z.string().optional(),
  n: z.string().optional(),
  ln: z.string().optional()
});

export default async function createShortLink(shortUrlInfo: CreateShortLinkInput) {
  // 日志记录输入信息
  console.group('🔗 创建短链接');
  console.log('📥 输入信息:', shortUrlInfo);

  try {
    // 输入验证
    const validationResult = ShortLinkInputSchema.safeParse(shortUrlInfo);
    if (!validationResult.success) {
      console.error('❌ 输入验证失败:', validationResult.error.errors);
      return {
        success: false,
        error: '输入验证失败：' + validationResult.error.errors.map(e => e.message).join(', '),
        data: null,
      };
    }

    // 生成必要参数
    const projectSlug = normalizeShortLinkValue(shortUrlInfo.projectSlug) ?? env.DUB_DOT_CO_SLUG;
    const shortLink = normalizeShortLinkValue(shortUrlInfo.shortLink) ?? generateNanoId();

    console.log('🔧 生成参数:', { projectSlug, shortLink });

    // 使用 Dub API 创建短链接
    const response = await dub.links.create({
      url: shortUrlInfo.url,
      key: shortLink,
      domain: normalizeShortLinkValue(shortUrlInfo.domain) ?? env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
      ...(shortUrlInfo.projectSlug && { projectSlug }),
    });

    console.log('✅ Dub API 响应:', response);

    // 返回 Dub API 响应
    console.groupEnd();
    return {
      success: true,
      error: null,
      data: response as unknown as APIResponse,
    };
  } catch (error) {
    // 详细的错误处理和日志记录
    console.error('❌ 创建短链接错误:', error);

    const errorMessage = error instanceof Error 
      ? error.message 
      : '创建短链接时发生未知错误';

    // 根据错误类型提供更具体的错误信息
    let detailedError = '创建短链接失败';
    if (errorMessage.includes('invalid_url')) {
      detailedError = '无效的目标链接';
    } else if (errorMessage.includes('rate_limit')) {
      detailedError = '创建链接频率超限，请稍后再试';
    } else if (errorMessage.includes('unauthorized')) {
      detailedError = '未授权的操作，请检查您的权限';
    }

    console.groupEnd();
    return {
      success: false,
      error: detailedError,
      data: null,
    };
  }
}

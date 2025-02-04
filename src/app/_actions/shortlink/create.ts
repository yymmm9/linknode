'use server';

import { env } from '@/env.mjs';
import { catchError, dub, generateNanoId } from '@/lib/utils';
import { 
  APIResponse, 
  CreateShortLinkInput, 
  normalizeShortLinkValue 
} from '@/types';

/**
 * 创建短链接
 * @param shortUrlInfo - 短链接创建所需的信息
 * @returns 包含创建结果的响应对象
 */
export default async function createShortLink(shortUrlInfo: CreateShortLinkInput) {
  try {
    // 验证必要参数
    if (!shortUrlInfo?.url) {
      return {
        success: false,
        error: '目标 URL 不能为空',
        data: null,
      };
    }

    // 规范化和生成必要参数
    const projectSlug = normalizeShortLinkValue(shortUrlInfo.projectSlug) ?? env.DUB_DOT_CO_SLUG;
    const shortLink = normalizeShortLinkValue(shortUrlInfo.shortLink) ?? generateNanoId();
    const domain = normalizeShortLinkValue(shortUrlInfo.domain) ?? env.NEXT_PUBLIC_BASE_SHORT_DOMAIN;

    // 构建 API 请求参数
    const createParams = {
      url: shortUrlInfo.url.trim(),
      key: shortLink,
      domain,
      ...(projectSlug && { projectSlug }),
    };

    console.log('🔍 创建短链接参数:', createParams);

    // 调用 Dub API 创建短链接
    const response = await dub.links.create(createParams);

    if (!response) {
      throw new Error('API 响应为空');
    }

    // 返回成功响应
    return {
      success: true,
      error: null,
      data: response as unknown as APIResponse,
      // data: {
      //   key: response.key,
      //   url: response.url,
      //   domain: response.domain,
      //   ...(response.projectSlug && { projectSlug: response.projectSlug }),
      // } as APIResponse,
    };

  } catch (error) {
    // 错误日志记录
    console.error('❌ 创建短链接失败:', error);
    catchError(error);

    // 返回用户友好的错误信息
    const errorMessage = error instanceof Error 
      ? error.message 
      : '创建短链接时发生未知错误';

    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}

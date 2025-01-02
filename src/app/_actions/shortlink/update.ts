'use server';

import { env } from '@/env.mjs';
import { catchError, dub } from '@/lib/utils';
import type { APIResponse } from '@/types';
import { createSupabaseBrowser } from '@/lib/supabase/client';

export default async function updateShortLink(shortUrlInfo: any) {
  try {
    // 严格检查必要参数
    if (!shortUrlInfo.id) {
      throw new Error('Link ID is required for updating');
    }

    if (!shortUrlInfo.url) {
      throw new Error('URL is required for updating');
    }

    console.log('[updateShortLink] Updating link with info:', shortUrlInfo);

    // // 准备更新 Supabase 的参数
    // const supabaseUpdateParams: Record<string, string> = {
    //   url: shortUrlInfo.url,
    // };

    // // 只有在提供了 key 时才添加 key
    // if (shortUrlInfo.key) {
    //   supabaseUpdateParams.key = shortUrlInfo.key;
    // }

    // 更新 Supabase
    // const supabase = createSupabaseBrowser();
    // const { error: supabaseError, data: supabaseData } = await supabase
    //   .from('links')
    //   .update(supabaseUpdateParams)
    //   .eq('id', shortUrlInfo.id)
    //   .select();

    // if (supabaseError) {
    //   console.error('[updateShortLink] Supabase update error:', supabaseError);
    //   throw new Error(`Supabase update failed: ${supabaseError.message}`);
    // }

    // console.log('[updateShortLink] Supabase update successful:', supabaseData);

    // 准备更新 Dub API 的参数
    const dubUpdateParams: Record<string, string> = {
      url: shortUrlInfo.url,
    };

    // // 只有在提供了 key 时才添加 key
    // if (shortUrlInfo.key) {
    //   dubUpdateParams.key = shortUrlInfo.key;
    // }

    // // 只有在提供了 domain 时才添加 domain
    // if (shortUrlInfo.domain) {
    //   dubUpdateParams.domain = shortUrlInfo.domain;
    // }
    if (shortUrlInfo.url) {
      dubUpdateParams.url = shortUrlInfo.url;
    }

    console.log('[updateShortLink] Dub update parameters:', dubUpdateParams);

    // 更新 Dub 短链接（如果有 key）
    let dubResponse;
    if (shortUrlInfo.key) {
      dubResponse = await dub.links.update(shortUrlInfo.id, dubUpdateParams);
      console.log('[updateShortLink] Dub API response:', dubResponse);
    }

    // 返回 API 响应
    return {
      success: true,
      error: null,
      // data: supabaseData[0] as unknown as APIResponse,
    };
  } catch (error) {
    console.error('[updateShortLink] Error:', error);

    // 处理错误
    const errorMessage = catchError(error);
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}

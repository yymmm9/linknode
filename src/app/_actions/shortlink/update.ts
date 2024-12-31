'use server';

import { env } from '@/env.mjs';
import { catchError, dub, generateNanoId } from '@/lib/utils';
import type { APIResponse, ShortLinkProps } from '@/types';

export default async function updateShortLink(shortUrlInfo: any) {
// export default async function updateShortLink(shortUrlInfo: ShortLinkProps) {
  try {
    if (!shortUrlInfo.id) {
      throw new Error('Link ID is required for updating');
    }

    // Update the short link using the Dub API
    const response = await dub.links.update(shortUrlInfo.id, {
      url: shortUrlInfo.url,
      key: shortUrlInfo.shortLink,
      domain: shortUrlInfo?.domain || env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
    });

    // Return the response from the Dub API
    return {
      success: true,
      error: null,
      data: response as unknown as APIResponse,
    };
  } catch (error) {
    // Handle any errors
    const errorMessage = catchError(error);
    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
}

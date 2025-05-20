// 临时类型声明文件，用于解决 @vercel/blob 的类型错误

declare module '@vercel/blob' {
  export interface PutOptions {
    access?: 'public' | 'private';
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
    contentType?: string;
    multipart?: boolean;
    token?: string;
  }

  export interface PutResult {
    url: string;
    pathname: string;
    contentType: string;
    contentLength: number;
  }

  export function put(
    pathname: string,
    body: Blob | ArrayBuffer | Uint8Array | string | ReadableStream | File,
    options?: PutOptions
  ): Promise<PutResult>;

  export function list(options?: {
    limit?: number;
    prefix?: string;
    token?: string;
  }): Promise<{
    blobs: Array<{
      url: string;
      pathname: string;
      contentType: string;
      contentLength: number;
      uploadedAt: Date;
    }>;
    cursor?: string;
  }>;

  export function del(
    url: string | string[],
    options?: { token?: string }
  ): Promise<{ deleted: boolean }>;

  export function head(
    url: string,
    options?: { token?: string }
  ): Promise<{
    url: string;
    pathname: string;
    contentType: string;
    contentLength: number;
    uploadedAt: Date;
  } | null>;
}

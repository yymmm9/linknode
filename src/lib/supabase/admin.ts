import { createClient } from '@supabase/supabase-js';

export default function supabaseAdmin() {
  // 详细的环境变量检查和错误处理
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ADMIN_KEY = process.env.SUPABASE_ADMIN || process.env.SUPABAE_ADMIN;

  console.log('🔍 Supabase 配置检查:');
  console.log(`运行环境: ${process.env.NODE_ENV}`);
  console.log(`URL 存在: ${!!SUPABASE_URL}`);
  console.log(`管理员密钥存在: ${!!SUPABASE_ADMIN_KEY}`);

  if (!SUPABASE_URL) {
    const errorMsg = '❌ 缺少 Supabase URL。请在 .env 文件中设置 NEXT_PUBLIC_SUPABASE_URL。';
    console.error(errorMsg);
    
    // 开发环境提供更友好的错误处理
    if (process.env.NODE_ENV === 'development') {
      console.warn('🚧 开发环境：使用默认配置');
      return createClient(
        'https://qibsajcpaoneobvadkhs.supabase.co', 
        'fallback-dev-key'
      );
    }

    throw new Error(errorMsg);
  }

  // 如果没有管理员密钥，在生产环境抛出错误，开发环境使用默认值
  if (!SUPABASE_ADMIN_KEY) {
    const errorMsg = `❌ 缺少 Supabase 管理员密钥。
    请检查以下环境变量:
    1. SUPABASE_ADMIN
    2. SUPABAE_ADMIN (注意拼写)
    确保在 .env 文件中正确设置管理员密钥。`;
    console.error(errorMsg);

    // 开发环境提供更友好的错误处理
    if (process.env.NODE_ENV === 'development') {
      console.warn('🚧 开发环境：使用默认管理员密钥');
      return createClient(
        SUPABASE_URL,
        'fallback-dev-admin-key',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
    }

    throw new Error(errorMsg);
  }

  try {
    return createClient(
      SUPABASE_URL,
      SUPABASE_ADMIN_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  } catch (error) {
    console.error('❌ 创建 Supabase 客户端时发生错误:', error);
    
    // 开发环境提供更友好的错误处理
    if (process.env.NODE_ENV === 'development') {
      console.warn('🚧 开发环境：使用默认配置');
      return createClient(
        SUPABASE_URL, 
        'fallback-dev-key'
      );
    }

    throw error;
  }
}

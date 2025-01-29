import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        // Supabase 配置
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        SUPABASE_ADMIN: z.string().optional(),

        // Dub.co 相关配置
        DUB_DOT_CO_TOKEN: z.string().optional(),
        DUB_DOT_CO_SLUG: z.string().optional(),

        // Resend 邮件服务配置
        RESEND_API_KEY: z.string().min(1, { message: "请提供 Resend API 密钥" }),
        RESEND_DOMAIN: z.string().min(1, { message: "请提供 Resend 域名" }),

        // 应用程序配置
        NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    },
    client: {
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: z.string().optional(),
    },
    runtimeEnv: {
        // Supabase 配置
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_ADMIN: process.env.SUPABASE_ADMIN,

        // 已有配置
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: process.env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
        DUB_DOT_CO_TOKEN: process.env.DUB_DOT_CO_TOKEN,
        DUB_DOT_CO_SLUG: process.env.DUB_DOT_CO_SLUG,

        // 新增 Resend 配置
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        RESEND_DOMAIN: process.env.RESEND_DOMAIN,

        // 应用程序配置
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    // 添加验证错误处理
    onValidationError: (error) => {
        console.error('❌ 环境变量验证失败:', error.message);
        console.error('环境变量详情:', error.issues);
        
        // 对于开发环境，我们可以提供更友好的错误处理
        if (process.env.NODE_ENV === 'development') {
            console.warn('🚧 开发环境：某些环境变量可能未设置，这可能会导致功能受限');
            console.warn('请检查 .env 文件并确保所有必需的环境变量已正确配置');
        } else {
            // 生产环境则抛出错误
            throw new Error(`环境变量验证失败: ${error.message}`);
        }
    },
});
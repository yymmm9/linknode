import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        // Dub.co 相关配置
        DUB_DOT_CO_TOKEN: z.string().optional(),
        DUB_DOT_CO_SLUG: z.string().optional(),

        // Resend 邮件服务配置
        RESEND_API_KEY: z.string().min(1, { message: "请提供 Resend API 密钥" }),
        RESEND_DOMAIN: z.string().min(1, { message: "请提供 Resend 域名" }),
    },
    client: {
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: z.string().optional(),
    },
    runtimeEnv: {
        // 已有配置
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: process.env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
        DUB_DOT_CO_TOKEN: process.env.DUB_DOT_CO_TOKEN,
        DUB_DOT_CO_SLUG: process.env.DUB_DOT_CO_SLUG,

        // 新增 Resend 配置
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        RESEND_DOMAIN: process.env.RESEND_DOMAIN,
    },
    // 添加验证错误处理
    onValidationError: (error) => {
        console.error('❌ 环境变量验证失败:', error);
        throw new Error(`环境变量验证失败: ${error.message}`);
    },
});
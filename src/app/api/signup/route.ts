import SupaAuthVerifyEmail from "@/emails";
import supabaseAdmin from "@/lib/supabase/admin";

import { Resend } from "resend";

// 防御性检查 Resend API 配置
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_DOMAIN = process.env.RESEND_DOMAIN;

if (!RESEND_API_KEY) {
  console.error('❌ 缺少 Resend API 密钥');
  throw new Error('未配置 Resend API 密钥。请在 .env 文件中设置 RESEND_API_KEY。');
}

if (!RESEND_DOMAIN) {
  console.error('❌ 缺少 Resend 域名');
  throw new Error('未配置 Resend 域名。请在 .env 文件中设置 RESEND_DOMAIN。');
}

// 使用安全的 API 密钥初始化 Resend
const resend = new Resend(RESEND_API_KEY);

export async function POST(request: Request) {
  // 防御性检查请求数据
  const data = await request.json();
  if (!data.email || !data.password) {
    return Response.json({ 
      error: '缺少必要的注册信息', 
      details: '邮箱和密码不能为空' 
    }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const res = await supabase.auth.admin.generateLink({
    type: "signup",
    email: data.email,
    password: data.password,
  });

  if (res.data.properties?.email_otp) {
    try {
      // 发送验证邮件，添加错误处理
      const resendRes = await resend.emails.send({
        from: `Acme <onboarding@${RESEND_DOMAIN}>`,
        to: [data.email],
        subject: "验证您的邮箱",
        react: SupaAuthVerifyEmail({
          verificationCode: res.data.properties?.email_otp || '',
        }),
      });

      return Response.json(resendRes);
    } catch (emailError) {
      console.error('发送验证邮件失败:', emailError);
      return Response.json({ 
        error: '发送验证邮件时出错', 
        details: emailError instanceof Error ? emailError.message : '未知错误' 
      }, { status: 500 });
    }
  } else {
    return Response.json({ 
      data: null, 
      error: res.error || '生成验证链接失败' 
    }, { status: 400 });
  }
}

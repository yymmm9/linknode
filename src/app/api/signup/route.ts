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
  try {
    // 防御性检查请求数据
    const data = await request.json().catch(() => ({}));
    
    if (!data.email || !data.password) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: '缺少必要的注册信息',
            details: '邮箱和密码不能为空'
          }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = supabaseAdmin();
    if (!supabase) {
      throw new Error('Supabase 客户端初始化失败');
    }

    const res = await supabase.auth.admin.generateLink({
      type: "signup",
      email: data.email,
      password: data.password,
    });

    if (res.error) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: '生成验证链接失败',
            details: res.error.message
          }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const emailOtp = res.data.properties?.email_otp;
    if (!emailOtp) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: '生成验证码失败',
            details: '未能获取验证码'
          }
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      // 发送验证邮件
      const resendRes = await resend.emails.send({
        from: `hov.sh <onboarding@${RESEND_DOMAIN}>`,
        to: [data.email],
        subject: "验证您的邮箱",
        react: SupaAuthVerifyEmail({
          verificationCode: emailOtp,
        }),
      });

      return new Response(
        JSON.stringify({ data: resendRes }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (emailError) {
      console.error('发送验证邮件失败:', emailError);
      return new Response(
        JSON.stringify({ 
          error: { 
            message: '发送验证邮件失败',
            details: emailError instanceof Error ? emailError.message : '未知错误'
          }
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('注册过程发生错误:', error);
    return new Response(
      JSON.stringify({ 
        error: { 
          message: '注册过程发生错误',
          details: error instanceof Error ? error.message : '未知错误'
        }
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

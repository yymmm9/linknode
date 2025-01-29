import { Logo } from "@/components/brand";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

// 定义邮件模板的属性接口
interface SupaAuthVerifyEmailProps {
  verificationCode?: string;
  logoUrl?: string;
  brandName?: string;
}

// 品牌配色和样式常量
const BRAND_COLORS = {
  primary: '#6D28D9', // 紫色，与项目主题一致
  background: '#F5F3FF', // 浅紫色背景
  text: '#1F2937', // 深灰色文字
  accent: '#8B5CF6', // 较亮的紫色
};

// 定义样式类型
type StyleObject = React.CSSProperties;

export default function SupaAuthVerifyEmail({
  verificationCode = "000000", // 提供默认值，防止 null
  logoUrl = "/logo.svg", // 提供默认 Logo
  brandName = "hov.sh", // 提供默认品牌名
}: SupaAuthVerifyEmailProps) {
  return (
    <Html lang="zh-CN">
      <Head />
      <Preview>{ brandName } 邮箱验证</Preview>
      <Body style={mainStyles}>
        <Container style={containerStyles}>
          {/* 品牌 Logo 部分 */}
          <Section style={logoSectionStyles}>
            <Logo className="h-5"/>
            {/* <Img 
              src={logoUrl} 
              alt={`${brandName} Logo`} 
              width="120" 
              height="40" 
              style={logoStyles} 
            /> */}
          </Section>

          {/* 主要内容区域 */}
          <Section style={contentSectionStyles}>
            <Heading style={headingStyles}>
              验证您的邮箱地址
            </Heading>

            <Text style={paragraphStyles}>
              感谢您注册 { brandName }。为了确保账户安全，请使用以下验证码完成注册：
            </Text>

            {/* 验证码区域 */}
            <Section style={verificationCodeSectionStyles}>
              <Text style={verificationCodeTextStyles}>
                { verificationCode }
              </Text>
              <Text style={verificationCodeHintStyles}>
                验证码将在 1 小时后过期
              </Text>
            </Section>

            <Text style={paragraphStyles}>
              如果您没有发起此注册，请忽略此邮件。
            </Text>


            {/* 支持链接 */}
            {/* <Section style={supportSectionStyles}>
              <Link 
                href="https://linknode.vercel.app/support" 
                style={linkStyles}
              >
                需要帮助？联系我们
              </Link>
            </Section> */}
          </Section>

          {/* 页脚 */}
          <Section style={footerStyles}>
            <Text style={footerTextStyles}>
              { new Date().getFullYear() } { brandName }. 保留所有权利。
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// 样式定义
const mainStyles: StyleObject = {
  backgroundColor: BRAND_COLORS.background,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const containerStyles: StyleObject = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const logoSectionStyles: StyleObject = {
  textAlign: 'center',
  marginBottom: '20px',
};

const logoStyles: StyleObject = {
  maxWidth: '150px',
  height: 'auto',
};

const contentSectionStyles: StyleObject = {
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
};

const headingStyles: StyleObject = {
  color: BRAND_COLORS.primary,
  fontSize: '24px',
  marginBottom: '20px',
  textAlign: 'center',
};

const paragraphStyles: StyleObject = {
  color: BRAND_COLORS.text,
  lineHeight: '1.5',
  marginBottom: '20px',
};

const verificationCodeSectionStyles: StyleObject = {
  backgroundColor: BRAND_COLORS.background,
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '20px',
};

const verificationCodeTextStyles: StyleObject = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: BRAND_COLORS.primary,
  letterSpacing: '8px',
  margin: '10px 0',
};

const verificationCodeHintStyles: StyleObject = {
  color: BRAND_COLORS.text,
  fontSize: '14px',
  opacity: 0.7,
};

const supportSectionStyles: StyleObject = {
  textAlign: 'center',
  marginTop: '20px',
};

const linkStyles: StyleObject = {
  color: BRAND_COLORS.accent,
  textDecoration: 'none',
};

const footerStyles: StyleObject = {
  marginTop: '20px',
  textAlign: 'center',
  borderTop: `1px solid ${BRAND_COLORS.background}`,
  paddingTop: '10px',
};

const footerTextStyles: StyleObject = {
  color: BRAND_COLORS.text,
  fontSize: '12px',
  opacity: 0.6,
};

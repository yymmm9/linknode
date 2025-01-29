import "./src/env.mjs";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 设置元数据基础 URL，用于解析社交图片和 Open Graph 元数据
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://linknode.vercel.app'
  ),
  
  // 可选：添加其他配置
  images: {
    domains: ['updates.hov.sh'], // 根据需要添加允许的图片域名
  },
};

export default withNextIntl(nextConfig);
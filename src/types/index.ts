import { TdesignLogoWechatStroke } from "@/components/icon/wechat";
import { z } from 'zod';

// 定义 names 对象，字段值为描述字符串
export const names = {
  i: 'Profile Image', // 个人资料图片
  n: 'First Name', // 名

  ln: 'Last Name', // 姓

  d: 'Description', // 简介或描述
  f: 'Facebook', // Facebook 个人主页链接
  t: 'Twitter', // Twitter 个人主页链接
  ig: 'Instagram', // Instagram 个人主页链接
  tg: 'Telegram', // Telegram 联系方式
  gh: 'GitHub', // GitHub 个人主页链接
  l: 'LinkedIn', // LinkedIn 个人主页链接
  e: 'Email', // 电子邮件
  w: 'WhatsApp', // WhatsApp 联系方式
  y: 'YouTube', // YouTube 频道链接
  bg: 'Background Color', // 背景颜色,

  em: 'Email',
  p: 'Phone',

  wc: {
    name: 'Wechat',
    icon: TdesignLogoWechatStroke,
  },
  web: 'Website',

  r: 'Role',
  ti: 'Title',
  o: 'Organization',

  b: 'Birthday',
};

// 使用 typeof names 来生成 DataProps，ls 需要手动添加
export type DataProps = {
  [K in keyof typeof names]?: string; // 默认类型为 string
} & {
  ls: ExtraLinkProps[]; // 手动添加 ls 字段
  firstName?: string; 
  lastName?: string; 
  organization?: string; 
  title?: string; 
  role?: string;
  email?: string;
  workPhone?: string;
  website?: string;
  url?: string; // 添加 url 字段
};

export interface ExtraLinkProps {
  id: number;
  i: string;
  l: string;
  u: string;
}

export interface DisplayDataProps {
  acc: DataProps;
}

const socialLinksData = {
  f: 'facebook',
  t: 'twitter',
  ig: 'instagram',
  gh: 'github',
  tg: 'telegram',
  l: 'linkedin',
  e: 'email',
  w: 'whatsapp',
  y: 'youtube',
  wc: 'wechat'
};

export interface SocialLinkProviderProps {
  name: string;
  icon: string | React.ElementType;
  id: keyof typeof socialLinksData;
  placeholder: string;
}

export interface ShortLinkProps {
  url: string;
  id?: string | number;
  shortLink?: string;
  password?: string;
  authorization?: string;
  projectSlug?: string | boolean;
  domain?: string;
  rewrite?: boolean;
  [key: string]: string | boolean | number | undefined;
}

export type CreateShortLinkInput = Required<Pick<ShortLinkProps, 'url'>> & Omit<ShortLinkProps, 'url'>;

export const shortlinkSchema = z.object({
  url: z.string().url(),
  id: z.union([z.string(), z.number()]).optional(),
  shortLink: z.string().optional(),
  password: z.string().optional(),
  authorization: z.string().optional(),
  projectSlug: z.union([z.string(), z.boolean()]).optional(),
  domain: z.string().optional(),
  rewrite: z.boolean().optional(),
});

export type ShortLinkSchema = z.infer<typeof shortlinkSchema>;

export function isValidShortLinkKey(key: unknown): key is keyof ShortLinkProps {
  const validKeys: (keyof ShortLinkProps)[] = [
    'url', 'id', 'shortLink', 
    'password', 'authorization', 
    'projectSlug', 'domain', 'rewrite'
  ];
  return typeof key === 'string' && validKeys.includes(key as keyof ShortLinkProps);
}

export function normalizeShortLinkValue(value: string | boolean | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  return value;
}

export interface APIResponse {
  id: string;
  domain: string;
  key: string;
  url: string;
  archived: boolean;
  expiresAt: string;
  password: string;
  proxy: boolean;
  title: string;
  description: string;
  image: string;
  rewrite: boolean;
  ios: string;
  android: string;
  geo: Record<string, unknown>;
  publicStats: boolean;
  tagId: string;
  comments: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  userId: string;
  projectId: string;
  clicks: number;
  lastClicked: string;
  createdAt: string;
  updatedAt: string;
}

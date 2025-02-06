import { customAlphabet } from 'nanoid/non-secure';
import { encode, decode } from 'js-base64';import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


import type { DataProps, ShortLinkProps, ExtraLinkProps } from '@/types';
// import { createClient } from '@supabase/supabase-js';

import { Dub } from 'dub';

export const dub = new Dub({
  token: process.env.DUB_DOT_CO_TOKEN ?? '',
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 数据清理和验证函数
const sanitizeDataField = (value: string | undefined): string => {
  if (!value) return '';
  
  // 规范化 Unicode 字符
  let sanitized = value
    .normalize('NFC')  // 规范化 Unicode 字符
    .trim()  // 移除首尾空白
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')  // 移除控制字符
    .replace(/\s+/g, ' ');  // 标准化空白字符

  // 限制字段长度（防止过长数据）
  const MAX_FIELD_LENGTH = 500;
  return sanitized.length > MAX_FIELD_LENGTH 
    ? sanitized.substring(0, MAX_FIELD_LENGTH) 
    : sanitized;
};

// URL 清理函数
const sanitizeURL = (url: string | undefined): string => {
  if (!url) return '';

  try {
    // 尝试解析 URL 并重新构建
    const parsedURL = new URL(url.trim());
    return parsedURL.toString();
  } catch {
    // 如果 URL 无效，返回空字符串
    console.warn(`无效的 URL: ${url}`);
    return '';
  }
};

// 电话号码验证和清理
const sanitizePhoneNumber = (phone: string | undefined): string => {
  if (!phone) return '';

  // 移除所有非数字字符
  const cleanedPhone = phone.replace(/[^\d+]/g, '');
  
  // 验证电话号码格式（支持国际格式）
  const phoneRegex = /^\+?[0-9]{10,14}$/;
  return phoneRegex.test(cleanedPhone) ? cleanedPhone : '';
};

// 过滤空值属性的辅助函数
const filterEmptyValues = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== null && value !== undefined && value !== '';
      })
  );
};

export const encodeData = (obj: DataProps): string => {
  // 深拷贝并清理数据
  const cleanedData = filterEmptyValues({
    n: sanitizeDataField(obj.n),     // 名字
    ln: sanitizeDataField(obj.ln),   // 姓氏
    p: sanitizePhoneNumber(obj.p),   // 电话
    d: sanitizeDataField(obj.d),     // 描述
    i: sanitizeDataField(obj.i),     // 其他标识
    f: sanitizeDataField(obj.f),     // 可能的附加字段
    t: sanitizeDataField(obj.t),     // 标题
    ig: sanitizeDataField(obj.ig),   // Instagram
    tg: sanitizeDataField(obj.tg),   // Telegram
    gh: sanitizeDataField(obj.gh),   // GitHub
    l: sanitizeDataField(obj.l),     // 位置
    e: sanitizeDataField(obj.e),     // 邮箱
    w: sanitizeDataField(obj.w),     // 网站
    y: sanitizeDataField(obj.y),     // YouTube
    bg: sanitizeDataField(obj.bg),   // 背景信息
    wc: sanitizeDataField(obj.wc),   // 微信
    r: sanitizeDataField(obj.r),     // 备注
    o: sanitizeDataField(obj.o),     // 其他信息
    em: sanitizeDataField(obj.em),   // 邮箱
    addr: sanitizeDataField(obj.addr), // 地址
    ls: obj.ls ? obj.ls.map(link => filterEmptyValues({
      id: link.id,
      i: sanitizeDataField(link.i),
      l: sanitizeDataField(link.l),
      u: sanitizeURL(link.u)
    })).filter(link => link.u || link.l) : []
  });

  // 最终验证：确保至少有一个关键字段非空
  const requiredFields: (keyof DataProps)[] = ['n', 'ln', 'p', 'd'];
  const hasValidData = requiredFields.some(field => 
    cleanedData[field] && 
    (typeof cleanedData[field] === 'string' 
      ? (cleanedData[field] as string).trim() !== '' 
      : true)
  );

  if (!hasValidData) {
    console.warn('编码失败：没有有效的数据');
    return '';
  }

  return encode(JSON.stringify(cleanedData));
};

export const decodeData = (base64: string): DataProps | null => {
  // 防御性检查：确保输入非空
  if (!base64) {
    console.warn('解码失败：输入的 base64 字符串为空');
    return null;
  }

  try {
    // 安全解码
    const decodedString = decode(base64);
    console.log('解码后的原始字符串:', decodedString);
    console.log('解码后的原始字符串长度:', decodedString.length);

    // 解析并过滤空值
    const parsedData = JSON.parse(decodedString);
    const filteredData = filterEmptyValues(parsedData);

    // 返回过滤后的数据
    return filteredData as DataProps;
  } catch (error) {
    // 捕获并记录任何未预料的错误
    console.error('解码数据时发生未知错误:', {
      errorMessage: error instanceof Error ? error.message : '未知错误',
      base64Input: base64,
      inputLength: base64.length
    });

    return null;
  }
};

export function catchError(err: unknown) {
  if (err instanceof Error) {
    return err.message;
  } else {
    return 'Something went wrong, please try again later.';
  }
}

export function generateNanoId() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 10);
  return nanoid(7);
}

export function isEmptyValues(obj: DataProps): boolean {
  if (!obj) {
    return true;
  }

  // 检查是否有任何非空的属性
  const relevantKeys: (keyof DataProps)[] = ['ls', 'firstName', 'lastName', 'url'];
  
  for (const key of relevantKeys) {
    const value = obj[key];
    
    // 检查数组是否非空
    if (Array.isArray(value) && value.length > 0) {
      return false;
    }
    
    // 检查字符串是否非空
    if (typeof value === 'string' && value.trim() !== '') {
      return false;
    }
  }

  return true;
}

export function checkCustomCredentials(shortUrlInfo: ShortLinkProps) {
  const { authorization, projectSlug, domain } = shortUrlInfo;
  return Boolean(!authorization && !projectSlug && !domain);
}

export function checkValidCustomCredentials(shortUrlInfo: ShortLinkProps) {
  const { authorization, projectSlug, domain } = shortUrlInfo;

  if (authorization && projectSlug && domain) {
    return true;
  }

  if (!authorization && !projectSlug && !domain) {
    return true;
  }

  return false;
}

/**
 * 安全地解码 Base64 编码的 JSON 字符串
 * @param base64Str Base64 编码的 JSON 字符串
 * @param defaultValue 解码失败时返回的默认值
 * @returns 解码后的对象或默认值
 */
export function safeBase64JsonDecode<T>(
  base64Str: string, 
  defaultValue: T
): T {
  try {
    // 先尝试 Base64 解码
    const jsonStr = atob(base64Str);
    
    // 移除非法字符
    const cleanJsonStr = jsonStr.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    
    // 解析 JSON
    return JSON.parse(cleanJsonStr) as T;
  } catch (error) {
    console.error('JSON 解码错误:', error);
    return defaultValue;
  }
}

/**
 * 安全地解析 JSON 字符串
 * @param jsonStr JSON 字符串
 * @param defaultValue 解析失败时返回的默认值
 * @returns 解析后的对象或默认值
 */
export function safeJsonParse<T>(
  jsonStr: string, 
  defaultValue: T
): T {
  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('JSON 解析错误:', error);
    return defaultValue;
  }
}

/**
 * 根据当前语言环境生成全名
 * @param firstName 名字
 * @param lastName 姓氏
 * @param locale 语言环境，默认为 'en'
 * @returns 格式化后的全名
 */
export function getFullName(
  firstName?: string, 
  lastName?: string, 
  locale: string = 'en'
): string {
  // 处理可能为 undefined 的情况
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';

  // 如果两个名字都为空，返回默认值
  if (!first && !last) return '用户';

  // 根据语言环境格式化名字
  return locale === 'zh' 
    ? `${last}${first}` 
    : `${first} ${last}`.trim();
}
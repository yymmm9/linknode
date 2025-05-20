import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

// 使用环境变量中的 token
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '没有提供文件' },
        { status: 400 }
      );
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只允许上传图片文件' },
        { status: 400 }
      );
    }
    
    // 检查文件大小（限制为 100KB）
    if (file.size > 100 * 1024) {
      return NextResponse.json(
        { error: '文件大小超过 100KB 限制' },
        { status: 400 }
      );
    }
    
    // 生成唯一文件名
    const uniqueId = nanoid();
    const fileName = `${uniqueId}-${file.name}`;
    
    // 上传到 Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false,
      token: BLOB_TOKEN, // 使用环境变量中的 token
    });
    
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('上传错误:', error);
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    );
  }
}

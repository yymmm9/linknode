'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';
import { useData } from '@/lib/context/link-context';
import { Upload, X } from 'lucide-react';

// 图片压缩函数
async function compressImage(file: File, maxSizeKB: number = 100): Promise<File> {
  // 如果文件已经小于限制，直接返回
  if (file.size / 1024 <= maxSizeKB) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      const url = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('Could not get canvas context');
          resolve(file);
          return;
        }
        
        // 计算新尺寸，保持宽高比
        let width = img.width;
        let height = img.height;
        
        // 限制最大尺寸
        const MAX_DIMENSION = 1024;
        
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round(height * (MAX_DIMENSION / width));
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round(width * (MAX_DIMENSION / height));
            height = MAX_DIMENSION;
          }
        }
        
        // 设置画布大小
        canvas.width = width;
        canvas.height = height;
        
        // 初始绘制
        ctx.drawImage(img, 0, 0, width, height);
        
        // 初始质量
        let quality = 0.9;
        let iteration = 0;
        
        // 检查大小并可能需要调整
        const checkAndReduceSize = () => {
          try {
            // 获取当前质量的 data URL
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // 提取 base64 部分
            const base64Data = dataUrl.split(',')[1];
            if (!base64Data) {
              throw new Error('Invalid data URL format');
            }
            
            // 计算当前大小 (KB) - 使用更准确的大小计算
            const sizeInKB = (base64Data.length * 0.75) / 1024;
            
            if (sizeInKB <= maxSizeKB || quality <= 0.1) {
              // 大小符合要求或达到最小质量
              const finalFile = dataURLtoFile(dataUrl, file.name);
              resolve(finalFile);
            } else {
              // 继续减小质量
              iteration++;
              quality = Math.max(0.1, quality - 0.1);
              
              // 使用 requestAnimationFrame 避免阻塞主线程
              requestAnimationFrame(checkAndReduceSize);
            }
          } catch (error) {
            console.error('Error during image compression:', error);
            resolve(file); // 出错时返回原始文件
          }
        };
        
        // 开始检查大小
        checkAndReduceSize();
      };
      
      img.onerror = () => {
        console.error('Error loading image');
        resolve(file);
      };
      
      // 设置图片源
      img.src = url;
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(file);
    };
    
    // 读取文件
    reader.readAsDataURL(file);
  });
}

// 将 dataURL 转换为 File 对象
function dataURLtoFile(dataURL: string, filename: string): File {
  // 确保 dataURL 格式正确
  const arr = dataURL.split(',');
  const base64Data = arr[1];
  
  if (!base64Data) {
    throw new Error('Invalid dataURL format: missing base64 data');
  }

  // 提取 MIME 类型，默认为 image/jpeg
  const mimeType = (() => {
    const match = dataURL.match(/^data:(.*?)(;base64)?,/);
    return match && match[1] ? match[1] : 'image/jpeg';
  })();
  
  try {
    // 在浏览器环境中使用 atob 进行 base64 解码
    const binaryString = atob(base64Data);
    
    // 创建 Uint8Array 来存储二进制数据
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 创建并返回 File 对象
    return new File([bytes], filename, { type: mimeType });
  } catch (error) {
    console.error('Error converting dataURL to File:', error);
    throw new Error('Failed to convert dataURL to File');
  }
}

// 上传图片到 Vercel Blob
async function uploadToBlob(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json() as { url: string };
    if (!data.url) {
      throw new Error('Invalid response: missing URL');
    }
    
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export function AvatarUpload() {
  const t = useTranslations('ProfileForm');
  const { data, updateProfileInfo } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setError(null);
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        setError(t('InvalidImageType') || '请上传有效的图片文件');
        return;
      }
      
      // 压缩图片
      const compressedFile = await compressImage(file, 100); // 限制为 100KB
      
      // 上传到 Vercel Blob
      const imageUrl = await uploadToBlob(compressedFile);
      
      // 更新数据
      updateProfileInfo('i', imageUrl);
    } catch (err) {
      console.error('上传错误:', err);
      setError(t('UploadError') || '上传失败，请重试');
    } finally {
      setIsUploading(false);
      // 重置文件输入，以便可以再次上传相同的文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [t, updateProfileInfo]);
  
  const handleRemoveAvatar = useCallback(() => {
    updateProfileInfo('i', '');
  }, [updateProfileInfo]);
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          {data.i ? (
            <AvatarImage src={data.i} alt={`${data.n || ''} ${data.ln || ''}`} />
          ) : (
            <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">
              {data.n ? data.n[0] : ''}{data.ln ? data.ln[0] : ''}
            </AvatarFallback>
          )}
        </Avatar>
        
        {data.i && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveAvatar}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? (t('Uploading') || '上传中...') : (t('UploadAvatar') || '上传头像')}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />
        
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <p className="text-xs text-gray-500 mt-1">{t('AvatarSizeLimit') || '图片大小限制为 100KB'}</p>
      </div>
    </div>
  );
}

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

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('无法创建 canvas 上下文'));
          return;
        }
        
        // 计算压缩后的尺寸
        let width = img.width;
        let height = img.height;
        
        // 限制最大尺寸
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);
        
        // 压缩图片
        let quality = 0.7; // 起始质量
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let iteration = 0;
        
        // 递归函数来调整质量直到文件大小合适
        const reduceSize = () => {
          // 防止无限循环
          if (iteration > 10) {
            const finalFile = dataURLtoFile(dataUrl, file.name);
            resolve(finalFile);
            return;
          }
          
          // 计算当前大小
          const parts = dataUrl.split(',');
          if (parts.length > 1) {
            const binaryString = atob(parts[1]);
            const currentSize = binaryString.length / 1024;
          
          if (currentSize <= maxSizeKB) {
            // 大小符合要求
            const finalFile = dataURLtoFile(dataUrl, file.name);
            resolve(finalFile);
          } else {
            // 继续减小
            iteration++;
            quality = Math.max(0.1, quality - 0.1);
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            reduceSize();
          }
          } else {
            // 如果无法获取数据部分，使用原始文件
            resolve(file);
          }
        };
        
        reduceSize();
      };
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
  });
}

// 将 dataURL 转换为 File 对象
function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

// 上传图片到 Vercel Blob
async function uploadToBlob(file: File): Promise<string> {
  try {
    // 创建一个 FormData 对象
    const formData = new FormData();
    formData.append('file', file);
    
    // 发送请求到 API 路由
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('上传失败');
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('上传错误:', error);
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

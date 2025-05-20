"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import VCard from "vcard-creator";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { DataProps } from "@/types";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const SaveVcf = ({
  acc,
  variant = "default",
  cta,
  autoDownload = false,
}: {
  acc?: Partial<DataProps>;
  variant?: "icon" | "default";
  cta?: string;
  autoDownload?: boolean;
}) => {
  const searchParams = useSearchParams();
  const t = useTranslations("ProfileForm");

  // 将所有逻辑放在 if 条件之前
  const createVCard = async (accData: Partial<DataProps>) => {
    const firstName = accData.n || accData.firstName || '';
    const lastName = accData.ln || accData.lastName || '';
    const organization = accData.o || accData.organization || '';
    const title = accData.ti || accData.title || '';
    const role = accData.r || accData.role || '';
    const email = accData.e || accData.email || '';
    const workPhone = accData.p || accData.workPhone || '';
    const website = accData.web || accData.website || '';
    const description = accData.d || '';
    const address = accData.addr || '';
    const avatarUrl = accData.i || '';
    
    const myVCard = new VCard();

    myVCard
      .addName(lastName, firstName)
      .addCompany(organization)
      .addJobtitle(title)
      .addRole(role)
      .addEmail(email)
      .addPhoneNumber(workPhone, "PREF;WORK")
      .addURL(website)
      .addNote(description)
      .addAddress(address);
    
    // 如果有头像URL，添加到vCard中
    if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim() !== '') {
      try {
        // 获取图片的base64内容
        const response = await fetch(avatarUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch avatar: ${response.status} ${response.statusText}`);
        }
        
        // 获取图片的blob
        const blob = await response.blob();
        
        // 获取MIME类型并转换为vCard兼容的格式
        let mimeType = 'JPEG'; // 默认使用JPEG
        const type = blob.type.toLowerCase();
        
        if (type.includes('jpeg') || type.includes('jpg')) {
          mimeType = 'JPEG';
        } else if (type.includes('png')) {
          mimeType = 'PNG';
        } else if (type.includes('gif')) {
          mimeType = 'GIF';
        }
        
        // 将blob转换为ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer();
        
        // 将ArrayBuffer转换为base64字符串
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        const byteLength = bytes.length; // 使用length属性而不是byteLength
        for (let i = 0; i < byteLength; i++) {
          binary += String.fromCharCode(bytes[i] ?? 0);
        }
        const base64Content = btoa(binary);
        
        console.log('Adding photo to vCard with type:', mimeType);
        
        // 直接构建vCard字符串来添加照片
        // 因为vcard-creator对某些MIME类型支持不好
        const vcardString = myVCard.toString();
        const lines = vcardString.split('\n');
        
        // 在END:VCARD前插入照片
        const endIndex = lines.findIndex(line => line.trim() === 'END:VCARD');
        if (endIndex >= 0) {
          // 添加照片属性
          // 将照片数据分成多行，每行最多75个字符（vCard规范要求）
          const chunkSize = 75;
          const chunks: string[] = [];
          
          for (let i = 0; i < base64Content.length; i += chunkSize) {
            chunks.push(base64Content.substring(i, Math.min(i + chunkSize, base64Content.length)));
          }
          
          // 创建新的vCard内容
          const newLines = [...lines];
          
          // 添加照片属性
          newLines.splice(endIndex, 0, `PHOTO;ENCODING=b;TYPE=${mimeType}:${chunks[0]}`);
          
          // 添加剩余的行（如果有）
          for (let i = 1; i < chunks.length; i++) {
            newLines.splice(endIndex + i, 0, ` ${chunks[i]}`);
          }
          
          // 创建新的vCard实例
          const newVCard = new VCard();
          
          // 添加所有行到新的vCard
          newLines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('BEGIN:VCARD') || 
                trimmedLine.startsWith('END:VCARD') || 
                trimmedLine === '') {
              return;
            }
            
            const parts = trimmedLine.split(':');
            if (parts.length < 2) return;
            
            const key = parts[0] as string;
            const value = parts.slice(1).join(':');
            
            try {
              if (key.startsWith('FN')) {
                newVCard.addName('', value);
              } else if (key.startsWith('TEL')) {
                newVCard.addPhoneNumber(value, 'WORK');
              } else if (key.startsWith('EMAIL')) {
                newVCard.addEmail(value);
              } else if (key.startsWith('ORG')) {
                newVCard.addCompany(value);
              } else if (key.startsWith('TITLE')) {
                newVCard.addJobtitle(value);
              } else if (key.startsWith('PHOTO')) {
                // 已经处理过照片
              }
            } catch (error) {
              console.warn(`Failed to process vCard property: ${key}`, error);
            }
          });
          
          // 复制所有属性到原始vCard
          Object.keys(newVCard).forEach(key => {
            if (key in myVCard) {
              (myVCard as any)[key] = (newVCard as any)[key];
            }
          });
          
          console.log('Successfully added photo to vCard');
        }
      } catch (error) {
        console.error('添加头像到vCard时出错:', error);
        // 出错时继续，不添加头像
      }
    }

    return myVCard.toString();
  };

  const downloadVCard = async () => {
    if (!acc) return;
    
    const firstName = acc.n || acc.firstName || '';
    const lastName = acc.ln || acc.lastName || '';
    
    try {
      const vCardString = await createVCard(acc);
      const blob = new Blob([vCardString], { type: "text/vcard" });
      const link = document.createElement("a");
      
      link.href = URL.createObjectURL(blob);
      link.download = `${firstName}_${lastName}.vcf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载vCard时出错:', error);
    }
  };

  // 检查URL参数是否有自动下载标志 - 确保 Hook 不在条件语句之后
  useEffect(() => {
    if (!acc) return;
    
    const autoAdd = searchParams?.get('a');
    if (autoAdd === 'true' || autoDownload) {
      // 延迟一点执行，确保组件已完全加载
      const timer = setTimeout(async () => {
        await downloadVCard();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, acc, autoDownload]);
  
  if (!acc) return null;
  
  const buttonStyles = cn(
    variant === "default" ? "gap-2 w-full" : "absolute bottom-0 right-0 z-10 size-8 p-1 rounded-full h-fit"
  );

  return (
    <Button
      variant={variant === "default" ? "secondary" : "default"}
      onClick={downloadVCard}
      className={cn(buttonStyles, "")}
    >
      {variant === "icon" || !cta ? <PlusIcon className="size-6" /> : null}
      {variant === "default" && cta ? (
        <>
          <PlusIcon className="size-4" /> {cta}
        </>
      ) : null}
    </Button>
  );
};
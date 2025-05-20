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
    if (avatarUrl) {
      try {
        // 获取头像图片
        const response = await fetch(avatarUrl);
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          
          // 使用Promise包装FileReader
          const getBase64 = (): Promise<string> => {
            return new Promise((resolve) => {
              reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                  const base64data = reader.result;
                  // 提取base64部分（去掉前缀）
                  const parts = base64data.split(',');
                  if (parts.length > 1) {
                    resolve(parts[1]);
                  } else {
                    resolve('');
                  }
                } else {
                  resolve('');
                }
              };
              reader.readAsDataURL(blob);
            });
          };
          
          // 获取base64内容
          const base64Content = await getBase64();
          
          // 使用vCard 4.0格式添加照片
          // 添加照片到vCard字符串
          const vCardString = myVCard.toString();
          const lines = vCardString.split('\n');
          
          // 添加多行属性，每行75个字符
          const photoLines = [];
          photoLines.push('PHOTO;ENCODING=b;TYPE=JPEG:');
          
          // 将base64内容按每行75个字符分割
          for (let i = 0; i < base64Content.length; i += 75) {
            photoLines.push(' ' + base64Content.substring(i, i + 75));
          }
          
          // 在END行前插入照片属性
          lines.splice(lines.length - 1, 0, ...photoLines);
          return lines.join('\n');
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
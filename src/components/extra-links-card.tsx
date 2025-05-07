import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface ExtraLinksCardProps {
  label: string;
  url: string;
  icon?: string;
  autoAddContact?: boolean; // 自动添加为联系人选项
}

export default function ExtraLinksCard({
  label,
  url,
  icon,
  autoAddContact,
}: ExtraLinksCardProps) {
  // 处理自动添加为联系人功能
  useEffect(() => {
    // 如果设置了自动添加为联系人，并且URL是tel:开头的电话链接
    if (autoAddContact && url.startsWith('tel:')) {
      const phoneNumber = url.replace('tel:', '');
      // 尝试调用原生API添加联系人
      try {
        // 检查是否支持联系人API
        if ('contacts' in navigator && 'ContactsManager' in window) {
          // @ts-ignore - 联系人API可能不被TypeScript识别
          const props = ['name', 'tel'];
          // @ts-ignore
          navigator.contacts.select(props, { multiple: false })
            .then((contacts: any) => {
              console.log('已选择联系人:', contacts);
            })
            .catch((error: any) => {
              console.error('选择联系人时出错:', error);
            });
        } else {
          console.log('此浏览器不支持联系人API');
          // 回退方案：创建vCard格式的联系人数据
          const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${label}
TEL:${phoneNumber}
END:VCARD`;
          const blob = new Blob([vcard], { type: 'text/vcard' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${label}.vcf`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('添加联系人时出错:', error);
      }
    }
  }, [autoAddContact, url, label]);

  return (
    <li className="group relative flex items-center justify-between w-full border shadow rounded-full hover:scale-105 transition-all ease-in-out duration-300 dark:bg-black/90 bg-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 max-w-lg cursor-pointer">
      {label && url && (
        <Link href={url} className="flex items-center w-full p-2 rounded-full">
          <dt className="flex w-full items-center relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center size-6">
              {icon ? (
                <Icon icon={icon} className="size-5" />
              ) : (
                <Icon icon="ph:link-simple" className="size-5" />
              )}
            </div>
            <p className="flex justify-center font-medium font-monoo w-full dark:text-neutral-100 text-neutral-800">
              {label}
              {autoAddContact && (
                <span className="ml-1 text-xs text-blue-500">
                  (自动添加为联系人)
                </span>
              )}
            </p>
          </dt>
        </Link>
      )}
      {/* <div className="absolute group-hover:flex right-3 top-1/2 -translate-y-1/2 items-center md:hidden md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
          <CopyToClipboard url={url} />
        </div> */}
    </li>
  );
}

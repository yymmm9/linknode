import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import VCard from 'vcard-creator';

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
      
      try {
        // 使用 vcard-creator 创建vCard
        const myVCard = new VCard();
        
        // 添加基本信息
        myVCard
          .addName('', label) // 将标签作为名字
          .addPhoneNumber(phoneNumber, 'PREF;CELL') // 设置为手机号码
          .addNote(`来自个人链接`); // 添加备注
        
        // 生成vCard字符串
        const vCardString = myVCard.toString();
        
        // 创建BLOB并下载
        const blob = new Blob([vCardString], { type: 'text/vcard' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${label}.vcf`;
        
        // 模拟点击事件以触发下载
        // 在iOS上，我们需要将元素添加到DOM中才能正常工作
        document.body.appendChild(a);
        setTimeout(() => {
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }, 100);
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

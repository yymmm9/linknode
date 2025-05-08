'use client';

import React, { useEffect } from 'react';
import VCard from 'vcard-creator';
import type { DataProps } from '@/types';

interface AutoAddContactProps {
  data: Partial<DataProps>;
  enabled: boolean;
}

/**
 * 自动添加为联系人组件
 * 当启用时，自动生成并下载 vCard 文件
 */
export const AutoAddContact: React.FC<AutoAddContactProps> = ({ data, enabled }) => {
  useEffect(() => {
    // 只有当功能启用时才执行
    if (!enabled) return;
    
    // 确保有基本的联系人信息
    if (!data.p && !data.em) return;
    
    // 检查是否已经触发过，避免重复触发
    const hasTriggered = sessionStorage.getItem('autoAddContactTriggered');
    if (hasTriggered) return;
    
    // 设置延迟，确保页面已经完全加载
    const timer = setTimeout(() => {
      try {
        // 创建 vCard
        const myVCard = new VCard();
        
        // 添加基本信息
        myVCard
          .addName(data.ln || '', data.n || '')
          .addCompany(data.o || '')
          .addJobtitle(data.ti || '')
          .addRole(data.r || '');
        
        // 添加联系方式
        if (data.p) {
          myVCard.addPhoneNumber(data.p, 'PREF;CELL');
        }
        
        if (data.em) {
          myVCard.addEmail(data.em);
        }
        
        // 添加其他信息
        if (data.web) {
          myVCard.addURL(data.web);
        }
        
        if (data.d) {
          myVCard.addNote(data.d);
        }
        
        if (data.addr) {
          myVCard.addAddress(data.addr);
        }
        
        // 生成 vCard 字符串
        const vCardString = myVCard.toString();
        
        // 创建 Blob 并下载
        const blob = new Blob([vCardString], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // 设置下载属性
        const fullName = [data.n, data.ln].filter(Boolean).join('_') || 'contact';
        link.href = url;
        link.download = `${fullName}.vcf`;
        
        // 添加到 DOM 并触发点击
        document.body.appendChild(link);
        link.click();
        
        // 清理
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
        // 标记已触发
        sessionStorage.setItem('autoAddContactTriggered', 'true');
      } catch (error) {
        console.error('自动添加联系人失败:', error);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [data, enabled]);
  
  // 这个组件不渲染任何内容
  return null;
};

export default AutoAddContact;

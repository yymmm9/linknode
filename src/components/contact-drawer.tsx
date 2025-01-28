'use client';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

type ButtonVariant = 'primary' | 'outline' | 'secondary';

interface ContactDrawerProps {
  cta?: ReactNode;
  copyCta?: string;
  toCopy?: string;
  info?: string;
  title?: string;
  description?: string;
  variant?: ButtonVariant;
}

export default function ContactDrawer({
  cta,
  copyCta,
  toCopy = 'yimmmmin',
  info,
  title,
  description,
  variant = 'primary',
}: ContactDrawerProps) {
  // 使用国际化翻译
  const t = useTranslations('ContactDrawer');

  // 设置默认值，优先使用传入的参数，否则使用翻译
  const ctaText = cta || t('cta');
  const copyCataText = copyCta || t('copyCta');
  const infoText = info || t('info');
  const titleText = title || t('title');
  const descriptionText = description || t('description');

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success(t('copy-success'));
    } catch (error) {
      toast.error(t('copy-error'));
      return null;
    }
  };

  const getButtonStyles = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return 'flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-600 hover:to-fuchsia-700 shadow-button shadow-violet-600/50 focus:ring-2 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none';
      case 'secondary':
        return 'flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-200 rounded-full hover:text-violet-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:bg-gray-50 hover:shadow-none';
      case 'outline':
      default:
        return 'flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-full hover:text-violet-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:bg-white hover:shadow-none';
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {typeof ctaText === 'string' ? (
          <Button
            className={cn(getButtonStyles(variant))}
          >
            {ctaText}
          </Button>
        ) : (
          ctaText
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{titleText}</DrawerTitle>
            <DrawerDescription>{descriptionText}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <p>{infoText + toCopy}</p>
          </div>
          <DrawerFooter className="">
            <Button onClick={() => copyToClipboard(toCopy)}>{copyCataText}</Button>
            <DrawerClose asChild>
              <Button variant="outline">
                {t('close')}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

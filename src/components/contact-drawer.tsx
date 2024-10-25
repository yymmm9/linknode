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

export default async function ContactDrawer({
  cta = '立即咨询',
  copyCta = '复制微信号',
  toCopy = 'yimmmmin',
  info = '微信号：',
  title = '添加微信，开启服务',
  description = '平面设计、印刷广告、灯箱立体字、网站、电商及线上点单，一站式解决方案，等你来体验！',
  variant = 'primary',
}) {
  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      // setHasCopied(true);
      toast.success('复制成功');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
      return null;
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cn(
            variant == 'primary'
              ? 'flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-600 hover:to-fuchsia-700 shadow-button shadow-violet-600/50 focus:ring-2 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none'
              : 'flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-full hover:text-violet-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none',
          )}
        >
          {cta}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <p>{info + toCopy}</p>
          </div>
          <DrawerFooter className="">
            {/* <DrawerClose asChild> */}
            <Button onClick={() => copyToClipboard(toCopy)}>{copyCta}</Button>
            {/* </DrawerClose> */}
            <DrawerClose asChild>
              <Button variant="outline">关闭</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

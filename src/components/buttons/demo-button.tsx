'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useData } from '@/lib/context/link-context';
import { useTranslations } from 'next-intl';
const t = useTranslations();
export default function DemoButton() {
  const { showDemo } = useData();
  return (
    <Button
      className="w-full bg-neutral-100 text-neutral-800 hover:text-neutral-100"
      onClick={showDemo}
    >
      <Play className="mr-2 size-4" />
      {t('Buttons.Demo')}
    </Button>
  );
}

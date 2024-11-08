'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import BackgroundCard from '@/components/backgrounds/background-card';
import { useTranslations } from 'next-intl';

export default function BackgroundShell() {
  const t = useTranslations('BackgroundShell');
  return (
    <Card className="-mt-5 w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between text-xl">
          {t('Title')}
        </CardTitle>
        <CardDescription>{t('Description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pb-2.5">
        <BackgroundCard />
      </CardContent>
    </Card>
  );
}

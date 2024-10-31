import React from 'react';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DemoButtonClient from './demo-button-client';

// import { NextIntlClientProvider, useMessages } from 'next-intl';
import ShortenerButtonClient from './shortener-button';

export function DemoButton() {
  const t = useTranslations();

  return (
    <DemoButtonClient
    // className="w-full bg-neutral-100 text-neutral-800 hover:text-neutral-100"
    >
      <Play className="mr-2 size-4" />
      {t('Buttons.Demo')}
    </DemoButtonClient>
  );
}

export function Shortener() {
  // const messages = useMessages();
  // const filteredMessages = messages?.ClientCounter;
  // console.log({ filteredMessages });
  return (
    // <NextIntlClientProvider messages={messages}>
    <ShortenerButtonClient />
    // </NextIntlClientProvider>
  );
}

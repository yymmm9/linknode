import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { InfiniteSliderHoverSpeedClient } from './InfiniteSliderHoverSpeedClient';
import { getMessages } from 'next-intl/server';
export async function InfiniteSliderHoverSpeed() {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <InfiniteSliderHoverSpeedClient />
    </NextIntlClientProvider>
  );
}

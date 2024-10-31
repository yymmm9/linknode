'use client';
import { InfiniteSlider } from '@/components/core/infinite-slider';

import { features } from '@/lib/site';
import { useTranslations } from 'next-intl';

export function InfiniteSliderHoverSpeedClient() {
  // if (!features) return;
  const t = useTranslations('Features');
  return (
    <InfiniteSlider durationOnHover={355} duration={125} gap={24}>
      {features.map((feature: any) => {
        return (
          <div
            key={feature.heading}
            className="p-4 border border-gray-150 flex flex-col gap-2 w-full max-w-48 rounded-md text-gray-800 justify-between"
          >
            <div className="flex flex-col gap-2">
              <div className="text-violet-600">{feature.icon}</div>
              <h3 className="text-sm font-bold">{t(feature.title)}</h3>
              <p className="text-sm text-gray-400 font-light">
                {t(feature.description)}
              </p>
            </div>
            {/* <Button variant={'secondary'}>{feature.cta}</Button> */}
          </div>
        );
      })}
    </InfiniteSlider>
  );
}

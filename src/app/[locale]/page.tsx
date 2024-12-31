import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

import { TextEffect } from '@/components/core/text-effect';
import { InfiniteSliderHoverSpeed } from '@/components/primitives/InfiniteSliderHoverSpeed';
import { FinancialFeatures } from '@/components/FeaturesGrid';
import React from 'react';
import ContactDrawer from '@/components/contact-drawer';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="relative md:container lg:grid-cols-3">
      {/* <section className="flex h-screen flex-col items-center justify-center gap-6 pb-6 lg:col-span-2 lg:px-20 lg:pb-0"></section> */}

      <section className="relative overflow-hidden border-b">
        <div className="max-w-screen-xl px-8 pt-24 mx-auto md:px-12 lg:px-32 lg:pt-32">
          <div className="text-center flex flex-col items-center">
            <span className="font-mono text-sm font-medium tracking-tight text-violet-600 uppercase">
              {t('caption')}
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-violet-950 md:text-6xl">
              <TextEffect per="char" preset="blur">
                {t('yi-chu-ji-fa-qing-song-huo-qu-ke-hu-hao-ping')}
              </TextEffect>
            </h1>
            <p className="max-w-sm mt-4 text-base text-gray-700 lg:mx-auto lg:text-base">
              {t(
                'bu-huo-ke-hu-zhen-shi-fan-kui-ping-lun-shu-liang-zeng-chang-bi-chuan-tong-fang-shi-gao-chu-534-zhu-ni-kuai-su-ti-sheng-pin-pai-ying-xiang-li',
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <ContactDrawer />

              <p
                // href="/"
                className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-full hover:text-violet-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
              >
                {t('xia-hua-yue-du-xiang-qing')}
              </p>
            </div>
          </div>
          <div className="my-8"></div>

          <div className="-mx-8 md:-px-12 lg:-px-32 max-w-[100vw]">
            <InfiniteSliderHoverSpeed />
          </div>
          <div className="my-8"></div>
          {/* <img
            alt="#_"
            className="w-full mt-24 -mb-24 scale-150 md:mt-48 md:-mb-64 drop-shadow-box"
            src="/cards.svg"
          /> */}
        </div>
      </section>

      <FinancialFeatures />
    </main>
  );
}

import { TextEffect } from '@/components/core/text-effect';
import { InfiniteSliderHoverSpeed } from '@/components/primitives/InfiniteSliderHoverSpeed';
import { FinancialFeatures } from '@/components/FeaturesGrid';
import React from 'react';
import ContactDrawer from '@/components/contact-drawer';

export const siteConfig = {
  name: 'hov - links',
  description: '',
  // ogImage: 'https://linknode.vercel.app/og-image.png',
  url: '',
};

export default function Home() {
  return (
    <main className="relative md:container lg:grid-cols-3">
      {/* <section className="flex h-screen flex-col items-center justify-center gap-6 pb-6 lg:col-span-2 lg:px-20 lg:pb-0"></section> */}

      <section className="relative overflow-hidden border-b">
        <div className="max-w-screen-xl px-8 pt-24 mx-auto md:px-12 lg:px-32 lg:pt-32">
          <div className="text-center flex flex-col items-center">
            <span className="font-mono text-sm font-medium tracking-tight text-violet-600 uppercase">
              会员卡 APP 预计12月上线
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-violet-950 md:text-6xl">
              {/* <TextEffectWithExit
                texts={['Innovating financial', 'solutions for tomorrow']}
              /> */}

              <TextEffect per="char" preset="blur">
                一触即发，轻松获取客户好评
              </TextEffect>
              {/* <span className={bgGradient}>solutions for tomorrow</span> */}
            </h1>
            <p className="max-w-sm mt-4 text-base text-gray-700 lg:mx-auto lg:text-base">
              捕获客户真实反馈，评论数量增长比传统方式高出534%，助你快速提升品牌影响力。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <ContactDrawer />

              <p
                // href="/"
                className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-full hover:text-violet-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
              >
                下滑阅读详情
              </p>
            </div>
          </div>
          <div className="my-8"></div>

          <div className="-mx-8 md:-px-12 lg:-px-32">
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

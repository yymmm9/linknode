import { TextEffect } from '@/components/core/text-effect';
import { InfiniteSliderHoverSpeed } from '@/components/primitives/InfiniteSliderHoverSpeed';

import React from 'react';
import {
  Clock,
  CreditCardIcon,
  EyeIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
  Phone,
  ShieldCheck,
  ShieldCheckIcon,
  SmartphoneNfcIcon,
  SmileIcon,
  StarsIcon,
  TrendingUpIcon,
  Zap,
} from 'lucide-react';
import ContactDrawer from '@/components/contact-drawer';

export const siteConfig = {
  name: 'hov - links',
  description: '',
  // ogImage: 'https://linknode.vercel.app/og-image.png',
  url: '',
};

const bgGradient =
  'block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600 py-2';

export default function Home() {
  return (
    <main className="relative md:container lg:grid-cols-3">
      {/* <section className="flex h-screen flex-col items-center justify-center gap-6 pb-6 lg:col-span-2 lg:px-20 lg:pb-0"></section> */}

      <section className="relative overflow-hidden border-b">
        <div className="max-w-screen-xl px-8 pt-24 mx-auto md:px-12 lg:px-32">
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

const features = [
  {
    id: 1,
    icon: <CreditCardIcon size={24} />,
    title: '只花一次钱，爽用一辈子',
    description:
      '就像吃到无限续杯的饮料，这笔投资一次搞定，未来无尽好评自己来。',
    cta: '不信你试试',
  },
  {
    id: 2,
    icon: <TrendingUpIcon size={24} />,
    title: '人气飙升，搜索引擎推爆你',
    description:
      '谁不想被更多人找到？好评越多，排名越高，让你在客户眼中无处不在。',
    cta: '让我们上头条',
  },
  {
    id: 3,
    icon: <StarsIcon size={24} />,
    title: '评论像爆米花一样蹦出来',
    description: '不用求着客户给评价，捕获率提高534%，这些好评自动送上门。',
    cta: '试试有多轻松',
  },
  // {
  //   id: 4,
  //   icon: <ShieldCheckIcon size={24} />,
  //   title: '45天试用？这不是梦',
  //   description:
  //     '放心大胆用，不爽全额退款。我们这么自信，是因为产品真有那么好。',
  //   cta: '我先试试',
  // },
  {
    id: 5,
    icon: <SmartphoneNfcIcon size={24} />,
    title: '碰一碰，简单到不行',
    description:
      '没有复杂的安装，没有麻烦的操作。扫一扫就能评价，简单到像喝杯水。',
    cta: '给客户一个轻松体验',
  },
  {
    id: 6,
    icon: <MessageSquareIcon size={24} />,
    title: '评论多了，生意自然好',
    description:
      '不用硬推，视觉设计和聪明的提示会让客户主动留下好评。你只需要笑纳这些好评就行。',
    cta: '来吧，评论来找我',
  },
  {
    id: 7,
    icon: <EyeIcon size={24} />,
    title: '设计太酷了，眼球跟着走',
    description: '不仅功能强大，颜值也在线，吸引客户的关注毫不费力。',
    cta: '看看我们有多酷',
  },
  {
    id: 8,
    icon: <SmileIcon size={24} />,
    title: '不求人，评价自己来',
    description: '不再尴尬地请客户评价。轻松的设计和智能引导让好评主动找上你。',
    cta: '看看它怎么搞定',
  },
  // {
  //   id: 9,
  //   icon: <MessagesSquareIcon size={24} />,
  //   title: '真实客户，真情实感',
  //   description:
  //     '告别虚假评论，每一条反馈都来自实打实的客户，让你的品牌赢得真实的信任。',
  // },
  // {
  //   id: 10,
  //   icon: <TrendingUpIcon size={24} />,
  //   title: '曝光率飙升，客户自然找上门',
  //   description:
  //     '好评多了，排名自然上升，附近的客户想不看到你都难。',
  // },
  {
    id: 11,
    icon: <ShieldCheck size={24} />,
    title: '信任感满满，订单源源不断',
    description:
      '真实的好评帮你建立口碑，赢得潜在客户的信任，订单自然而然就来了。',
  },
  {
    id: 12,
    icon: <Clock size={24} />,
    title: '快速反馈，机会不溜走',
    description:
      '只需轻触或扫一扫，客户立刻给出反馈，简化一切流程，不再错失每一个宝贵评论。',
  },
  {
    id: 13,
    icon: <Zap size={24} />,
    title: '自动评论，轻松到手',
    description:
      '省去手动提醒，反馈自动到手，让客户的声音自然传播，无需费心劳力。',
  },
  // {
  //   id: 14,
  //   icon: <Phone size={24} />,
  //   title: '全天候支持，永远在线',
  //   description: '遇到问题？别担心，我们24/7随时待命，让你随时有保障。',
  // },
];

const FinancialFeatures = () => {
  return (
    <div className="relative max-w-screen-xl px-8 py-12 mx-auto md:px-12 lg:px-32">
      <div className="max-w-2xl">
        <span className="font-mono text-sm font-medium tracking-tight text-violet-600 uppercase">
          功能们
        </span>
        <p className="mt-4 text-4xl font-semibold tracking-tighter text-violet-950">
          好评无需购买，
          <span className={bgGradient}>自动收获真实好评</span>
        </p>
        <p className="max-w-sm mt-4 text-base text-gray-700 lg:text-base">
          {/* 如何让客户有意愿留下好评?  */}
          当客户看到你在Google上拥有更多的正面评价时，他们更容易信任你的品牌，这直接影响他们的购买决策。
          {/* 此外，Google评价不仅影响你在本地搜索结果中的排名，还能提高你的曝光率，让更多潜在客户找到你。拥有积极评价和高星级评分的商家，往往在搜索结果中排名更高，吸引更多的点击和业务增长。通过谷歌商家立牌，你不仅可以提高客户参与度，还能提升整体业务表现，真正做到从客户反馈中获益。 */}
        </p>
        {/* <div className="flex flex-wrap items-center gap-2 mt-10">
          <a
            href="https://lexingtonthemes.lemonsqueezy.com/checkout/buy/95522c10-eed2-4620-84ab-5cbd34efc225"
            className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-600 hover:to-fuchsia-700 shadow-button shadow-violet-600/50 focus:ring-2 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
          >
            Buy Alfred
          </a>
          <a
            href="/system/overview"
            className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-full hover:text-violet-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-violet-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
          >
            See all pages
          </a>
        </div> */}
      </div>

      <div className="relative z-10 grid gap-px mt-12 overflow-hidden bg-gray-200 rounded-xl shadow-box shadow-gray-500/30 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="group flex h-full flex-col bg-white px-5 pb-[30px] pt-6 text-sm transition-all sm:min-h-[250px] md:min-h-[200px] xl:min-h-[250px] hover:bg-gradient-to-b from-violet-500 to-fuchsia-600 duration-200"
          >
            <div className="inline-flex items-center text-violet-700 group-hover:text-white">
              {feature.icon}
            </div>
            <div className="mt-8 font-mono text-base font-medium tracking-tighter uppercase group-hover:text-white lg:mt-24">
              {feature.title}
            </div>
            <div className="mt-2 text-sm text-gray-700 group-hover:text-white">
              {feature.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

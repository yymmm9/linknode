import { features } from '@/lib/site';

export const bgGradient =
  'block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600 py-2';

export const FinancialFeatures = () => {
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

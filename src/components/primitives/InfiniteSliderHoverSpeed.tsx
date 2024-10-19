import { InfiniteSlider } from '@/components/core/infinite-slider';
import { Button } from '../ui/button';
import {
  CreditCardIcon,
  EyeIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  SmartphoneNfcIcon,
  SmileIcon,
  StarIcon,
  StarsIcon,
  TrendingUpIcon,
} from 'lucide-react';

export function InfiniteSliderHoverSpeed() {
  const features = [
    {
      heading: '只花一次钱，爽用一辈子',
      body: '就像吃到无限续杯的饮料，这笔投资一次搞定，未来无尽好评自己来。',
      icon: <CreditCardIcon />,
      cta: '不信你试试',
    },
    {
      heading: '人气飙升，搜索引擎爱你',
      body: '谁不想被更多人找到？好评越多，排名越高，让你在客户眼中无处不在。',
      icon: <TrendingUpIcon />,
      cta: '让我们上头条',
    },
    {
      heading: '评论像爆米花一样蹦出来',
      body: '不用求着客户给评价，捕获率提高534%，这些好评自动送上门。',
      icon: <StarsIcon />,
      cta: '试试有多轻松',
    },
    {
      heading: '45天试用？这不是梦',
      body: '放心大胆用，不爽全额退款。我们这么自信，是因为产品真有那么好。',
      icon: <ShieldCheckIcon />,
      cta: '我先试试',
    },
    {
      heading: '碰一碰，简单到不行',
      body: '没有复杂的安装，没有麻烦的操作。扫一扫就能评价，简单到像喝杯水。',
      icon: <SmartphoneNfcIcon />,
      cta: '给客户一个轻松体验',
    },
    {
      heading: '评论多了，生意自然好',
      body: '不用硬推，视觉设计和聪明的提示会让客户主动留下好评。',
      // 你只需要笑纳这些好评就行。
      icon: <MessageSquareIcon />,
      cta: '来吧，评论来找我',
    },
    {
      heading: '设计太酷了，眼球跟着走',
      body: '我们的产品不仅功能强大，颜值也是在线的，吸引客户的关注毫不费力。',
      icon: <EyeIcon />,
      cta: '看看我们有多酷',
    },
    {
      heading: '不求人，评价自己来',
      body: '不再尴尬地请客户评价。轻松的设计和智能引导让好评主动找上你。',
      icon: <SmileIcon />,
      cta: '看看它怎么搞定',
    },
  ];

  if (!features) return;

  return (
    <InfiniteSlider durationOnHover={355} duration={125} gap={24}>
      {features.map((feature: any) => {
        return (
          <div
            key={feature.heading}
            className="p-4 border border-gray-150 flex flex-col gap-2 w-full max-w-48 rounded-md text-gray-800 justify-between"
          >
            <div className="flex flex-col gap-2">
              <div className="text-teal-600">{feature.icon}</div>
              <h3 className="text-sm font-bold">{feature.heading}</h3>
              <p className="text-sm text-gray-400 font-light">{feature.body}</p>
            </div>
            {/* <Button variant={'secondary'}>{feature.cta}</Button> */}
          </div>
        );
      })}
      {/* <div className="flex gap-2 aspect-square w-[120px] rounded-md">
        <h3>{features[0]?.heading}</h3>
        <h3>{features[0]?.body}</h3>
        {features[0]?.icon}
        <Button variant={'secondary'}>{features[0]?.cta}</Button>
      </div>
      <div className="flex gap-2 aspect-square w-[120px] rounded-md">
        <h3>{features[0]?.heading}</h3>
        <h3>{features[0]?.body}</h3>
        {features[0]?.icon}
        <Button variant={'secondary'}>{features[0]?.cta}</Button>
      </div> */}
      {/* <img
        src="https://i.scdn.co/image/ab67616d00001e02ad24c5e36ddcd1957ad35677"
        alt="Dean blunt - Black Metal 2"
        className="aspect-square w-[120px] rounded-[4px]"
      /> */}
    </InfiniteSlider>
  );
}

import * as React from 'react';

import { cn } from '@/lib/utils';
import { SocialLinkProviderProps } from '@/types';

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   icon: string;
// }

interface IconWrapperProps {
  className?: string; // 可选的 className
  Icon: React.ElementType; // 传入图标组件
}

const IconWrapper: React.FC<IconWrapperProps> = ({ className, Icon }) => {
  return <Icon className={className} />;
};


export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'>, 
    Pick<SocialLinkProviderProps, 'icon' | 'placeholder'> {
  // 这里可以添加任何额外的属性
}
const SocialInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon: PropIcon, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute icon left-2.5 top-2/4 size-5 translate-y-[-50%]">
        {/* <div className="icon  absolute inset-0 flex items-center"> */}
          {typeof PropIcon == "string" ? PropIcon :
        <IconWrapper className="size-5" Icon={PropIcon} />
      }
        </div>
        {/* <Icon
          icon={propIcon}
          className="absolute left-2.5 top-2/4 size-5 translate-y-[-50%]"
        /> */}
        <input
          type="search"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
SocialInput.displayName = 'SocialInput';

export { SocialInput };

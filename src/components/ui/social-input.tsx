import * as React from 'react';

import { cn } from '@/lib/utils';
import { SocialLinkProviderProps } from '@/types';

interface IconWrapperProps {
  className?: string; // 可选的 className
  Icon?: React.ElementType; // 传入 React 组件类型，设置为可选
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ className, Icon }) => {
  if (!Icon) {
    return null;
  }
  return <Icon className={className} />;
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'>, 
    Pick<SocialLinkProviderProps, 'icon' | 'placeholder'> {
  // 这里可以添加任何额外的属性
}
const SocialInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon: PropIcon, value, ...props }, ref) => {
    // 确保 value 永远不会是 null
    const inputValue = value === null ? '' : value;
    
    return (
      <div className="relative">
        <div className="absolute icon left-2.5 top-2/4 size-5 translate-y-[-50%]">
          {typeof PropIcon == "string" ? PropIcon :
            <IconWrapper className="size-5" Icon={PropIcon} />
          }
        </div>
        <input
          type="search"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          value={inputValue}
          {...props}
        />
      </div>
    );
  },
);
SocialInput.displayName = 'SocialInput';

export { SocialInput };

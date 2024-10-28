// export default function HideOnScroll(props) {
//   const { children, threshold, scroller, ...other } = props;

//   const hide = useHideOnScroll({ threshold, scroller });
// https://github.com/mui/material-ui/issues/12337#issuecomment-487200865
import React from 'react';
import { cn } from '../utils';

interface UseHideOnScrollOptions {
  threshold?: number;
  scroller?: Window | HTMLElement;
}

function getScrollY(scroller: Window | HTMLElement): number {
  if (scroller instanceof Window) {
    return scroller.pageYOffset !== undefined ? scroller.pageYOffset : 0;
  } else {
    return scroller.scrollTop !== undefined
      ? scroller.scrollTop
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
  }
}

const useHideOnScroll = ({
  threshold = 100,
  scroller,
}: UseHideOnScrollOptions): boolean => {
  const scrollRef = React.useRef<number>(0);
  const [hide, setHide] = React.useState(false);

  const handleScroll = React.useCallback(() => {
    const scrollY = getScrollY(scroller || window);
    const prevScrollY = scrollRef.current;
    scrollRef.current = scrollY;

    setHide(scrollY < prevScrollY ? false : scrollY > threshold);
  }, [scroller, threshold]);

  React.useEffect(() => {
    const scrollElement = scroller || window;
    scrollElement.addEventListener('scroll', handleScroll);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, scroller]);

  return hide;
};

export function HideOnScroll({
  children,
  threshold,
  scroller,
  className,
  ...other
}: any) {
  const hide = useHideOnScroll({ threshold, scroller });

  return (
    <div
      {...other}
      className={cn(
        'transition-opacity duration-300',
        hide ? 'opacity-0' : 'opacity-100',
        className,
      )}
    >
      {children}
    </div>
  );
}

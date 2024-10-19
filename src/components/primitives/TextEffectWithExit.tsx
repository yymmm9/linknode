'use client';
import { useState, useEffect } from 'react';
import { TextEffect } from '@/components/core/text-effect';

export function TextEffectWithExit({ texts = [''] }: { texts: string[] }) {
  const [trigger, setTrigger] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleTextChange = () => {
      // Start the exit animation by setting trigger to false
      setTrigger(false);

      // After the exit animation duration (400ms), switch the text and re-trigger enter animation
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setTrigger(true); // Start the enter animation
      }, 400); // This should match the exit animation duration
    };

    // Start the process with a 2000ms interval for text change
    const interval = setInterval(handleTextChange, 2400); // 2000ms display + 400ms exit duration

    return () => clearInterval(interval);
  }, [texts.length]);

  const blurSlideVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.01 },
      },
      exit: {
        transition: { staggerChildren: 0.01, staggerDirection: 1 },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        filter: 'blur(10px) brightness(0%)',
        y: 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px) brightness(100%)',
        transition: {
          duration: 0.4,
        },
      },
      exit: {
        opacity: 0,
        y: -30,
        filter: 'blur(10px) brightness(0%)',
        transition: {
          duration: 0.4,
        },
      },
    },
  };

  return (
    <div style={{ height: 'auto', minHeight: '1em', whiteSpace: 'nowrap' }}>
      {/* Use the longest text to keep the container height stable */}
      <div style={{ visibility: 'hidden', position: 'absolute' }}>
        {texts[currentIndex]}
      </div>

      <TextEffect
        className="inline-flex"
        per="char"
        variants={blurSlideVariants}
        trigger={trigger}
      >
        {texts[currentIndex] as string}
      </TextEffect>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { Button } from './ui/button';
import { CopyIcon, CheckIcon } from 'lucide-react';
import clsx from 'clsx';

export const stripSpecialPrefixes = (url: string): string => {
  return url.replace(/^(tel:|mailto:)/i, '');
};

export function CopyToClipboard({ url }: { url: any }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    let safeUrl = stripSpecialPrefixes(url);

    navigator.clipboard
      .writeText(safeUrl)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((error) => {
        if (error) toast.error('Error copying to clipboard');
      });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="link"
          size="icon"
          onClick={copyToClipboard}
          disabled={copied}
          className="relative size-4 disabled:opacity-100"
        >
          <CopyIcon
            className={clsx(
              'absolute inset-0 transition-opacity duration-300 size-4',
              {
                'opacity-100': !copied,
                'opacity-0': copied,
              },
            )}
          />
          <CheckIcon
            className={clsx(
              'absolute inset-0 transition-opacity duration-300 size-4',
              {
                'opacity-0': !copied,
                'opacity-100': copied,
              },
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy</p>
      </TooltipContent>
    </Tooltip>
  );
}
export function CopyToClipboardWrapper({
  url,
  children,
  message,
}: {
  url: any;
  children: any;
  message?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    let safeUrl = stripSpecialPrefixes(url);

    navigator.clipboard
      .writeText(safeUrl)
      .then(() => {
        setCopied(true);
        toast.success(`${message && message} copied to clipboard`);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((error) => {
        if (error) toast.error('Error copying to clipboard');
      });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          // variant="link"
          // size="icon"
          onClick={copyToClipboard}
          disabled={copied}
          className="w-full p-0 bg-transparent hover:bg-transparent"
          // className="relative size-4 disabled:opacity-100"
        >
          {children}
          {/* <CopyIcon
            className={clsx(
              "absolute inset-0 transition-opacity duration-300 size-4",
              {
                "opacity-100": !copied,
                "opacity-0": copied,
              }
            )}
          />
          <CheckIcon
            className={clsx(
              "absolute inset-0 transition-opacity duration-300 size-4",
              {
                "opacity-0": !copied,
                "opacity-100": copied,
              }
            )}
          /> */}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy</p>
      </TooltipContent>
    </Tooltip>
  );
}

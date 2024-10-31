'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/context/link-context';

export default function DemoButtonClient({ children }: any) {
  const { showDemo } = useData();
  return (
    <Button
      className="w-full bg-neutral-100 text-neutral-800 hover:text-neutral-100"
      onClick={showDemo}
    >
      {children}
    </Button>
  );
}

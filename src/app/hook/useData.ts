import { useState } from 'react';
import { DataProps } from '@/types';

export function useData() {
  const [data, setData] = useState<DataProps>({
    ls: [], // 初始化为空数组
  });

  return { 
    data, 
    setData 
  };
}

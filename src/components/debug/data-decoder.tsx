'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/context/link-context';
import { encodeData, decodeData } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DataProps } from '@/types';

export default function DataDecoderDebug() {
  const { data, setData } = useData();
  const [base64Input, setBase64Input] = useState('');
  const [encodedData, setEncodedData] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEncode = () => {
    try {
      const encoded = encodeData(data as DataProps);
      setEncodedData(encoded);
      setBase64Input(encoded);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '编码失败');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeData(base64Input);
      if (decoded) {
        setData(decoded);
        setError(null);
      } else {
        setError('解码失败：无效的数据');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解码失败');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>数据编解码调试工具</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={handleEncode} className="w-full">
            编码当前数据
          </Button>

          {error && (
            <div className="bg-red-50 text-red-600 p-2 rounded">
              {error}
            </div>
          )}

          {encodedData && (
            <div>
              <h3 className="font-semibold mb-2">编码结果:</h3>
              <Textarea 
                readOnly 
                value={encodedData} 
                className="min-h-[100px]" 
              />
            </div>
          )}

          <div className="mt-4 space-y-2">
            <Input 
              placeholder="输入 Base64 编码的数据" 
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
            />
            <Button onClick={handleDecode} className="w-full">
              解码并更新数据
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">当前数据:</h3>
            <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

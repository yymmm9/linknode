'use client';

import React, { useState, useCallback } from 'react';
import { useData } from '@/lib/context/link-context';
import { encodeData, decodeData } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DataProps } from '@/types';
import { safeJsonParse } from '@/lib/utils';

export default function DataDecoderDebug() {
  const { data, setData } = useData();
  const [base64Input, setBase64Input] = useState('');
  const [encodedData, setEncodedData] = useState('');
  const [jsonInput, setJsonInput] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState<string | null>(null);

  // 处理 JSON 编辑
  const handleJsonEdit = useCallback(() => {
    try {
      // 安全地解析 JSON
      const parsedData = safeJsonParse(jsonInput, {} as DataProps);
      
      // 验证数据类型
      if (typeof parsedData === 'object' && parsedData !== null) {
        setData(parsedData);
        setError(null);
      } else {
        setError('无效的 JSON 数据');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析 JSON 失败');
    }
  }, [jsonInput, setData]);

  // 编码当前数据
  const handleEncode = useCallback(() => {
    try {
      const encoded = encodeData(data as DataProps);
      setEncodedData(encoded);
      setBase64Input(encoded);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '编码失败');
    }
  }, [data]);

  // 解码 Base64 数据
  const handleDecode = useCallback(() => {
    try {
      const decoded = decodeData(base64Input);
      if (decoded) {
        setData(decoded);
        // 同步更新 JSON 输入框
        setJsonInput(JSON.stringify(decoded, null, 2));
        setError(null);
      } else {
        setError('解码失败：无效的数据');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解码失败');
    }
  }, [base64Input, setData]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>数据编解码调试工具</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* JSON 编辑器部分 */}
        <div className="space-y-2">
          <h3 className="font-semibold">JSON 数据编辑</h3>
          <Textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="在此编辑 JSON 数据"
            className="min-h-[200px]"
          />
          <Button 
            onClick={handleJsonEdit} 
            className="w-full"
            variant="secondary"
          >
            更新数据
          </Button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded">
            {error}
          </div>
        )}

        {/* 编码部分 */}
        <div className="space-y-2">
          <Button onClick={handleEncode} className="w-full">
            编码当前数据
          </Button>

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
        </div>

        {/* 解码部分 */}
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

        {/* 当前数据 */}
        <div>
          <h3 className="font-semibold mb-2">当前数据:</h3>
          <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

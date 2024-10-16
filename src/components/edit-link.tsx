'use client';

import { useEffect, useState } from 'react';
import { decodeData } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import retrieveShortLink from '@/app/_actions/shortlink/retrieve';
import DisplayData from './display-data';

export default function EditShortLink({ linkKey: key }: { linkKey: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [data, setData] = useState<any>(null); // State for storing the fetched data
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const [hasFetchedData, setHasFetchedData] = useState(false); // Track if data has been fetched

  useEffect(() => {
    const fetchData = async () => {
      if (!key || hasFetchedData) return; // Only fetch if key exists and data hasn't been fetched yet

      setIsLoading(true); // Start loading when the fetch begins
      const result = await retrieveShortLink(key);
      const url = result?.data?.url;

      if (url) {
        const params = new URLSearchParams(url.split('?')[1]);
        const rawData = params.get('data');
        const decodedData = rawData && decodeData(rawData);
        setData(decodedData); // Store fetched and decoded data in state
      }

      setIsLoading(false); // End loading when fetch is complete
      setHasFetchedData(true); // Mark data as fetched
    };

    if (isDrawerOpen) {
      // Fetch data only when the drawer is open
      fetchData();
    }
  }, [isDrawerOpen, key, hasFetchedData]); // Only refetch when the drawer opens and key changes

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center gap-2">
          <Button variant={'ghost'}>Edit</Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[75vh] pb-2">
        <div className="mx-auto w-full max-w-sm overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Edit Short Link</DrawerTitle>
            <DrawerDescription>
              Modify your short link settings.
            </DrawerDescription>
          </DrawerHeader>
          <div className="">
            {isLoading ? (
              'Loading...'
            ) : data ? (
              <DisplayData acc={data} />
            ) : (
              'No data available'
            )}
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

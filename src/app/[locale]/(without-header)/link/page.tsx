import { decodeData } from '@/lib/utils';
import NotFound from '@/app/not-found';
import { BACKGROUND_OPTIONS } from '@/components/backgrounds/background-snippets';
import DisplayData from '@/components/display-data';
import DataLoading from './loading';
import LinkPageError from './error';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface SearchParamsProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export function generateMetadata({ searchParams }: SearchParamsProps) {
  const { data: queryData } = searchParams;

  if (!queryData) return NotFound();

  const data = decodeData(queryData);

  if (!data) return null;

  return {
    title: `${data.n}'s`,
    description: `Find all of ${data.n}'s links in one place.`,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://on.hov.sh',
      title: `${data.n}'s - hov`,
      description: `Find all of ${data.n}'s links in one place.`,
      images: `https://on.hov.sh/api/og?data=${encodeURI(
        data.n ? data.n : 'Made with hov',
      )}`,
      siteName: `${data.n}'s - hov`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.n} - hov`,
      description: `Find all of ${data.n}'s links in one place.`,
      images: `https://on.hov.sh/api/og?data=${encodeURI(
        data.n ? data.n : 'Made with hov',
      )}`,
      creator: '@',
    },
  };
}

export default function Page({ searchParams }: SearchParamsProps) {
  const t = useTranslations('LinkPage');

  if (!searchParams.data) return <NotFound />;
console.log("searchParams.data",searchParams.data)
const data = decodeData(searchParams.data);
console.log("decode.data",data)

  if (!data) return <LinkPageError />;

  const selectedBgOption = data
    ? BACKGROUND_OPTIONS.find((option) => option.code === data.bg)
    : null;

  const selectedBgComponent = selectedBgOption
    ? selectedBgOption.component
    : null;

  return (
    <>
      <div className="fixed left-0 top-0 z-[-10] size-full">
        {selectedBgComponent}
      </div>
      <div className="hide_scrollbar p-2 pt-10">
        {data ? (
          <DisplayData 
            acc={data} 
          />
        ) : (
          <DataLoading />
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full text-center p-4 bg-gray-100 flex gap-4 items-center justify-center">
        <div className="text-sm text-gray-600">
          {t('poweredBy')}
        </div>
        <Link 
          href="/create" 
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          {t('createYourLinks')}
        </Link>
      </div>
    </>
  );
}

import { decodeData, getFullName } from '@/lib/utils';
import NotFound from '@/app/not-found';
import { BACKGROUND_OPTIONS } from '@/components/backgrounds/background-snippets';
import DisplayData from '@/components/display-data';
import DataLoading from './loading';
import LinkPageError from './error';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface SearchParamsProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export async function generateMetadata({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { data?: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: 'LinkPage',
  });

  const { data: queryData } = searchParams;

  if (!queryData) return NotFound();

  // 1. 先尝试直接解码
  let decodedData = decodeData(queryData);

  // 2. 如果解码失败，尝试先进行 URL 解码
  if (!decodedData) {
    try {
      const urlDecoded = decodeURIComponent(queryData);
      decodedData = decodeData(urlDecoded);
      console.log('URL decoded data:', decodedData);
    } catch (error) {
      console.error('解码数据时出错:', error);
      return NotFound();
    }
  }

  // 3. 如果还是失败，返回 404
  if (!decodedData) {
    console.error('无法解码数据');
    return NotFound();
  }

  // 生成全名
  const fullName = getFullName(decodedData.n, decodedData.ln, locale);
  // 生成链接名称
  const linkName = decodedData.t || fullName;

  const title = linkName + t('title');
  const description = linkName + t('description');

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: decodedData.i || `/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      creator: '@',
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    other: {
      'googlebot': 'noindex',
      'googlebot-news': 'noindex',
      'googlebot-image': 'noindex',
      'robots': 'noindex, nofollow',
    },
  };
}

export default function Page({ searchParams }: SearchParamsProps) {
  const t = useTranslations('LinkPage');

  if (!searchParams.data) return <NotFound />;
  console.log('searchParams.data', searchParams.data);
  const data = decodeData(searchParams.data);
  console.log('decode.data', data);

  if (!data) return <LinkPageError />;

  const selectedBgOption = data
    ? BACKGROUND_OPTIONS.find((option) => option.code === data.bg)
    : null;

  const selectedBgComponent = selectedBgOption
    ? selectedBgOption.component
    : null;

  // 检查是否需要自动添加联系人
  const autoAddContact = searchParams.a === 'true';
  
  let noBadge = true;

  return (
    <>
      <div className="fixed left-0 top-0 z-[-10] size-full">
        {selectedBgComponent}
      </div>
      <div className="hide_scrollbar p-2 pt-10">
        {data ? <DisplayData acc={data} autoAddContact={autoAddContact} /> : <DataLoading />}
      </div>
      <div className="fixed bottom-0 left-0 w-full text-center p-4 bg-gray-100 flex gap-4 items-center justify-center">
        <Link href={'/'}><div className="text-sm text-gray-600">{t('poweredBy')}</div></Link>
        {noBadge ? null : (
          <Link
            href="/create"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            {t('createYourLinks')}
          </Link>
        )}
      </div>
    </>
  );
}

import { unstable_setRequestLocale } from 'next-intl/server';
import CreatePageContent from './create-page-content';

export default function CreatePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return <CreatePageContent />;
}

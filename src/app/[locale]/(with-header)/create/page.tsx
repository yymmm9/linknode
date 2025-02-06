import CreatePageContent from './create-page-content';
import DataDecoderDebug from '@/components/debug/data-decoder';
// import { LinkProvider } from '@/lib/context/link-context';

export default function CreatePage({ 
  params: { locale },
  searchParams 
}: { 
  params: { locale: string },
  searchParams?: { data?: string }
}) {
  return (
    // <LinkProvider>
      <div>
        <CreatePageContent />
        {process.env.NODE_ENV === 'development' && (
          <DataDecoderDebug />
        )}
      </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useUser from '@/app/hook/useUser';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function EditShortLink({ linkKey }: { linkKey: string }) {
  const t = useTranslations('EditShortLink');
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  const handleEdit = () => {
    if (!user?.id) {
      toast.error(t('pleaseLogin'));
      router.push('/signin');
      return;
    }

    // If we have a linkKey, navigate to edit page
    if (linkKey) {
      router.push(`/edit/${linkKey}`);
    } else {
      toast.error(t('noLinkKey'));
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEdit}
      disabled={isLoading}
    >
      {t('edit')}
    </Button>
  );
}

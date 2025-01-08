import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function EmptyState() {
  const t = useTranslations('ShortenerButton')
  
  return (
    <Button className="w-full" disabled>
      {t('can-and-39-t-short-link-with-empty-fields')}
    </Button>
  )
}

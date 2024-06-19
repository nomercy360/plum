import { useTranslation } from 'next-i18next';
import Link from '@/components/Link';

export default function Footer() {
  const { t } = useTranslation('common');
  // const currentLocale = router.query.locale || i18nextConfig.i18n.defaultLocale
  return (
    <footer className="flex w-full flex-col items-start justify-start gap-14 bg-gray p-5 text-black">
      <div className="flex flex-col items-start justify-start gap-2">
        <Link href="/about">{t('delivery')}</Link>
        <a href="#">{t('instagram')}</a>
        <Link href="/terms">{t('policy')}</Link>
        <Link href="/gift-card">{t('gift')}</Link>
      </div>
      <div className="flex w-full flex-row justify-between text-xs text-gray-light">
        <p>PLUM® {t('allRightsReserved')} 2024</p>
        <p>{t('madeWithLove')}</p>
      </div>
    </footer>
  );
}

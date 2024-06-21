import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';
import Icons from '@/components/Icons';
import Head from 'next/head';

export default function Terms(props: any) {
  const { t } = useTranslation(['policy']);

  return (
    <>
      <Head>
        <meta name="og:title" content="PLUM®" />
        <meta name="og:description" content="Dresses & things" />
        <meta name="og:image" content="https://plumplum.co/images/og.png" />
        <meta name="description" content="Dresses & things" />
      </Head>
      <main className={`flex min-h-screen flex-col items-center justify-between bg-white`}>
        <Navbar />
        <div className="mb-11 mt-8 max-w-3xl p-5 sm:mb-28 sm:mt-28 sm:p-0">
          <p className="mb-4 text-lg sm:text-xl">{t('privacy.title')}</p>
          <ol className="list-inside list-decimal space-y-2 text-sm sm:text-base">
            <li>
              {t('privacy.point1.title')} <span className="text-gray-light">{t('privacy.point1.description')}</span>
            </li>
            <li>
              {t('privacy.point2.title')} <span className="text-gray-light">{t('privacy.point2.description')}</span>
            </li>
            <li>
              {t('privacy.point3.title')} <span className="text-gray-light">{t('privacy.point3.description')}</span>
            </li>
            <li>
              {t('privacy.point4.title')} <span className="text-gray-light">{t('privacy.point4.description')}</span>
            </li>
            <li>
              {t('privacy.point5.title')} <span className="text-gray-light">{t('privacy.point5.description')}</span>
            </li>
            <li>
              {t('privacy.point6.title')} <span className="text-gray-light">{t('privacy.point6.description')}</span>
            </li>
            <li>
              {t('privacy.point7.title')} <span className="text-gray-light">{t('privacy.point7.description')}</span>
            </li>
          </ol>
          <p className="mb-4 mt-7 text-lg sm:text-xl">{t('tos.title')}</p>
          <ol className="list-inside list-decimal space-y-2 text-sm sm:text-base">
            <li>
              {t('tos.point1.title')} <span className="text-gray-light">{t('tos.point1.description')}</span>
            </li>
            <li>
              {t('tos.point2.title')} <span className="text-gray-light">{t('tos.point2.description')}</span>
            </li>
            <li>
              {t('tos.point3.title')} <span className="text-gray-light">{t('tos.point3.description')}</span>
            </li>
            <li>
              {t('tos.point4.title')} <span className="text-gray-light">{t('tos.point4.description')}</span>
            </li>
            <li>
              {t('tos.point5.title')} <span className="text-gray-light">{t('tos.point5.description')}</span>
            </li>
            <li>
              {t('tos.point6.title')} <span className="text-gray-light">{t('tos.point6.description')}</span>
            </li>
            <li>
              {t('tos.point7.title')} <span className="text-gray-light">{t('tos.point7.description')}</span>
            </li>
          </ol>
          <p className="mt-7 text-sm sm:text-base">{t('company.title')} </p>
          <p className="text-sm sm:text-base">{t('company.vat')}</p>
          <p className="text-sm sm:text-base">{t('company.address')}</p>
          <p className="mb-10 mt-8 text-sm sm:text-base">support@plumplum.co</p>
          {props._nextI18Next.initialLocale === 'ru' && <Icons.payment className="w-full" />}
        </div>
        <Footer />
      </main>
    </>
  );
}

const getStaticProps = makeStaticProps(['policy', 'common']);

export { getStaticPaths, getStaticProps };

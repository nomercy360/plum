import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';

export default function Contacts() {
  const { t } = useTranslation(['common']);
  return (
    <div>
      <main
        className={`flex min-h-screen flex-col items-center justify-between bg-white`}>
        <Navbar theme={'light'} />
        <div className="mb-11 mt-8 max-w-xs p-5 text-center sm:mb-28 sm:mt-28 sm:p-0">
          <p className="mb-4 text-lg sm:text-xl">{t('contacts')}</p>
          <div className="mt-10 space-y-1 text-sm sm:text-base">
            <p className="uppercase">{t('ordersCompliments')}</p>
            <p>+995 551 546 841</p>
            <p>support@plumplum.co</p>
          </div>
          <div className="mt-10 space-y-1 text-sm sm:text-base">
            <p className="uppercase">{t('salesCooperation')}</p>
            <p>Nikita Beketov</p>
            <p>+995 551 546 841</p>
            <p>nikita@plumplum.co</p>
          </div>
          <div className="mt-10 space-y-1 text-sm sm:text-base">
            <p className="uppercase">{t('collaborationsPress')}</p>
            <p>Nastya Cishevskaya</p>
            <p>+995 551 546 841</p>
            <p>nastya@plumplum.co</p>
          </div>
          <div className="mt-10 space-y-1 text-sm sm:text-base">
            <p className="uppercase">{t('individualEntrepreneur')}</p>
            <p>{t('vat')}</p>
            <p>{t('address')}</p>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

const getStaticProps = makeStaticProps(['common']);

export { getStaticPaths, getStaticProps };

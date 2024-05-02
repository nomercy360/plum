import Icons from '@/components/Icons';
import NavbarCart from '@/components/NavbarCart';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';

export default function Order() {
  const { t } = useTranslation('checkout');

  const [data, setData] = useState({ success: false });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // for now sleep and return some data about the order. 50% chance of success order or failed order
    setTimeout(() => {
      const success = Math.random() > 0.5;
      setData({
        success: success,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p>Waiting...</p>
      </div>
    );
  }

  return (
    <div>
      {data.success ? <SuccessOrder /> : <FailedOrder />}
    </div>
  );
}

function SuccessOrder() {
  const { t } = useTranslation('checkout');
  const router = useRouter();

  return (
    <OrderLayout>
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <Icons.checkmark />
        <p className="-mt-14 max-w-xs text-lg sm:text-xl">
          {t('titleOrderSuccess')}
        </p>
        <p>
          {t('textOrderSuccess')}
        </p>
      </div>
      <a
        href="https://www.instagram.com/"
        className="mt-5 flex h-11 w-56 items-center justify-center rounded-3xl bg-black text-center text-white">
        {t('subscribeInstagramButton')}
      </a>
    </OrderLayout>
  );
}


function FailedOrder() {
  const { t } = useTranslation('checkout');
  const router = useRouter();

  return (
    <OrderLayout>
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <Icons.failmark />
        <p className="-mt-14 max-w-xs text-lg sm:text-xl">{t('titleOrderFailed')}</p>
        <p>{t('textOrderFailed')}</p>
      </div>
      <button
        onClick={router.reload}
        className="mt-5 flex h-11 w-56 items-center justify-center rounded-3xl bg-black text-center text-white">
        {t('tryAgain')}
      </button>
    </OrderLayout>
  );
}

function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-start bg-white">
      <NavbarCart />
      <div className="flex flex-col items-center justify-between p-8 sm:justify-center">
        <div></div>
        {children}
      </div>
    </div>
  );
}


const getStaticProps = makeStaticProps(['checkout']);

export { getStaticProps, getStaticPaths };
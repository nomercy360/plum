import Icons from '@/components/Icons';
import { useTranslation } from 'next-i18next';
import { Suspense, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';
import { Product } from '@/pages/[locale]';
import { useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';
import { cartItemsToGTM } from '@/pages/[locale]/checkout';
import { NavbarCart } from '@/components/Navbar';
import Head from 'next/head';
import { CartContext } from '@/context/cart-provider';

export async function fetchOrder(locale: string, orderID: number) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderID}`, {
    headers: {
      'Accept-Language': locale,
    },
  });
  return await resp.json();
}

type Order = {
  id: number;
  status: string;
  total: number;
  items: Array<Product>;
  payment_id: string;
  payment_status: string;
  currency: string;
  customer: {
    email: string;
  };
};

export default function Order() {
  const { t } = useTranslation('checkout');
  return (
    <>
      <Suspense>
        <SuccessOrder />
      </Suspense>
    </>
  );
}

function SuccessOrder() {
  const { t } = useTranslation('checkout');

  const [isLoading, setLoading] = useState(true);

  const [order, setOrder] = useState({} as Order);

  const params = useSearchParams();

  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    if (params.has('orderId')) {
      const orderID = parseInt(params.get('orderId') || '0');
      fetchOrder('en', orderID).then(order => {
        setOrder(order);
        setLoading(false);

        if (order.payment_status === 'paid') {
          sendGTMEvent({
            event: 'purchase',
            affiliation: 'Online Store',
            transaction_id: order.payment_id,
            value: order.total,
            ecommerce: {
              currency: order.currency,
              items: cartItemsToGTM(order.items),
            },
          });
          // clear cart
          clearCart();
        }
      });
    }
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p>Waiting...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="og:title" content="Checkout | PLUM®" />
        <meta name="og:description" content="Dresses & things" />
        <meta name="og:image" content="https://plumplum.co/images/og.png" />
        <meta name="description" content="Dresses & things" />
      </Head>
      <OrderLayout>
        {order.payment_status === 'paid' ? (
          <>
            <div className="flex max-w-sm flex-col items-center gap-5 text-center">
              <Icons.checkmark />
              <p className="-mt-14 max-w-xs text-lg sm:text-xl">{t('titleOrderSuccess')}</p>
              <p>{t('textOrderSuccess', { email: order.customer.email })}</p>
            </div>
            <a
              href="https://www.instagram.com/plumplum.brand"
              className="mt-5 flex h-11 w-56 items-center justify-center rounded-3xl bg-black text-center text-white"
            >
              {t('subscribeInstagramButton')}
            </a>
          </>
        ) : (
          <>
            <div className="flex max-w-sm flex-col items-center gap-5 text-center">
              <Icons.failmark />
              <p className="-mt-14 max-w-xs text-lg sm:text-xl">{t('titleOrderFailed')}</p>
              <p>{t('textOrderFailed')}</p>
            </div>
            <button
              className="mt-5 flex h-11 w-56 items-center justify-center rounded-3xl bg-black text-center text-white"
              onClick={() => window.location.reload()}
            >
              {t('tryAgain')}
            </button>
          </>
        )}
      </OrderLayout>
    </>
  );
}

function OrderLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

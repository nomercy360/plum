import Icons from './Icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CartContext } from '@/context/cart-provider';
import Navbar from '@/components/Navbar';

export default function EmptyCart() {
  const { t } = useTranslation('checkout');

  const router = useRouter();

  const { restoreCart } = useContext(CartContext);
  const cartID = typeof localStorage !== 'undefined' ? localStorage.getItem('plum-restore-cart-id') || false : false;

  return (
    <>
      <main className="flex h-screen w-full flex-col items-center justify-start bg-white">
        <Navbar />
        <section className="flex h-full flex-col items-center justify-between p-8 sm:justify-center">
          <span></span>
          <div className="flex max-w-64 flex-col items-center justify-center text-center sm:max-w-sm mb-8">
            <Icons.basket className='h-6 w-6 mb-4' />
            <p className="text-lg sm:mb-2.5 sm:text-xl uppercase">{t('emptyCart')}</p>
            <p className="text-sm sm:text-base text-balance text-dark-gray">{t('emptyCartDescription')}</p>
          </div>
          {cartID ? (
            <div className="flex w-full items-center justify-center gap-3">
              <button className="h-11 w-auto px-4 rounded-3xl bg-gray text-black" onClick={restoreCart}>
                {t('restoreCart')}
              </button>
              <button className="h-11 w-auto px-4 rounded-3xl bg-black text-white" onClick={() => router.back()}>
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-3">
              <button className="h-11 w-auto px-4 rounded-3xl bg-black text-white" onClick={() => router.back()}>
                {t('backToShopping')}
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

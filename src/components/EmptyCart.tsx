import Icons from './Icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CartContext } from '@/context/cart-provider';
import Navbar from '@/components/Navbar';

export default function EmptyCart() {
  const { t } = useTranslation('checkout');

  const router = useRouter();

  const { restoreCart, cart } = useContext(CartContext);
  const cartID = typeof localStorage !== 'undefined' ? localStorage.getItem('plum-restore-cart-id') || false : false;

  return (
    <>
      <main className="flex h-screen w-full flex-col items-center justify-start bg-white">
        <Navbar />
        <section className="flex h-full flex-col items-center justify-between p-8 sm:justify-center">
          <span></span>
          <div className="mb-8 flex max-w-64 flex-col items-center justify-center text-center sm:max-w-sm">
            <Icons.basket className="mb-4 h-6 w-6" />
            <p className="text-lg uppercase sm:mb-2.5 sm:text-xl">{t('emptyCart')}</p>
            <p className="text-balance text-sm text-dark-gray sm:text-base">{t('emptyCartDescription')}</p>
          </div>
          {cart.id ? (
            <div className="flex w-full items-center justify-center gap-3">
              <button className="h-11 w-auto rounded-3xl bg-gray px-4 text-black" onClick={restoreCart}>
                {t('restoreCart')}
              </button>
              <button className="h-11 w-auto rounded-3xl bg-black px-4 text-white" onClick={() => router.back()}>
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-3">
              <button className="h-11 w-auto rounded-3xl bg-black px-4 text-white" onClick={() => router.back()}>
                {t('backToShopping')}
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

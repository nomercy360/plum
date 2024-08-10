import Icons from './Icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CartContext } from '@/context/cart-provider';
import { NavbarCart } from '@/components/Navbar';

export default function EmptyCart() {
  const { t } = useTranslation('checkout');

  const router = useRouter();

  const { restoreCart } = useContext(CartContext);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-start bg-white">
      <NavbarCart backButtonVisible={false} onBackButtonClick={() => router.back()} />
      <div className="flex h-full flex-col items-center justify-between p-8 sm:justify-center">
        <div></div>
        <div className="flex max-w-72 flex-col items-center justify-center text-center sm:max-w-sm">
          <Icons.emptyCart className="h-36 w-36" />
          <p className="-mt-12 text-lg sm:mb-2.5 sm:text-xl">{t('emptyCart')}</p>
          <p className="mb-8 text-sm sm:text-base">{t('emptyCartDescription')}</p>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <button className="mb-4 h-11 w-56 rounded-3xl bg-gray text-black" onClick={restoreCart}>
            {t('restoreCart')}
          </button>
          <button className="h-11 w-56 rounded-3xl bg-black text-white" onClick={() => router.back()}>
            {t('continueShopping')}
          </button>
        </div>
      </div>
    </main>
  );
}

import Icons from './Icons';
import { CartContext } from '@/context/cart-provider';
import { useContext, useEffect, useState } from 'react';
import Link from '@/components/Link';
// import LanguageSwitchLink from '@/components/LanguageSwitchButton';
import { useRouter } from 'next/router';
// import { step } from 'next/dist/experimental/testmode/playwright/step';
import BurgerMenu from './BurgerMenu';
import { useTranslation } from 'react-i18next';
// import { handleClientScriptLoad } from 'next/script';

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const [isDisplayMenu, setDisplayMenu] = useState(false);

  const handleDisplayBurgerMenu = () => {
    setDisplayMenu(prev => !prev);
  };

  useEffect(() => {
    if (isDisplayMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isDisplayMenu]);

  return (
    <header className="fixes top-0 flex w-full flex-row items-center justify-between bg-transparent p-5 text-base text-black">
      <button className="m-[5px] flex h-[20px] w-[20px] items-center justify-center" onClick={handleDisplayBurgerMenu}>
        {isDisplayMenu ? (
          <Icons.close className="h-6 w-32 text-black" />
        ) : (
          <>
            <Icons.menu className="h-6 w-32 text-black" />
          </>
        )}
      </button>
      <Link href="/">
        <Icons.logo className="h-6 w-32 text-black" />
      </Link>
      <div className="flex flex-row items-center justify-between gap-3">
        {/* <LanguageSwitchLink theme="light" /> */}
        <CartButton cartItems={cart.count} theme="light" />
      </div>
      <BurgerMenu display={isDisplayMenu} />
    </header>
  );
}

export function NavbarCart(props: { backButtonVisible: boolean; onBackButtonClick: (value: boolean) => void }) {
  const router = useRouter();
  const { t } = useTranslation(['checkout', 'common']);

  const close = async () => {
    await router.push('/');
  };

  return (
    <header className="flex h-14 w-full items-center justify-between bg-transparent px-4 text-base text-black sm:h-20 sm:px-7">
      <div className="flex-1">
        {props.backButtonVisible && (
          <button
            onClick={() => props.onBackButtonClick(false)}
            className="flex size-5 items-center justify-center rounded-full bg-black/5"
          >
            <Icons.chevronLeft className="size-5 shrink-0 text-black" />
          </button>
        )}
      </div>
      <Link href="/" className="flex justify-center text-center">
        <Icons.logo className="mx-auto h-6 w-32 text-black" />
        {<span className="ml-1 flex self-start text-[21px]">{t('checkoutName')}</span>}
      </Link>
      <div className="flex flex-1 justify-end">
        <button onClick={() => close()} className="flex size-5 items-center justify-center rounded-full bg-black/5">
          <Icons.xmark className="inline-block size-2.5 shrink-0 text-black" />
        </button>
      </div>
    </header>
  );
}

const CartButton = (props: { cartItems: number; theme: 'dark' | 'light' }) => {
  return (
    <Link href="/checkout" className="relative flex h-[30px] w-[30px] flex-row items-center justify-center gap-1">
      {props.cartItems > 0 && <span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-red"></span>}

      <Icons.basket className="h-6 w-32 text-black" />
      {props.cartItems > 0 && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-[11px] font-normal leading-[15px]">
          {props.cartItems}
        </span>
      )}
    </Link>
  );
};

import Icons from './Icons';
import { CartContext } from '@/context/cart-provider';
import { useContext, useEffect, useState } from 'react';
import Link from '@/components/Link';
// import LanguageSwitchLink from '@/components/LanguageSwitchButton';
import { useRouter } from 'next/router';
// import { step } from 'next/dist/experimental/testmode/playwright/step';
import BurgerMenu from './BurgerMenu';
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

  const goBack = async () => {
    await router.push('/');
  };

  return (
    <header className="flex w-full flex-row items-center justify-between bg-transparent p-5 text-base text-black">
      <Link href="/">
        <Icons.logo className="h-6 w-32 text-black" />
      </Link>
      <div className="flex flex-row items-center justify-between gap-3">
        {/* <LanguageSwitchLink theme="light" /> */}
        <button className="flex items-center justify-center" onClick={() => goBack()}>
          <Icons.close className="size-5 shrink-0" />
        </button>
      </div>
    </header>
  );
}

const CartButton = (props: { cartItems: number; theme: 'dark' | 'light' }) => {
  return (
    <Link href="/checkout" className="relative flex h-[30px] w-[30px] flex-row items-center justify-center gap-1">
      {props.cartItems > 0 && <span className="absolute right-0 top-1 h-2 w-2 rounded-full bg-red"></span>}

      <Icons.basket className="h-6 w-32 text-black" />
      {props.cartItems > 0 && (
        <span className="absolute left-1/2 top-1/2 mt-px -translate-x-1/2 -translate-y-1/2 transform pb-[2px] text-center font-bold">
          {props.cartItems}
        </span>
      )}
    </Link>
  );
};

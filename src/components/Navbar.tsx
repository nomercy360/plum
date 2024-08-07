import Icons from './Icons';
import { CartContext } from '@/context/cart-provider';
import { useContext } from 'react';
import Link from '@/components/Link';
import LanguageSwitchLink from '@/components/LanguageSwitchButton';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { cart } = useContext(CartContext);

  return (
    <nav className="fixes top-0 flex w-full flex-row items-center justify-between bg-transparent p-5 text-base text-black">
      <Link href="/">
        <Icons.logo className="h-6 w-32 text-black" />
      </Link>
      <div className="flex flex-row items-center justify-between gap-3">
        <LanguageSwitchLink theme="light" />
        <CartButton cartItems={cart.count} theme="light" />
      </div>
    </nav>
  );
}

export function NavbarCart() {
  const router = useRouter();

  const goBack = async () => {
    await router.push('/');
  };

  return (
    <nav className="flex h-14 w-full items-center justify-between bg-transparent px-4 text-base text-black sm:h-20 sm:px-7">
      <div className="flex-1"></div>
      <Link href="/" className="flex-1 justify-center">
        <Icons.logo className="mx-auto h-6 w-32 text-black" />
      </Link>
      <div className="flex flex-1 justify-end">
        <button className="flex size-5 items-center justify-center rounded-full bg-black" onClick={() => goBack()}>
          <Icons.close className="size-2.5 shrink-0 text-white" />
        </button>
      </div>
    </nav>
  );
}

const CartButton = (props: { cartItems: number; theme: 'dark' | 'light' }) => {
  return (
    <Link href="/checkout" className="flex flex-row items-center justify-start gap-1">
      <span className="text-base uppercase text-black">bag</span>
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-black text-xxs text-white">
        <span className="mt-px">{props.cartItems}</span>
      </div>
    </Link>
  );
};

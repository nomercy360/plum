import Icons from './Icons';
import { CartContext } from '@/context/cart-provider';
import { useContext } from 'react';
import Link from '@/components/Link';
import LanguageSwitchLink from '@/components/LanguageSwitchButton';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { cart } = useContext(CartContext);

  return (
    <nav
      className="p-5 flex w-full flex-row items-center justify-between bg-transparent text-base text-black">
      <Link href="/">
        <Icons.logo
          className="h-6 w-32 text-black"
        />
      </Link>
      <div className="flex flex-row items-center justify-between gap-3">
        <LanguageSwitchLink theme="light" />
        <CartButton cartItems={cart.count} theme="light" />
      </div>
    </nav>
  );
}

export function NavbarCart() {
  const { cart } = useContext(CartContext);

  const router = useRouter();

  return (
    <nav
      className="p-5 flex w-full flex-row items-center justify-between bg-transparent text-base text-black">
      <Link href="/">
        <Icons.logo
          className="h-6 w-32 text-black"
        />
      </Link>
      <div className="flex flex-row items-center justify-between gap-3">
        <LanguageSwitchLink theme="light" />
        <button className="items-center flex justify-center size-5 bg-black rounded-full"
                onClick={() => router.back()}>
          <Icons.close className="shrink-0 text-white size-2.5" />
        </button>
      </div>
    </nav>
  );
}


const CartButton = (props: { cartItems: number; theme: 'dark' | 'light' }) => {
  return (
    <Link href="/checkout" className="flex flex-row items-center justify-start gap-1">
      <span className="uppercase text-base text-black">bag</span>
      <div className="text-white flex justify-center items-center size-5 text-xxs bg-black rounded-full shrink-0">
        <span className="mt-px">
          {props.cartItems}
        </span>
      </div>
    </Link>
  );
};

import Icons from './Icons';
import { CartContext } from '@/context/cart-provider';
import { useContext } from 'react';
import Link from '@/components/Link';
import LanguageSwitchLink from '@/components/LanguageSwitchButton';

export default function Navbar() {
  const { cart } = useContext(CartContext);

  return (
    <div className="w-full">
      <nav
        className="flex h-16 w-full flex-row items-center justify-between bg-transparent p-6 text-base text-black">
        <Link href="/">
          <Icons.logo
            className="h-6 w-32 text-[#141414]"
          />
        </Link>
        <div className="flex flex-row items-center justify-between gap-3">
          <LanguageSwitchLink theme="light" />
          <Link className="py-1" href="/gift-card">
            <Icons.gift
              className="h-5 w-5 sm:h-5 sm:w-6 text-black"
            />
          </Link>
          <CartButton cartItems={cart.count} theme="light" />
        </div>
      </nav>
    </div>
  );
}

export function NavbarHome() {
  const { cart } = useContext(CartContext);

  return (
    <div className="w-full">
      <nav
        className="flex h-12 w-full flex-row items-center justify-between bg-transparent p-4 text-base text-white">
        <Link href="/">
          <Icons.logo
            className="h-6 w-32 text-white"
          />
        </Link>
        <div className="flex flex-row items-center justify-between gap-3">
          <LanguageSwitchLink theme="dark" />
          <Link className="py-1" href="/gift-card">
            <Icons.gift
              className="h-5 w-5 sm:h-5 sm:w-6 text-white"
            />
          </Link>
          <CartButton cartItems={cart.count} theme="dark" />
        </div>
      </nav>
    </div>
  );
}

const CartButton = (props: { cartItems: number; theme: 'dark' | 'light' }) => {
  return (
    <Link href="/checkout">
      <div className="relative flex sm:size-6 size-5 items-center justify-center">
        <span
          className={`absolute leading-none pt-px flex flex-row mx-auto -bottom-1 text-center left-0 size-3 sm:size-3.5 items-center justify-center rounded-full text-[8px] ${props.cartItems === 0 ? props.theme == 'light' ? 'bg-black text-white' : 'bg-white text-black' : 'bg-violet text-white'}`}
        >
          {props.cartItems}
        </span>
        <Icons.cart
          className={`size-5 sm:size-6 ${props.theme === 'dark' ? 'text-white' : 'text-black'}`} />
      </div>
    </Link>
  );
};

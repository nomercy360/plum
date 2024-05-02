import Icons from './Icons';
import { CartContext } from '@/context/cart-provider';
import { useContext } from 'react';
import Link from '@/components/Link';
import LanguageSwitchLink from '@/components/LanguageSwitchButton';

export default function Navbar(props: { theme: 'dark' | 'light' }) {
  const { getCartTotal } = useContext(CartContext);

  return (
    <div className="w-full">
      <nav
        className={`flex h-14 w-full flex-row items-center justify-between bg-transparent p-6 text-base ${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <Link href="/">
          <Icons.logo
            className={`h-6 w-32 ${props.theme === 'dark' ? 'text-white' : 'fill-black stroke-black'}`}
          />
        </Link>
        <div className="flex flex-row items-center justify-between gap-3">
          <LanguageSwitchLink theme={props.theme} />
          <Link className="py-1" href="/gift-card">
            <Icons.gift
              className={`h-5 w-5 sm:h-5 sm:w-6 ${props.theme === 'dark' ? 'text-white' : 'text-black'}`}
            />
          </Link>
          <CartButton cartItems={getCartTotal()} theme={props.theme} />
        </div>
      </nav>
    </div>
  );
}

const CartButton = (props: { cartItems: number; theme: 'dark' | 'light' }) => {
  return (
    <Link href="/checkout">
      <div className="relative flex h-5 w-5 items-center justify-center sm:h-5 sm:w-6">
        <span
          className={`absolute -bottom-1 left-0 flex size-3 items-center justify-center rounded-full text-[8px] text-white ${props.cartItems === 0 ? 'bg-button' : 'bg-violet'}`}
        >
          {props.cartItems}
        </span>
        <Icons.cart
          className={`h-5 w-5 sm:h-5 sm:w-6 ${props.theme === 'dark' ? 'text-white' : 'text-black'}`} />
      </div>
    </Link>
  );
};

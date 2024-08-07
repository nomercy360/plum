import Icons from './Icons';
import { CartContext } from '@/context/cart-provider';
import { useContext, useEffect, useState } from 'react';
import Link from '@/components/Link';
import LanguageSwitchLink from '@/components/LanguageSwitchButton';
import { useRouter } from 'next/router';
import BurgerMenu from './BurgerMenu';
import { handleClientScriptLoad } from 'next/script';

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const [isDisplayMenu, setDisplayMenu] = useState(false);

  const handleDisplayBurgerMenu = () => {
    setDisplayMenu(prev => !prev)


  }

  useEffect(() => {
    if (isDisplayMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }


  }, [isDisplayMenu])

  return (
    <header
      className="top-0 fixes p-5 flex w-full flex-row items-center justify-between bg-transparent text-base text-black">
      <button
        className='w-[20px] h-[20px] m-[5px] flex justify-center items-center'
        onClick={handleDisplayBurgerMenu}
      >
        {/* <Icons.menu
          className="h-6 w-32 text-black"
        /> */}
        {
          isDisplayMenu ? (
            <Icons.close
              className="h-6 w-32 text-black"
            />
          ) : (
            <>
              <Icons.menu
                className="h-6 w-32 text-black"
              />
              {/* <span className='block w-[20px] h-[2px] bg-black rounded-sm absolute translate-y-1'></span>
              <span className='block w-[20px] h-[2px] bg-black rounded-sm absolute translate-y--1'></span> */}
            </>
          )
        }

      </button>
      <Link href="/">
        <Icons.logo
          className="h-6 w-32 text-black"
        />
      </Link>
      <div className="flex flex-row items-center justify-between gap-3">
        {/* <LanguageSwitchLink theme="light" /> */}
        <CartButton cartItems={cart.count} theme="light" />
      </div>
      <BurgerMenu display={isDisplayMenu} />
    </header>
  );
}

export function NavbarCart() {
  const { cart } = useContext(CartContext);

  const router = useRouter();

  const goBack = async () => {
    await router.push('/');
  };

  return (
    <header
      className="p-5 flex w-full flex-row items-center justify-between bg-transparent text-base text-black bg-white">
      <Link href="/">
        <Icons.logo
          className="h-6 w-32 text-black"
        />
      </Link>
      <div className="flex flex-row items-center justify-between gap-3">
        {/* <LanguageSwitchLink theme="light" /> */}
        <button className="items-center flex justify-center size-5 bg-black rounded-full"
          onClick={() => goBack()}>
          <Icons.close className="shrink-0 text-white size-2.5" />
        </button>
      </div>
    </header>
  );
}


const CartButton = (props: { cartItems: number; theme: 'dark' | 'light' }) => {
  return (
    <Link href="/checkout" className="flex flex-row items-center justify-center gap-1 relative w-[30px] h-[30px]">
      {
        props.cartItems > 0 &&
        <span className='bg-red rounded-full w-2 h-2 absolute top-1 right-0'></span>
      }

      <Icons.basket
        className="h-6 w-32 text-black"
      />
      {
        props.cartItems > 0 &&
        <span className="mt-px text-center absolute pb-[2px] font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {props.cartItems}
        </span>
      }
    </Link >
  );
};

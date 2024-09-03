import { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import clsx from 'clsx';
import style from './burgerMenu.module.css';
import { CartContext } from '@/context/cart-provider';

type IPropsBurgerMenu = {
  display: boolean;
};

export default function BurgerMenu({ display }: IPropsBurgerMenu) {
  const { t } = useTranslation('common');

  const { currency, updateCurrency } = useContext(CartContext);

  const handelCurrencySelect = (currency: string) => {
    console.log(currency);
    updateCurrency(currency as 'USD' | 'BYN');
  };

  const burgerMenuClasses = clsx(
    'w-full h-[calc(100%-65px)] mt-[65px] flex flex-col items-center justify-between p-8 bg-white fixed top-0 z-50 transition-opacity duration-300 ease-in-out',
    {
      'opacity-100': display,
      'opacity-0 pointer-events-none': !display,
    },
  );

  return (
    <div className={burgerMenuClasses}>
      <span></span>
      <nav>
        <ul className="flex flex-col gap-5">
          {navList.map((item, i) => (
            <li key={i} className="flex items-center">
              <Link href={item.href} className="w-full text-center text-xl">
                {t(item.name)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="max-w-[450px]">
        <ul className="mb-5 flex justify-center gap-2">
          {currencyList.map((item, i) => (
            <li key={i}>
              <label>
                <input
                  className={`invisible absolute -m-px h-px w-px overflow-hidden border-0 p-0 ${style.radio}`}
                  type="radio"
                  name="currency"
                  value={item.currency}
                  defaultChecked={currency === item.currency}
                  onChange={() => handelCurrencySelect(item.currency)}
                />
                <span
                  className={`inline-block min-h-9 w-auto rounded-3xl bg-gray px-3 py-2 text-xs leading-snug text-gray-light ${style.check}`}
                >
                  {item.currency + ' ' + item.symbol}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-balance text-center text-sm text-gray-light">{t('warningPayment')}</p>
      </div>
    </div>
  );
}

const navList = [
  {
    href: '/',
    name: 'shop',
  },
  // {
  //   href: '/archive',
  //   name: 'archive',
  // },
  {
    href: 'https://instagram.com/plumplum.co',
    name: 'instagram',
  },
  {
    href: '/about',
    name: 'contacts',
  },
];

const currencyList = [
  {
    currency: 'USD',
    symbol: '$',
  },
  {
    currency: 'BYN',
    symbol: 'byn',
  },
];

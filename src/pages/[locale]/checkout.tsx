import Icons from '@/components/Icons';
import Divider from '@/components/Divider';
import EmptyCart from '@/components/EmptyCart';
import StepperButton from '@/components/StepperButton';
import { useContext, useEffect, useState } from 'react';
import { Cart, CartContext, CartItem } from '@/context/cart-provider';
import { useTranslation } from 'next-i18next';
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic';
import { useRouter } from 'next/router';
import ExportedImage from 'next-image-export-optimizer';
import { LocaleContext } from '@/context/locale-provider';
import Link from '@/components/Link';

import countries from '@/lib/countries.json';
import { sendGTMEvent } from '@next/third-parties/google';
import { NavbarCart } from '@/components/Navbar';
import Head from 'next/head';

type Measurements = {
  height?: string;
  sleeve?: string;
  waist?: string;
  chest?: string;
  hips?: string;
};

export const cartItemsToGTM = (items: CartItem[]) => {
  return items.map(item => {
    return {
      item_id: item.id,
      item_name: item.product_name,
      item_category: 'Dresses',
      item_brand: 'Plum',
      price: item.price,
      quantity: item.quantity,
    };
  });
};

async function checkoutRequest(data: any, locale: string = 'en') {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 201) {
    return response.json();
  } else {
    throw new Error('Error fetching checkout');
  }
}

const priceString = (currencySymbol: string, price: number) =>
  currencySymbol === '$' ? `$${price}` : `${price} ${currencySymbol}`;

const priceTotalString = (currencySymbol: string, price: number) => {
  const formattedNumber = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currencySymbol === '$' ? `$${formattedNumber}` : `${formattedNumber} ${currencySymbol}`;
}

export default function Checkout() {
  const { cart, getCartItems, clearCart, updateCartItem, applyDiscount } = useContext(CartContext);

  const { currentLanguage } = useContext(LocaleContext);

  const { t } = useTranslation(['checkout', 'common']);

  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'success' | 'error' | 'idle' | 'fetching'>('idle');

  const fetchDiscount = async () => {
    setPromoStatus('fetching');
    try {
      await applyDiscount(promoCode);
      setPromoStatus('success');
    } catch (e) {
      setPromoStatus('error');
    }
  };

  const updatePromoCode = (value: string) => {
    setPromoCode(value);
    setPromoStatus('idle');
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');


  const [step, setStep] = useState<'bag' | 'deliveryInfo' | 'measurements'>('bag');

  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValid = name !== '' && address !== '' && country !== '' && zip !== '' && phone !== '' && isValidEmail;

    setIsFormValid(isValid);
  }, [name, email, address, country, zip, phone]);

  useEffect(() => {
    if (cart.count > 0) {
      window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
          currency: cart.currency_code,
          items: cartItemsToGTM(cart.items),
        },
      });
    }
  }, [cart]);

  async function toDeliveryInfo() {
    setStep('deliveryInfo');
  }

  const placeOrder = async () => {
    setIsFormLoading(true);

    const order = {
      name,
      email,
      address,
      country,
      zip,
      phone,
      provider: 'bepaid',
      cart_id: cart.id,
      metadata: {
        measurements,
      },
    };

    const resp = await checkoutRequest(order, currentLanguage);
    // get payment_link and redirect to it in new tab

    window.dataLayer.push({
      event: 'add_payment_info',
      payment_type: 'Credit Card',
      ecommerce: {
        currency: cart.currency_code,
        items: cartItemsToGTM(cart.items),
      },
    });

    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: cart.currency_code,
        items: cartItemsToGTM(cart.items),
      },
    });

    setIsFormLoading(false);

    window.location.href = resp.payment_link;
  };

  const [measurements, setMeasurements] = useState<Measurements>({} as Measurements);

  const updateMeasurements = (key: string, value: string) => {
    setMeasurements(prev => ({ ...prev, [key]: value }));
  };

  const afterMeasurements = (save: boolean) => {
    if (!save) {
      setMeasurements({
        height: '',
        sleeve: '',
        waist: '',
        chest: '',
        hips: '',
      });
    }

    setStep('bag');
  };

  const isMeasurementsFilled = () => {
    return Object.values(measurements).some(value => value !== '');
  };

  function getWordEnding(count: number) {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'товар';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return 'товара';
    } else {
      return 'товаров';
    }
  }

  function getTranslation(key: string, count: number) {
    const translation = t(key, { total: count });
    const ending = getWordEnding(count);
    return translation.replace('{{ending}}', ending);
  }

  function decreaseQuantity(product: CartItem) {
    const item = cart.items.find(item => item.variant_id === product.variant_id);

    if (item) {
      updateCartItem(product.id, item.quantity - 1);
      // push to gtm
      window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          currency: cart.currency_code,
          items: [
            {
              item_id: product.id,
              item_name: product.product_name,
              item_category: 'Dresses',
              item_brand: 'Plum',
              price: product.price,
              quantity: 1,
            },
          ],
        },
      });
    }
  }

  function increaseQuantity(product: CartItem) {
    const item = cart.items.find(item => item.variant_id === product.variant_id);

    if (item) {
      updateCartItem(product.id, item.quantity + 1);
      // push to gtm
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: cart.currency_code,
          items: [
            {
              item_id: product.id,
              item_name: product.product_name,
              item_category: 'Dresses',
              item_brand: 'Plum',
              price: product.price,
              quantity: 1,
            },
          ],
        },
      });
    }
  }

  const clearPromoCode = () => {
    setPromoCode('');
    setPromoStatus('idle');
  };

  return (
    <>
      <Head>
        <meta name="og:title" content="Checkout | PLUM®" />
        <meta name="og:description" content="Dresses & things" />
        <meta name="og:image" content="https://plumplum.co/images/og.png" />
        <meta name="description" content="Dresses & things" />
      </Head>
      <div className="bg-gray sm:min-h-screen">
        {cart.count > 0 ? (
          <div>
            <NavbarCart />
            <main className="w-full min-h-[calc(100dvh-102px)] mt-2 sm:mt-8 flex items-start justify-center">
              <div
                className="flex w-full max-w-2xl flex-col bg-white rounded-t-xl">
                {step == 'bag' && (
                  <div className="flex min-h-[calc(100dvh-102px)] w-full flex-col justify-between sm:justify-start">
                    <div className='px-5 pt-5 mb-8'>
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-sm uppercase">{priceString(cart.currency_symbol, cart.total)} {getTranslation('yourBag', cart.count)}</p>
                        <button className="h-8 text-gray-light text-sm" onClick={() => clearCart()}>
                          {t('clearCart')}
                        </button>
                      </div>
                      <div className="mt-7 flex flex-col gap-y-5">
                        <ul className='flex flex-col gap-y-5'>
                          {getCartItems().map(item => (
                            <li key={item.variant_id} className="flex flex-row items-center justify-between gap-y-5">
                              <div className="flex flex-row items-center gap-3">
                                <ExportedImage
                                  alt=""
                                  className="size-10 shrink-0 rounded-full object-cover"
                                  src={item.image_url}
                                  width={40}
                                  height={40}
                                />
                                <div className="flex flex-col">
                                  <p className="text-sm sm:text-base">
                                    {item.product_name}
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-light sm:text-sm">
                                    {priceString(cart.currency_symbol, item.price * item.quantity)}{' / '}
                                    {t('size')}: {`(${item.variant_name})`}{' '} {item.quantity > 1 && `x ${item.quantity}`}
                                  </p>
                                </div>
                              </div>
                              <StepperButton
                                onIncrease={() => increaseQuantity(item)}
                                onDecrease={() => decreaseQuantity(item)}
                              />
                            </li>
                          ))}
                        </ul>
                        <div className='flex flex-col gap-y-5'>
                          <button
                            className="flex flex-row items-center justify-between text-start"
                            onClick={() => setStep('measurements')}
                          >
                            <div className="flex flex-row items-center justify-start gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray">
                                <Icons.tShirt className="size-6" />
                              </div>
                              <div>
                                <p className="text-sm sm:text-base">
                                  {isMeasurementsFilled() ? t('measurementsAdded') : t('addMeasurements')}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-light">
                                  {isMeasurementsFilled()
                                    ? t('measurementsAddedDescription')
                                    : t('addMeasurementsDescription')}
                                </p>
                              </div>
                            </div>
                            <div className="flex h-10 items-center justify-center px-2">
                              <Icons.arrowRight className="h-3 w-2.5" />
                            </div>
                          </button>
                          <div
                            className="flex flex-row items-center justify-between text-start"
                          >
                            <div className="flex flex-row items-center justify-start gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray">
                                <Icons.shippingBox className="size-6" />
                              </div>
                              <div>
                                <p className="text-sm sm:text-base">
                                  {t('worldwideShipping')}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-light">
                                  {t('worldwideShippingDescription')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Divider></Divider>
                    <div
                      className="mt-8 mb-20 flex  w-full flex-col justify-between gap-5 px-5">
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 placeholder:text-dark-gray focus:outline-neutral-200"
                        placeholder={t('email')}
                        type="email"
                        autoComplete="email"
                        value={email}
                        onInput={e => setEmail(e.currentTarget.value)}
                      />
                      <PromoCode
                        promoCode={promoCode}
                        setPromoCode={(value: string) => updatePromoCode(value)}
                        fetchDiscount={fetchDiscount}
                        fetchStatus={promoStatus}
                        clearPromoCode={clearPromoCode}
                      />
                    </div>
                    <div className='flex flex-col-reverse items-center gap-5 sm:flex-col mt-auto'>
                      <button
                        className='h-auto sm:h-11 p-5 min-w-full sm:min-w-64 flex justify-center sm:justify-between items-center px-4 rounded-none sm:rounded-3xl  text-white bg-black disabled:cursor-not-allowed disabled:bg-black/60'
                        onClick={() => toDeliveryInfo()}
                        disabled={email.length <= 0}
                      >
                        {t('continue')}
                        <span className='block sm:hidden'>&nbsp;•&nbsp;</span>
                        <span className="text-gray">{priceTotalString(cart.currency_symbol, cart.total)}</span>
                      </button>
                      <div className="flex w-full flex-row justify-center items-center gap-2 mb-0 sm:mb-5 px-5">
                        <p className="text-xxs text-gray-light text-center">{t('agree')}</p>
                        <Link href="/terms" className='w-[20px] h-[20px] flex justify-center items-center'>
                          <Icons.infoCircle className="size-3.5 shrink-0" />
                        </Link>
                      </div>
                      {/* <TotalCostInfo measurementFilled={isMeasurementsFilled()} t={t} cart={cart} /> */}
                    </div>
                  </div>
                )}
                {step == 'deliveryInfo' && (
                  <div
                    className="flex flex-col items-center rounded-t-xl bg-white pb-10 text-center sm:items-start sm:text-start">
                    <p className="mb-2 px-5 pt-5 text-lg text-black sm:text-xl">{t('addDeliveryInfo')}</p>
                    <p className="mb-8 px-5 text-sm leading-snug text-gray-light">{t('addDeliveryInfoDescription')}</p>
                    <form
                      className="mb-8 flex w-full flex-col gap-4 px-5"
                      onSubmit={e => {
                        e.preventDefault();
                        placeOrder();
                      }}
                    >
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('name')}
                        autoFocus
                        type="text"
                        autoComplete="name"
                        value={name}
                        onInput={e => setName(e.currentTarget.value)}
                      />
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('email')}
                        type="email"
                        autoComplete="email"
                        value={email}
                        onInput={e => setEmail(e.currentTarget.value)}
                      />
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        type="tel"
                        autoComplete="tel"
                        placeholder={t('phone')}
                        value={phone}
                        onInput={e => setPhone(e.currentTarget.value)}
                      />
                      <div className="flex w-full flex-row items-center justify-start rounded-lg bg-gray">
                        <select
                          className="h-11 w-full bg-transparent px-3 text-sm focus:outline-neutral-200 sm:text-base"
                          onChange={e => setCountry(e.currentTarget.value)}
                          value={country}
                        >
                          <option value="">{t('country')}</option>
                          {countries.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex w-full flex-row items-center justify-start rounded-lg bg-gray">
                        <input
                          type="text"
                          autoComplete="street-address"
                          className="h-11 w-full bg-transparent px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                          placeholder={t('address')}
                          onInput={e => setAddress(e.currentTarget.value)}
                        />
                        <div className="h-8 w-0.5 bg-dark-gray"></div>
                        <input
                          type="text"
                          autoComplete="postal-code"
                          className="h-11 w-24 bg-transparent px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                          placeholder={t('zip')}
                          onInput={e => setZip(e.currentTarget.value)}
                        />
                      </div>
                    </form>
                    <Divider></Divider>
                    <div className="flex w-full flex-col items-center">
                      <TotalCostInfo measurementFilled={isMeasurementsFilled()} t={t} cart={cart} />
                      <div className="mt-10 flex w-full flex-row items-center justify-center px-5 sm:justify-between">
                        <button
                          className="hidden h-11 w-24 rounded-3xl bg-gray text-black sm:block"
                          onClick={() => setStep('bag')}
                        >
                          {t('back')}
                        </button>
                        <button
                          className={`h-11 w-56 flex-shrink-0 rounded-3xl bg-black text-white disabled:cursor-not-allowed disabled:bg-black/60`}
                          disabled={!isFormValid || isFormLoading}
                          onClick={() => placeOrder()}
                        >
                          {t('checkout')}{' '}
                          <span className="text-gray">{priceString(cart.currency_symbol, cart.total)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step == 'measurements' && (
                  <div
                    className="flex flex-col items-center rounded-t-xl bg-white px-5 pt-5 text-center sm:items-start sm:text-start">
                    <p className="mb-2 text-lg text-black sm:text-xl">{t('addMeasurements')}</p>
                    <p className="mb-8 max-w-xs text-sm leading-snug text-gray-light sm:max-w-4xl">
                      {t('addMeasurementsDescription2')}
                    </p>
                    <div className="mb-8 flex w-full flex-col gap-4">
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('height')}
                        type="number"
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        value={measurements.height}
                        onInput={e => updateMeasurements('height', e.currentTarget.value)}
                      />
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('sleeve')}
                        type="number"
                        autoComplete="off"
                        autoCorrect="off"
                        value={measurements.sleeve}
                        onInput={e => updateMeasurements('sleeve', e.currentTarget.value)}
                      />
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('waist')}
                        type="number"
                        autoComplete="off"
                        autoCorrect="off"
                        value={measurements.waist}
                        onInput={e => updateMeasurements('waist', e.currentTarget.value)}
                      />
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('chest')}
                        type="number"
                        autoComplete="off"
                        autoCorrect="off"
                        value={measurements.chest}
                        onInput={e => updateMeasurements('chest', e.currentTarget.value)}
                      />
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('hips')}
                        type="number"
                        autoComplete="off"
                        autoCorrect="off"
                        value={measurements.hips}
                        onInput={e => updateMeasurements('hips', e.currentTarget.value)}
                      />
                    </div>
                    <div
                      className="mt-10 flex w-full max-w-[220px] flex-col items-center justify-between gap-4 sm:max-w-none sm:flex-row sm:gap-0">
                      <button
                        className="h-11 w-full rounded-3xl bg-gray text-black sm:w-24"
                        onClick={() => afterMeasurements(false)}
                      >
                        {t('skip')}
                      </button>
                      <button
                        className="h-11 w-full flex-shrink-0 rounded-3xl bg-black text-white sm:w-56"
                        onClick={() => afterMeasurements(true)}
                      >
                        {t('saveMeasurements')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div >
        ) : (
          <EmptyCart />
        )
        }
      </div >
    </>
  );
}

const PromoCode = (props: {
  promoCode: string;
  setPromoCode: (value: string) => void;
  fetchDiscount: () => void;
  fetchStatus: 'success' | 'error' | 'idle' | 'fetching';
  clearPromoCode: () => void;
}) => {
  const { t } = useTranslation('checkout');
  const { cart, applyDiscount } = useContext(CartContext);

  return (
    <>
      {!cart.discount ? (
        <form className='relative'>
          {props.fetchStatus === 'error' && <p className="pt-1 text-sm text-red">{t('invalidPromoCode')}</p>}
          <div
            className={`flex h-11 w-full flex-row items-center justify-between rounded-lg bg-gray ${props.fetchStatus === 'error' ? 'border border-red' : ''}`}
          >
            <input
              className="h-11 w-full rounded-lg bg-gray pl-3 pr-24 placeholder:text-dark-gray focus:outline-neutral-200"
              placeholder={t('addPromoCode')}
              type="text"
              value={props.promoCode}
              onInput={e => props.setPromoCode(e.currentTarget.value)}
            />
            {props.fetchStatus === 'idle' ? (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 flex justify-center items-center px-3 py-1 rounded-2xl uppercase bg-black text-white tracking-[1px] leading-[inherit] text-xs" onClick={() => props.fetchDiscount()}>
                {t('apply')}
              </button>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center">
                {props.fetchStatus === 'fetching' ? (
                  <SpinnerLoader />
                ) : (
                  <button onClick={() => props.clearPromoCode()} className="flex size-11 items-center justify-center">
                    <Icons.close className="size-4 shrink-0 text-red" />
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="flex h-11 w-full flex-row items-center justify-between rounded-lg bg-light-green/10 px-3">
          <div className="flex flex-row items-center justify-start gap-2.5">
            <Icons.check className="size-4 fill-light-green text-light-green" />
            <p className="text-sm text-light-green">
              {cart.discount.value}% {t('discountApplied')}
            </p>
          </div>
          <button className="text-light-green" onClick={() => applyDiscount('')}>
            <Icons.close className="size-4 fill-light-green" />
          </button>
        </div>
      )}
    </>
  );
};

function SpinnerLoader() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="h-8 w-8 animate-spin fill-black text-gray"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

const TotalCostInfo = (props: { measurementFilled: boolean; t: any; cart: Cart }) => {
  const [shippingCost, setShippingCost] = useState(10);

  useEffect(() => {
    if (props.cart.currency_symbol === 'BYN') {
      setShippingCost(25);
    } else {
      setShippingCost(10);
    }
  }, [props.cart.currency_symbol]);

  return (
    <div className="flex w-full flex-col gap-3 px-5">
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">{props.t('subtotal')}</p>
        <p className="text-sm text-gray-light sm:text-base">
          {priceString(props.cart.currency_symbol, props.cart.subtotal)}
        </p>
      </div>
      {props.cart.discount_amount > 0 && (
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-sm text-gray-light sm:text-base">{props.t('discount')}</p>
          <p className="text-sm text-gray-light sm:text-base">
            -{props.cart.discount_amount}
            {props.cart.currency_symbol} ({props.cart.discount?.value}%)
          </p>
        </div>
      )}
      {props.measurementFilled && (
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-sm text-gray-light sm:text-base">{props.t('customTailoring')}</p>
          <p className="text-sm text-gray-light sm:text-base">{props.t('free')}</p>
        </div>
      )}
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">{props.t('worldwide')}</p>
        <p className="text-sm text-gray-light sm:text-base">
          {props.t('approx')}
          {': '}
          {priceString(props.cart.currency_symbol, shippingCost)}
        </p>
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <p className="text-base text-black sm:text-lg">{props.t('total')}</p>
        <p className="text-base text-black sm:text-lg">{priceString(props.cart.currency_symbol, props.cart.total)}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-start text-xs text-gray-light sm:text-center">{props.t('agree')}</p>
        <Link href="/terms">
          <Icons.infoCircle className="size-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

const getStaticProps = makeStaticProps(['checkout', 'common']);

export { getStaticPaths, getStaticProps };
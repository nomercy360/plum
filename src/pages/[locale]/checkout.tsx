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

export default function Checkout() {
  const { cart, getCartItems, clearCart, updateCartItem, applyDiscount, saveCartCustomer } = useContext(CartContext);

  const { currentLanguage } = useContext(LocaleContext);

  const { t } = useTranslation(['checkout', 'common']);

  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'error' | 'idle' | 'fetching'>('idle');

  const fetchDiscount = async () => {
    setPromoStatus('fetching');
    try {
      await applyDiscount(promoCode);
      setPromoStatus('idle');
    } catch (e) {
      setPromoStatus('error');
    }
  };

  const updatePromoCode = (value: string) => {
    setPromoCode(value);
    setPromoStatus('idle');
  };

  const [email, setEmail] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'bepaid' | 'paypal'>('paypal');

  const [checkoutData, setCheckoutData] = useState({
    name: '',
    address: '',
    country: '',
    zip: '',
    phone: '',
    comment: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCheckoutData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [step, setStep] = useState<'bag' | 'deliveryInfo'>('bag');

  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const isValid =
      checkoutData.name !== '' &&
      checkoutData.address !== '' &&
      checkoutData.country !== '' &&
      checkoutData.zip !== '' &&
      checkoutData.phone !== '';
    setIsFormValid(isValid);
  }, [checkoutData]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

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

  useEffect(() => {
    if (cart.customer && cart.customer.email) {
      setEmail(cart.customer.email || '');
      setCheckoutData(prevState => ({
        ...prevState,
        name: cart.customer!.name || '',
        address: cart.customer!.address || '',
        country: cart.customer!.country || '',
        zip: cart.customer!.zip || '',
        phone: cart.customer!.phone || '',
      }));
    }
  }, [cart.customer]);

  async function toDeliveryInfo() {
    // update cart with email
    saveCartCustomer(email);
    setStep('deliveryInfo');
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.bepaid.by/widget/be_gateway.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payment = function(token: string, order: any, language: string, currency: string) {
    const params = {
      checkout_url: 'https://checkout.bepaid.by',
      token: token,
      checkout: {
        iframe: true,
        test: false,
        transaction_type: 'payment',
        order: {
          amount: 100 * order.total,
          currency: currency,
          description: JSON.stringify(order.items),
          tracking_id: order.id,
        },
        settings: {
          language: language,
          style: {
            widget: {
              backgroundColor: '#262626',
              buttonsColor: '#262626',
              backgroundType: 2,
            },
          },
        },
      },
      closeWidget: function(status: any) {
        console.debug('close widget callback');
      },
    };

    return new window.BeGateway(params).createWidget();
  };

  const placeOrder = async () => {
    try {
      setIsFormLoading(true);
      const order = {
        email,
        provider: 'bepaid',
        cart_id: cart.id,
        customer_id: cart.customer?.id,
        ...checkoutData,
      };

      const resp = await checkoutRequest(order, currentLanguage);
      // get payment_link and redirect to it in new tab
      window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: cart.currency_code,
          items: cartItemsToGTM(cart.items),
        },
      });

      const url = new URL(resp.payment_link);
      const params = new URLSearchParams(url.search);
      const token = params.get('token');

      if (token) {
        payment(token, resp.order, currentLanguage, 'BYN');
      }
      // window.location.href = resp.payment_link;
      // window.open(resp.payment_link, '_blank');
    } catch (error) {
      setIsFormLoading(false);
      console.error('Error placing order:', error);
    } finally {
      setIsFormLoading(false);
    }
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
      <div className="h-full min-h-screen overflow-x-hidden bg-gray">
        {cart.count > 0 ? (
          <div>
            <NavbarCart backButtonVisible={step === 'deliveryInfo'} onBackButtonClick={() => setStep('bag')} />
            <main className="mt-8 flex w-full items-start justify-center bg-transparent">
              {step == 'bag' && (
                <div
                  className="flex min-h-[calc(100vh-112px)] w-full max-w-2xl flex-col items-center justify-between bg-white pb-10 sm:rounded-t-xl">
                  <div className="w-full">
                    <div className="flex flex-row items-center justify-between px-5 pt-5">
                      <p className="text-lg uppercase sm:text-xl">
                        {priceString(cart.currency_symbol, cart.total)} {getTranslation('yourBag', cart.count)}
                      </p>
                      <button className="h-8 text-gray-light" onClick={() => clearCart()}>
                        {t('clearCart')}
                      </button>
                    </div>
                    <div className="mt-8 flex flex-col gap-5 px-5 pb-5 sm:pb-10">
                      {getCartItems().map(item => (
                        <div key={item.variant_id} className="flex flex-row items-center justify-between gap-3">
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
                                {item.product_name} {`(${item.variant_name})`}{' '}
                                {item.quantity > 1 && `x ${item.quantity}`}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-light sm:text-sm">
                                Total {priceString(cart.currency_symbol, item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                          <StepperButton
                            onIncrease={() => increaseQuantity(item)}
                            onDecrease={() => decreaseQuantity(item)}
                          />
                        </div>
                      ))}
                      <div className="flex flex-row items-center justify-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray">
                          <Icons.tShirt className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base">{t('worldwideShipping')}</p>
                          <p className="mt-0.5 text-xs text-gray-light">{t('worldwideShippingDescription')}</p>
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray">
                          <Icons.box className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base">{t('worldwideShipping')}</p>
                          <p className="mt-0.5 text-xs text-gray-light">{t('worldwideShippingDescription')}</p>
                        </div>
                      </div>
                    </div>
                    <Divider></Divider>
                    <div className="mt-8 flex w-full flex-col items-center gap-4 px-5">
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('email')}
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.currentTarget.value)}
                      />
                      <PromoCode
                        promoCode={promoCode}
                        setPromoCode={(value: string) => updatePromoCode(value)}
                        fetchDiscount={fetchDiscount}
                        fetchStatus={promoStatus}
                        clearPromoCode={clearPromoCode}
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex w-full flex-col items-center justify-center gap-5 text-center sm:max-w-md">
                    <button
                      className="absolute bottom-0 flex h-24 w-full flex-row items-start justify-center gap-1 bg-black px-4 pt-5 text-white disabled:cursor-not-allowed disabled:opacity-35 sm:static sm:h-11 sm:w-[280px] sm:items-center sm:justify-between sm:rounded-3xl sm:pt-0"
                      onClick={() => toDeliveryInfo()}
                      disabled={!isEmailValid}
                    >
                      {t('continue')}
                      <span className="text-gray">{priceString(cart.currency_symbol, cart.total)}</span>
                    </button>
                    <TermsAndConditions />
                  </div>
                </div>
              )}
              {step == 'deliveryInfo' && (
                <div
                  className="flex min-h-[calc(100vh-112px)] w-full max-w-2xl flex-col items-start justify-between bg-white pb-10 text-start sm:rounded-t-xl">
                  <p className="mb-1 px-5 pt-5 uppercase text-black">{t('addDeliveryInfo')}</p>
                  <p className="mb-8 px-5 text-xs leading-snug text-gray-light">{t('addDeliveryInfoDescription')}</p>
                  <form
                    className="mb-8 flex w-full flex-col gap-4 px-5"
                    onSubmit={e => {
                      e.preventDefault();
                      placeOrder();
                    }}
                  >
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                      type="tel"
                      autoComplete="tel"
                      placeholder={t('phone')}
                      value={checkoutData.phone}
                      onChange={handleChange}
                      name="phone"
                    />
                    <div className="flex w-full flex-row gap-4">
                      <div className="flex w-full flex-row items-center justify-start rounded-lg bg-gray">
                        <select
                          className="h-11 w-full bg-transparent px-3 text-sm focus:outline-neutral-200 sm:text-base"
                          onChange={e => setCheckoutData({ ...checkoutData, country: e.currentTarget.value })}
                          value={checkoutData.country}
                        >
                          <option value="">{t('country')}</option>
                          {countries.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        className="h-11 w-40 rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('zip')}
                        autoFocus
                        type="text"
                        autoComplete="postal-code"
                        value={checkoutData.zip}
                        name="zip"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex w-full flex-row items-center justify-start rounded-lg bg-gray">
                      <input
                        type="text"
                        autoComplete="street-address"
                        className="h-11 w-full bg-transparent px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('address')}
                        value={checkoutData.address}
                        name="address"
                        onChange={handleChange}
                      />
                    </div>
                    <input
                      className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                      placeholder={t('name')}
                      autoFocus
                      type="text"
                      autoComplete="name"
                      value={checkoutData.name}
                      name="name"
                      onChange={handleChange}
                    />
                    <label>
                      <input
                        className="h-11 w-full rounded-lg bg-gray px-3 text-sm placeholder:text-dark-gray focus:outline-neutral-200 sm:text-base"
                        placeholder={t('comment')}
                        autoFocus
                        type="text"
                        autoComplete="off"
                        value={checkoutData.comment}
                        name="comment"
                        onChange={handleChange}
                      />
                      <p className="pt-1 text-xs text-gray-light">{t('commentDescription')}</p>
                    </label>
                  </form>
                  <p className="mb-1 px-5 uppercase text-black">{t('paymentMethod')}</p>
                  <p className="mb-5 px-5 text-sm leading-snug text-gray-light">{t('paymentMethodDescription')}</p>
                  <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                  <Divider></Divider>
                  <div className="flex w-full flex-col items-center">
                    <TotalCostInfo cart={cart} />
                    <button
                      className="fixed bottom-0 flex h-24 w-full flex-row items-start justify-center gap-1 bg-black px-4 pt-5 text-white disabled:cursor-not-allowed disabled:opacity-35 sm:static sm:h-11 sm:w-[280px] sm:items-center sm:justify-between sm:rounded-3xl sm:pt-0"
                      disabled={!isFormValid || isFormLoading}
                      onClick={() => placeOrder()}
                    >
                      {t('continue')} <span className="text-gray">{priceString(cart.currency_symbol, cart.total)}</span>
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </>
  );
}

const PromoCode = (props: {
  promoCode: string;
  setPromoCode: (value: string) => void;
  fetchDiscount: () => void;
  fetchStatus: 'error' | 'idle' | 'fetching';
  clearPromoCode: () => void;
}) => {
  const { t } = useTranslation('checkout');
  const { cart, applyDiscount } = useContext(CartContext);

  return (
    <div className="w-full">
      <label>
        {!cart.discount ? (
          <div
            className={`flex h-11 w-full flex-row items-center justify-between rounded-lg bg-gray px-3 ${props.fetchStatus === 'error' ? 'bg-red/5 text-red' : ''}`}
          >
            <input
              className="h-full w-full bg-transparent focus:outline-none"
              placeholder={t('addPromoCode')}
              type="text"
              value={props.promoCode}
              onInput={e => props.setPromoCode(e.currentTarget.value)}
            />
            {props.fetchStatus === 'idle' ? (
              <button
                className="disabled:bg-lighter-gray h-6 rounded-xl bg-black px-3.5 text-center text-xs uppercase text-white disabled:cursor-not-allowed disabled:text-dark-gray"
                onClick={() => props.fetchDiscount()}
                disabled={!props.promoCode}
              >
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
        ) : (
          <div className="flex h-11 w-full flex-row items-center justify-between rounded-lg bg-light-green/10 px-3">
            <div className="flex flex-row items-center justify-start gap-2.5">
              <Icons.check className="size-4 fill-light-green text-light-green" />
              <p className="text-sm text-light-green">
                {t('discountSaved', { discount: priceString(cart.currency_symbol, cart.discount_amount) })}
              </p>
            </div>
            <button className="text-light-green" onClick={() => applyDiscount()}>
              <Icons.close className="size-4 fill-light-green" />
            </button>
          </div>
        )}
        {props.fetchStatus === 'error' && <p className="pt-1 text-sm text-red">{t('invalidPromoCode')}</p>}
        {cart.discount && (
          <p className="pt-1 text-sm text-light-green">
            {t('discountApplied', {
              discount: cart.discount.value + '%',
              code: cart.discount.code,
            })}
          </p>
        )}
      </label>
    </div>
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

const TotalCostInfo = (props: { cart: Cart }) => {
  const [shippingCost, setShippingCost] = useState(10);

  useEffect(() => {
    if (props.cart.currency_symbol === 'BYN') {
      setShippingCost(25);
    } else {
      setShippingCost(10);
    }
  }, [props.cart.currency_symbol]);

  const { t } = useTranslation('checkout');

  return (
    <div className="flex w-full flex-col gap-3 px-5 pb-24">
      <div className="mt-4 flex w-full flex-row items-center justify-between">
        <p className="text-base uppercase text-black">{t('total')}</p>
        <p className="text-base text-black">{priceString(props.cart.currency_symbol, props.cart.total)}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">{t('subtotal')}</p>
        <p className="text-sm text-gray-light sm:text-base">
          {priceString(props.cart.currency_symbol, props.cart.subtotal)}
        </p>
      </div>
      {props.cart.discount_amount > 0 && (
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-sm text-gray-light sm:text-base">{t('discount')}</p>
          <p className="text-sm text-gray-light sm:text-base">
            -{props.cart.discount_amount}
            {props.cart.currency_symbol} ({props.cart.discount?.value}%)
          </p>
        </div>
      )}
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">{t('customTailoring')}</p>
        <p className="text-sm text-gray-light sm:text-base">{t('free')}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm text-gray-light sm:text-base">{t('worldwide')}</p>
        <p className="text-sm text-gray-light sm:text-base">
          {t('approx')}
          {': '}
          {priceString(props.cart.currency_symbol, shippingCost)}
        </p>
      </div>
    </div>
  );
};

const TermsAndConditions = (props: any) => {
  const { t } = useTranslation('checkout');

  return (
    <div className="flex w-full flex-row items-center justify-center gap-2">
      <p className="text-start text-xs text-gray-light sm:text-center">{t('agree')}</p>
      <Link href="/terms">
        <Icons.infoCircle className="size-3.5 shrink-0" />
      </Link>
    </div>
  );
};

const PaymentMethodSelector = (props: {
  paymentMethod: 'bepaid' | 'paypal';
  setPaymentMethod: (value: 'bepaid' | 'paypal') => void;
}) => {
  const handleChange = (value: 'bepaid' | 'paypal') => {
    props.setPaymentMethod(value);
  };

  const selected = props.paymentMethod;

  const { t } = useTranslation('checkout');

  return (
    <div className="mb-8 flex w-full flex-col space-y-2.5 px-4">
      <div
        className="border-lighter-gray flex h-11 w-full items-center justify-between rounded-lg border has-[:checked]:border-black">
        <label className="flex h-11 w-full items-center space-x-3 px-2.5">
          <input
            type="radio"
            name="payment"
            value="bepaid"
            checked={selected === 'bepaid'}
            onChange={() => handleChange('bepaid')}
            className="radio radio-primary"
          />
          <div className="flex items-center space-x-2">
            <VisaIcon />
            <span>{t('creditCardViaBePaid')}</span>
          </div>
        </label>
      </div>

      <div
        className="border-lighter-gray flex h-11 w-full items-center justify-between rounded-lg border has-[:checked]:border-black">
        <label className="flex w-full items-center space-x-3 px-2.5">
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={selected === 'paypal'}
            onChange={() => handleChange('paypal')}
            className="radio radio-primary"
          />
          <div className="flex items-center space-x-2">
            <PaypalIcon />
            <span>{t('paypal')}</span>
          </div>
        </label>
      </div>
    </div>
  );
};

function VisaIcon() {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.5" width="20" height="20" rx="6" fill="#F8F8F8" />
      <path d="M11.8819 6.92517H8.09668V13.7283H11.8819V6.92517Z" fill="#FF5F00" />
      <path
        d="M8.34703 10.3264C8.34643 9.67121 8.49493 9.02445 8.78127 8.43513C9.06762 7.84581 9.4843 7.32937 9.99976 6.92492C9.36154 6.42327 8.59506 6.11132 7.78792 6.0247C6.98079 5.93808 6.16557 6.0803 5.43544 6.43511C4.70531 6.78991 4.08973 7.34298 3.65906 8.0311C3.22839 8.71922 3 9.51463 3 10.3264C3 11.1382 3.22839 11.9336 3.65906 12.6217C4.08973 13.3099 4.70531 13.8629 5.43544 14.2177C6.16557 14.5725 6.98079 14.7148 7.78792 14.6281C8.59506 14.5415 9.36154 14.2296 9.99976 13.7279C9.4843 13.3235 9.06762 12.807 8.78128 12.2177C8.49493 11.6284 8.34643 10.9816 8.34703 10.3264Z"
        fill="#EB001B"
      />
      <path
        d="M12.6737 6.00001C11.7037 5.9985 10.7617 6.32439 10 6.92492C10.515 7.32977 10.9314 7.84629 11.2177 8.43553C11.504 9.02476 11.6528 9.67131 11.6528 10.3264C11.6528 10.9815 11.504 11.6281 11.2177 12.2173C10.9314 12.8065 10.515 13.3231 10 13.7279C10.5422 14.1541 11.1785 14.4445 11.8557 14.5749C12.5329 14.7053 13.2315 14.6719 13.8932 14.4775C14.5549 14.2831 15.1605 13.9333 15.6596 13.4573C16.1587 12.9813 16.5367 12.3929 16.7622 11.7411C16.9877 11.0893 17.0541 10.3931 16.9559 9.71043C16.8577 9.02778 16.5977 8.37849 16.1977 7.81671C15.7976 7.25493 15.269 6.79694 14.656 6.48092C14.043 6.1649 13.3633 6.00001 12.6737 6.00001Z"
        fill="#F79E1B"
      />
    </svg>
  );
}

function PaypalIcon() {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.5" width="20" height="20" rx="6" fill="#C0E9FB" />
      <mask id="mask0_1357_4435" maskUnits="userSpaceOnUse" x="6" y="5" width="9" height="11">
        <path d="M14.4754 5.5H6V15.5H14.4754V5.5Z" fill="white" />
      </mask>
      <g mask="url(#mask0_1357_4435)">
        <path
          d="M8.40776 15.161L8.58108 14.0602L8.19502 14.0512H6.35156L7.63267 5.92817C7.63665 5.90364 7.64957 5.88078 7.66846 5.86454C7.68735 5.8483 7.71154 5.83936 7.73672 5.83936H10.845C11.877 5.83936 12.5891 6.05409 12.9609 6.47792C13.1352 6.67675 13.2462 6.88452 13.2999 7.11318C13.3562 7.35309 13.3573 7.63973 13.3022 7.98934L13.2982 8.01486V8.23886L13.4725 8.33761C13.6193 8.41549 13.736 8.50463 13.8255 8.6067C13.9746 8.77669 14.071 8.99275 14.1118 9.2489C14.1539 9.51235 14.14 9.82584 14.071 10.1807C13.9915 10.589 13.8629 10.9446 13.6893 11.2355C13.5295 11.5036 13.3261 11.726 13.0845 11.8983C12.8539 12.062 12.5798 12.1862 12.27 12.2658C11.9698 12.344 11.6274 12.3834 11.252 12.3834H11.0101C10.8371 12.3834 10.6691 12.4457 10.5372 12.5574C10.405 12.6713 10.3175 12.8271 10.2907 12.9975L10.2724 13.0966L9.96624 15.0368L9.95232 15.108C9.94867 15.1305 9.94238 15.1418 9.9331 15.1494C9.92481 15.1564 9.91288 15.161 9.90129 15.161H8.40776Z"
          fill="#253B80"
        />
        <path
          d="M13.6377 8.04102C13.6284 8.10034 13.6178 8.16097 13.6059 8.22327C13.196 10.3279 11.7936 11.0549 10.0025 11.0549H9.09054C8.87149 11.0549 8.68692 11.214 8.65279 11.43L8.18587 14.3912L8.05365 15.2306C8.03145 15.3724 8.1408 15.5003 8.28396 15.5003H9.90142C10.093 15.5003 10.2557 15.3612 10.2858 15.1723L10.3017 15.0901L10.6063 13.1575L10.6258 13.0515C10.6556 12.8619 10.8187 12.7227 11.0102 12.7227H11.2521C12.8192 12.7227 14.046 12.0865 14.4045 10.2453C14.5543 9.47622 14.4767 8.834 14.0804 8.38234C13.9605 8.24614 13.8117 8.13314 13.6377 8.04102Z"
          fill="#179BD7"
        />
        <path
          d="M13.2085 7.86979C13.1458 7.85157 13.0812 7.835 13.0149 7.82009C12.9483 7.8055 12.8801 7.79258 12.8098 7.78132C12.5639 7.74155 12.2945 7.72266 12.0059 7.72266H9.5696C9.50962 7.72266 9.45262 7.73625 9.40159 7.76077C9.28925 7.81478 9.20575 7.92116 9.18553 8.05139L8.66725 11.334L8.65234 11.4298C8.68648 11.2137 8.87105 11.0547 9.09009 11.0547H10.002C11.7931 11.0547 13.1955 10.3273 13.6055 8.22304C13.6177 8.16074 13.628 8.1001 13.6373 8.04078C13.5335 7.98577 13.4212 7.93872 13.3003 7.89862C13.2704 7.88868 13.2396 7.87907 13.2085 7.86979Z"
          fill="#222D65"
        />
        <path
          d="M9.18587 8.05128C9.20608 7.92105 9.28959 7.81467 9.40192 7.76099C9.45329 7.73647 9.50995 7.72288 9.56993 7.72288H12.0062C12.2949 7.72288 12.5643 7.74177 12.8102 7.78154C12.8804 7.79281 12.9487 7.80573 13.0153 7.82031C13.0815 7.83522 13.1462 7.85179 13.2088 7.87001C13.2399 7.8793 13.2708 7.8889 13.3009 7.89851C13.4219 7.93861 13.5342 7.986 13.6379 8.04067C13.7599 7.26293 13.6369 6.73339 13.2164 6.25388C12.7528 5.726 11.9161 5.5 10.8454 5.5H7.73708C7.51837 5.5 7.33181 5.65906 7.29801 5.87545L6.00331 14.082C5.97779 14.2444 6.10305 14.3909 6.26676 14.3909H8.18576L8.66759 11.3339L9.18587 8.05128Z"
          fill="#253B80"
        />
      </g>
    </svg>
  );
}

const getStaticProps = makeStaticProps(['checkout', 'common']);

export { getStaticPaths, getStaticProps };
